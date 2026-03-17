<?php
include '../db.php'; // Asegúrate de ajustar la ruta a db.php según sea necesario

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];

    $sql = 'DELETE FROM caja WHERE id = ?';
    $stmt = $pdo->prepare($sql);

    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true, 'message' => 'Registro eliminado exitosamente']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error en el servidor al eliminar el registro']);
    }
}
?>
