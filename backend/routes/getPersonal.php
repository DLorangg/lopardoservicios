<?php
include '../db.php';
require '../verificarToken.php'; 

$sql = 'SELECT * FROM personal';
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al obtener el personal: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['Message' => 'Error en el servidor']);
}
?>
