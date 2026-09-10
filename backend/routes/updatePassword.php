<?php
header('Content-Type: application/json');
require '../db.php';

// 1. Validar origen CORS si el header Origin está presente
if (isset($_SERVER['HTTP_ORIGIN']) && !empty($_SERVER['HTTP_ORIGIN'])) {
    if (isset($allowed_origins) && !in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        http_response_code(403);
        echo json_encode(['error' => 'Origen no permitido por la política CORS']);
        exit();
    }
}

// 2. Verificar que el método HTTP sea POST o PUT
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';
if ($requestMethod !== 'POST' && $requestMethod !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido. Utilice POST o PUT.']);
    exit();
}

// 3. Control de autenticación estricto con validación de JWT Bearer Token
require '../verificarToken.php';

// Validar que el token haya proporcionado la identidad del usuario
if (empty($usuarioLogueado) || (!isset($usuarioLogueado['id_usuario']) && !isset($usuarioLogueado['user']))) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado"]);
    exit();
}

// 4. Obtener datos de la petición (NUNCA confiamos en id_usuario o username enviados en el body)
$data = json_decode(file_get_contents('php://input'), true);
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

// Validar que los campos de contraseña requeridos estén presentes
if (!$currentPassword || !$newPassword) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos. Proporcione contraseña actual y nueva.']);
    exit();
}

// Identidad extraída exclusivamente del token verificado (prevención IDOR)
$authenticatedId = $usuarioLogueado['id_usuario'] ?? null;
$authenticatedUsername = $usuarioLogueado['user'] ?? null;

try {
    // Buscar al usuario exclusivamente por su identificador verificado
    if ($authenticatedId) {
        $sql = 'SELECT IdUsuario, Nombre, Contraseña FROM usuarios WHERE IdUsuario = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $authenticatedId]);
    } else {
        $sql = 'SELECT IdUsuario, Nombre, Contraseña FROM usuarios WHERE Nombre = :username';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':username' => $authenticatedUsername]);
    }
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si el usuario existe
    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "No autorizado"]);
        exit();
    }

    // Validar que la contraseña actual coincida usando password_verify()
    if (!password_verify($currentPassword, $user['Contraseña'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Contraseña actual incorrecta']);
        exit();
    }

    // Hashear la nueva contraseña usando PASSWORD_BCRYPT explícito
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Actualizar la contraseña y marcar cambio_clave_requerido = 0 usando el ID autenticado
    try {
        $updateSql = 'UPDATE usuarios SET Contraseña = :newPassword, cambio_clave_requerido = 0 WHERE IdUsuario = :id';
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            ':newPassword' => $hashedPassword,
            ':id' => $user['IdUsuario']
        ]);
    } catch (PDOException $e) {
        // Fallback por si la columna cambio_clave_requerido aún no fue añadida en phpMyAdmin
        if (strpos($e->getMessage(), 'cambio_clave_requerido') !== false) {
            $updateSql = 'UPDATE usuarios SET Contraseña = :newPassword WHERE IdUsuario = :id';
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([
                ':newPassword' => $hashedPassword,
                ':id' => $user['IdUsuario']
            ]);
        } else {
            throw $e;
        }
    }

    echo json_encode(['message' => 'Contraseña actualizada correctamente']);

} catch (PDOException $e) {
    error_log('Error al actualizar la contraseña: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor al actualizar la contraseña']);
}
?>
