<?php
include '../db.php'; // Asegúrate de ajustar la ruta a db.php según sea necesario
require '../verificarToken.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $sql = 'SELECT fecha, detalle, ingreso, egreso FROM caja WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'ID no válido']);
}
?>
