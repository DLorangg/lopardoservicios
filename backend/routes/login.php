<?php
header('Content-Type: application/json');
require '../db.php'; // Incluye la conexión y el CORS

// Función auxiliar para codificar en formato seguro para URLs (requerido por JWT)
if (!function_exists('base64url_encode')) {
    function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

// Función para obtener la IP real del cliente (considerando Cloudflare y Proxies)
function get_client_ip() {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    if (strpos($ip, ',') !== false) {
        $parts = explode(',', $ip);
        $ip = trim($parts[0]);
    }
    return substr(trim($ip), 0, 45);
}

$clientIp = get_client_ip();
$intentoInfo = null;

// --- CONTROL DE RATE LIMITING (5 intentos fallidos en 15 minutos) ---
try {
    $stmtCheck = $pdo->prepare("SELECT intentos, bloqueado_hasta, actualizado_en FROM intentos_login WHERE ip = :ip");
    $stmtCheck->execute([':ip' => $clientIp]);
    $intentoInfo = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($intentoInfo) {
        $now = time();
        $bloqueadoHasta = !empty($intentoInfo['bloqueado_hasta']) ? strtotime($intentoInfo['bloqueado_hasta']) : null;
        $actualizadoEn = strtotime($intentoInfo['actualizado_en']);

        // Si la IP está temporalmente bloqueada
        if ($bloqueadoHasta && $bloqueadoHasta > $now) {
            http_response_code(429);
            echo json_encode(["error" => "Demasiados intentos fallidos. Tu acceso está temporalmente bloqueado por 15 minutos."]);
            exit();
        }

        // Si el bloqueo expiró o pasaron más de 15 minutos desde el último intento, reiniciamos el contador
        if (($bloqueadoHasta && $bloqueadoHasta <= $now) || ($now - $actualizadoEn > 15 * 60)) {
            $pdo->prepare("DELETE FROM intentos_login WHERE ip = :ip")->execute([':ip' => $clientIp]);
            $intentoInfo = null;
        }
    }
} catch (PDOException $e) {
    // Si la tabla aún no existe, registramos el log para no interrumpir el login
    error_log("Error consultando intentos_login: " . $e->getMessage());
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username && $password) {
    try {
        // Buscamos al usuario
        $sql = "SELECT * FROM usuarios WHERE Nombre = :username";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificamos contraseña
        if ($user && password_verify($password, $user['Contraseña'])) {
            
            // Login exitoso: Limpiamos los intentos fallidos de esta IP
            try {
                $stmtClear = $pdo->prepare("DELETE FROM intentos_login WHERE ip = :ip");
                $stmtClear->execute([':ip' => $clientIp]);
            } catch (PDOException $e) {
                error_log("Error limpiando intentos_login: " . $e->getMessage());
            }

            // Obtener el identificador numérico de la tabla usuarios (IdUsuario)
            $userId = $user['IdUsuario'] ?? $user['id_usuario'] ?? $user['id'] ?? null;

            // Determinar si requiere cambio de clave (si la columna existe en la BD o si tiene la inicial '1234')
            $cambioRequerido = isset($user['cambio_clave_requerido'])
                ? ((int)$user['cambio_clave_requerido'] === 1)
                : ($password === '1234');

            // --- INICIO GENERACIÓN DE JWT ---
            $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
            
            $payload = json_encode([
                'id_usuario' => $userId,
                'user' => $user['Nombre'],
                'role' => $user['Rol'],
                'cambio_clave' => $cambioRequerido ? 1 : 0,
                'iat' => time(), // Emitido ahora
                'exp' => time() + (60 * 60 * 24) // Expira en 24 horas
            ]);

            $base64UrlHeader = base64url_encode($header);
            $base64UrlPayload = base64url_encode($payload);

            // La clave secreta (Idealmente esto debe ir en tus variables de entorno en el futuro)
            $secret = getenv('JWT_SECRET') ?: 'mi_clave_super_secreta_lopardo_2026';
            
            // Creamos la firma
            $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
            $base64UrlSignature = base64url_encode($signature);

            // Unimos todo para formar el token final
            $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
            // --- FIN GENERACIÓN DE JWT ---

            // Enviamos la respuesta incluyendo el Token
            echo json_encode([
                'idUsuario' => $userId,
                'userName' => $user['Nombre'],
                'userRole' => $user['Rol'],
                'cambioClaveRequerido' => $cambioRequerido,
                'token' => $jwt,
                'message' => 'Inicio de sesión exitoso'
            ]);
        } else {
            // Login fallido: Registrar o incrementar intento fallido
            try {
                $intentosActuales = ($intentoInfo ? (int)$intentoInfo['intentos'] : 0) + 1;
                if ($intentosActuales >= 5) {
                    $stmtFail = $pdo->prepare("
                        INSERT INTO intentos_login (ip, intentos, bloqueado_hasta) 
                        VALUES (:ip, :intentos, DATE_ADD(NOW(), INTERVAL 15 MINUTE))
                        ON DUPLICATE KEY UPDATE 
                            intentos = :intentos_up, 
                            bloqueado_hasta = DATE_ADD(NOW(), INTERVAL 15 MINUTE),
                            actualizado_en = CURRENT_TIMESTAMP
                    ");
                    $stmtFail->execute([
                        ':ip' => $clientIp,
                        ':intentos' => $intentosActuales,
                        ':intentos_up' => $intentosActuales
                    ]);

                    http_response_code(429);
                    echo json_encode(["error" => "Demasiados intentos fallidos. Tu acceso está temporalmente bloqueado por 15 minutos."]);
                    exit();
                } else {
                    $stmtFail = $pdo->prepare("
                        INSERT INTO intentos_login (ip, intentos, bloqueado_hasta) 
                        VALUES (:ip, :intentos, NULL)
                        ON DUPLICATE KEY UPDATE 
                            intentos = :intentos_up, 
                            actualizado_en = CURRENT_TIMESTAMP
                    ");
                    $stmtFail->execute([
                        ':ip' => $clientIp,
                        ':intentos' => $intentosActuales,
                        ':intentos_up' => $intentosActuales
                    ]);
                }
            } catch (PDOException $e) {
                error_log("Error registrando intento fallido: " . $e->getMessage());
            }

            http_response_code(401);
            echo json_encode(['error' => 'Usuario o contraseña incorrectos']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en el servidor']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
}
?>