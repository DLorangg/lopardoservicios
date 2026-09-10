<?php
header('Content-Type: application/json');
require '../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. GET: Obtener reseñas (Público y Admin)
if ($method === 'GET') {
    $isAdmin = false;
    
    // Detección opcional de token para responder según permisos
    $headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) === 3) {
            $secret = getenv('JWT_SECRET') ?: 'mi_clave_super_secreta_lopardo_2026';
            $sig = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $secret, true);
            $base64Sig = rtrim(strtr(base64_encode($sig), '+/', '-_'), '=');
            if (hash_equals($base64Sig, $tokenParts[2])) {
                $payload = json_decode(base64_decode($tokenParts[1]), true);
                if (isset($payload['exp']) && $payload['exp'] >= time()) {
                    if (isset($payload['role']) && (string)$payload['role'] === '1') {
                        $isAdmin = true;
                    }
                }
            }
        }
    }

    try {
        // Si no es admin o si se solicitan explícitamente solo aprobadas
        $soloAprobadas = isset($_GET['aprobadas']) || (!$isAdmin && !isset($_GET['todas']));
        if ($soloAprobadas) {
            $sql = 'SELECT * FROM resenas WHERE estado = "aprobado" ORDER BY fecha DESC';
        } else {
            $sql = 'SELECT * FROM resenas ORDER BY fecha DESC';
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch (PDOException $e) {
        error_log('Error al obtener reseñas: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener las reseñas']);
    }
    exit();
}

// 2. POST: Crear reseña (Pública / Clientes)
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['nombre']) && !isset($input['nombre_cliente'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre del cliente es un campo requerido.']);
        exit();
    }
    if (!isset($input['comentario']) || trim($input['comentario']) === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario es un campo requerido.']);
        exit();
    }

    $rawNombre = $input['nombre'] ?? $input['nombre_cliente'];
    $nombreCliente = mb_convert_case(trim($rawNombre), MB_CASE_TITLE, "UTF-8");
    $comentario = trim($input['comentario']);
    $empresa = isset($input['empresa']) && trim($input['empresa']) !== '' ? trim($input['empresa']) : null;

    if (mb_strlen($comentario, 'UTF-8') > 320) {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede superar los 320 caracteres.']);
        exit();
    }

    try {
        $sql = "INSERT INTO resenas (nombre_cliente, empresa, comentario, estado) VALUES (?, ?, ?, 'pendiente')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombreCliente, $empresa, $comentario]);
        echo json_encode(['success' => true, 'message' => 'Reseña enviada exitosamente. Será revisada por un administrador.']);
    } catch (PDOException $e) {
        error_log('Error al insertar reseña: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al crear la reseña']);
    }
    exit();
}

// --- OPERACIONES DE ADMINISTRACIÓN (PUT y DELETE requieren JWT de Admin) ---
require '../verificarToken.php';

if (!isset($usuarioLogueado['role']) || (string)$usuarioLogueado['role'] !== '1') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit();
}

// 3. PUT: Actualizar / Moderar reseña
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de reseña no válido.']);
        exit();
    }

    $updates = [];
    $params = [];

    // Normalizar nombre: cada palabra comienza con mayúscula
    if (isset($input['nombre']) || isset($input['nombre_cliente'])) {
        $rawNombre = $input['nombre'] ?? $input['nombre_cliente'];
        $nombreNormalizado = mb_convert_case(trim($rawNombre), MB_CASE_TITLE, "UTF-8");
        if ($nombreNormalizado === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre no puede estar vacío.']);
            exit();
        }
        $updates[] = "nombre_cliente = ?";
        $params[] = $nombreNormalizado;
    }

    // Validar comentario: máximo 320 caracteres
    if (isset($input['comentario'])) {
        $comentario = trim($input['comentario']);
        if ($comentario === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El comentario no puede estar vacío.']);
            exit();
        }
        if (mb_strlen($comentario, 'UTF-8') > 320) {
            http_response_code(400);
            echo json_encode(['error' => 'El comentario no puede superar los 320 caracteres.']);
            exit();
        }
        $updates[] = "comentario = ?";
        $params[] = $comentario;
    }

    // Empresa
    if (isset($input['empresa'])) {
        $empresa = trim($input['empresa']);
        $updates[] = "empresa = ?";
        $params[] = ($empresa !== '') ? $empresa : null;
    }

    // Estado
    if (isset($input['estado'])) {
        $estado = trim($input['estado']);
        if (!in_array($estado, ['pendiente', 'aprobado', 'rechazado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Estado no válido. Debe ser "pendiente", "aprobado" o "rechazado".']);
            exit();
        }
        $updates[] = "estado = ?";
        $params[] = $estado;
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No se proporcionaron campos para actualizar.']);
        exit();
    }

    try {
        $params[] = $id;
        $sql = "UPDATE resenas SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Comprobar si existe la reseña
        $checkStmt = $pdo->prepare("SELECT id FROM resenas WHERE id = ?");
        $checkStmt->execute([$id]);
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Reseña no encontrada.']);
            exit();
        }

        echo json_encode(['success' => true, 'message' => 'Reseña actualizada exitosamente.']);
    } catch (PDOException $e) {
        error_log('Error al actualizar reseña: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error interno al actualizar la reseña.']);
    }
    exit();
}

// 4. DELETE: Eliminar reseña (físico o activo = 0)
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de reseña no válido.']);
        exit();
    }

    try {
        $checkStmt = $pdo->prepare("SELECT id FROM resenas WHERE id = ?");
        $checkStmt->execute([$id]);
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Reseña no encontrada.']);
            exit();
        }

        // Si la columna activo existe, marcarla inactiva; si no, eliminar el registro
        try {
            $stmt = $pdo->prepare("UPDATE resenas SET activo = 0 WHERE id = ?");
            $stmt->execute([$id]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'activo') !== false) {
                $stmtDel = $pdo->prepare("DELETE FROM resenas WHERE id = ?");
                $stmtDel->execute([$id]);
            } else {
                throw $e;
            }
        }

        echo json_encode(['success' => true, 'message' => 'Reseña eliminada exitosamente.']);
    } catch (PDOException $e) {
        error_log('Error al eliminar reseña: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error interno al eliminar la reseña.']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
