<?php
header('Content-Type: application/json');
include '../db.php'; 

// Obtener los datos enviados por el cliente
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

// Validar que los datos requeridos estén presentes
if (!$username || !$currentPassword || !$newPassword) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
    exit;
}

try {
    // ✅ SEGURO: Obtener el hash de contraseña del usuario desde la BD
    $sql = 'SELECT Contraseña FROM usuarios WHERE Nombre = :username';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si el usuario existe
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales incorrectas']);
        exit;
    }

    // ✅ SEGURO: Verificar la contraseña actual usando password_verify()
    if (!password_verify($currentPassword, $user['Contraseña'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Contraseña actual incorrecta']);
        exit;
    }

    // ✅ SEGURO: Encriptar la nueva contraseña con password_hash()
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // ✅ SEGURO: Actualizar la contraseña con el hash generado
    $updateSql = 'UPDATE usuarios SET Contraseña = :newPassword WHERE Nombre = :username';
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([
        ':newPassword' => $hashedPassword,
        ':username' => $username
    ]);

    echo json_encode(['message' => 'Contraseña actualizada correctamente']);

} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al actualizar la contraseña: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor al actualizar la contraseña']);
}
?>
