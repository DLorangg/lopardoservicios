<?php
include '../db.php'; // Asegúrate de ajustar la ruta a db.php según sea necesario

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $urlParts = explode('/', $_SERVER['REQUEST_URI']);
    $visitaId = end($urlParts);

    $sql = "DELETE FROM visita WHERE IdVisita = ?";
    $stmt = $pdo->prepare($sql);

    if ($stmt->execute([$visitaId])) {
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Visita no encontrada']);
        } else {
            echo json_encode(['message' => 'Visita eliminada exitosamente']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al eliminar la visita']);
    }
}
?>
