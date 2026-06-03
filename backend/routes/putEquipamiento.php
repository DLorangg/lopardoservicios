<?php
include '../db.php';
require '../verificarToken.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT); // Obtener los datos enviados en la solicitud PUT

    $id = $_GET['id'];
    $nombre = $_PUT['Nombre'];

    $sql = "UPDATE equipamiento SET Nombre = ? WHERE IdEquipamiento = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$nombre, $id]);
        echo json_encode(["message" => "Equipamiento actualizado correctamente"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar el equipamiento", "details" => $e->getMessage()]);
    }
}
?>
