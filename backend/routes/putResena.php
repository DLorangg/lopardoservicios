<?php
include '../db.php';
require '../verificarToken.php'; 

// Obtener los datos desde el cuerpo de la solicitud (JSON)
$input = json_decode(file_get_contents('php://input'), true);

// El ID puede venir por query string o en el cuerpo JSON
$id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);
$estado = isset($input['estado']) ? trim($input['estado']) : null;

if ($id <= 0 || !in_array($estado, ['aprobado', 'rechazado'])) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'ID no válido o estado incorrecto (debe ser "aprobado" o "rechazado").']);
    exit;
}

$sql = "UPDATE resenas SET estado = ? WHERE id = ?";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([$estado, $id]);
    
    // Verificamos si realmente existe el registro en la BD
    $checkSql = "SELECT COUNT(*) FROM resenas WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$id]);
    
    if ($checkStmt->fetchColumn() == 0) {
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['error' => 'Reseña no encontrada']);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Estado de la reseña actualizado exitosamente']);
    }
} catch (PDOException $e) {
    error_log('Error al actualizar reseña: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor al actualizar la reseña']);
}
?>
