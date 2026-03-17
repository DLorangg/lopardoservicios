<?php
include '../db.php'; // Asegúrate de ajustar la ruta a db.php según sea necesario

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Lee el cuerpo de la solicitud para obtener el ID
    parse_str(file_get_contents("php://input"), $data);
    $id = isset($data['id']) ? $data['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de equipamiento no proporcionado']);
        exit;
    }

    $sql = "DELETE FROM equipamiento WHERE IdEquipamiento = ?";
    $stmt = $pdo->prepare($sql);

    if ($stmt->execute([$id])) {
        echo json_encode(['message' => 'Equipamiento eliminado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar el equipamiento']);
    }
}
?>
