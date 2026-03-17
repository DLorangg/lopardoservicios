<?php
include '../db.php'; 

// Obtener los datos enviados por el cliente
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Verificar la contraseña actual
if ($currentPassword !== '1234') {
    header('Content-Type: application/json');
    http_response_code(401);
    echo json_encode(['error' => 'Contraseña actual incorrecta']);
    exit;
}

// Preparar y ejecutar la consulta para actualizar la contraseña
$sql = 'UPDATE usuarios SET Contraseña = :newPassword WHERE Nombre = :username';
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        ':newPassword' => $newPassword,
        ':username' => $username
    ]);
    
    // Confirmar que la contraseña se actualizó correctamente
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Contraseña actualizada correctamente']);
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al actualizar la contraseña: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor al actualizar la contraseña']);
}
?>
