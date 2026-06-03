<?php
header('Content-Type: application/json');
require '../db.php'; // Incluye la conexión y el CORS

// Función auxiliar para codificar en formato seguro para URLs (requerido por JWT)
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
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
            
            // --- INICIO GENERACIÓN DE JWT ---
            $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
            
            $payload = json_encode([
                'user' => $user['Nombre'],
                'role' => $user['Rol'],
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
                'userName' => $user['Nombre'],
                'userRole' => $user['Rol'],
                'token' => $jwt,
                'message' => 'Inicio de sesión exitoso'
            ]);
        } else {
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