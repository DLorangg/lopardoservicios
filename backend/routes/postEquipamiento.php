<?php
include '../db.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['Nombre'])) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['Message' => 'Nombre del equipamiento no proporcionado']);
    exit;
}

$nombre = $data['Nombre'];

$sql = "INSERT INTO equipamiento (Nombre) VALUES (?)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre]);
    
    $insertId = $pdo->lastInsertId();
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'insertId' => $insertId]);
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al insertar equipamiento: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['Message' => 'Error en el servidor', 'error' => $e->getMessage()]);
}
?>
