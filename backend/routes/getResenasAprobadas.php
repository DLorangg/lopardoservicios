<?php
include '../db.php';
// ¡Sin verificarToken.php porque esto lo lee la página pública!

$sql = "SELECT nombre_cliente, empresa, comentario FROM resenas WHERE estado = 'aprobado' ORDER BY fecha DESC";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    error_log('Error al obtener reseñas aprobadas: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>