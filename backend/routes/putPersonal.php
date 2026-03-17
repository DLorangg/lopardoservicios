<?php
include '../db.php'; 

// Obtener el ID del personal desde los parámetros de la URL
$idPersonal = $_GET['id'];

// Obtener los datos del personal desde el cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {
    $nombre = $input['Nombre'];

    $sql = "UPDATE personal SET Nombre = ? WHERE IdPersonal = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$nombre, $idPersonal]);
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Personal actualizado exitosamente']);
    } catch (PDOException $e) {
        // Manejo de errores
        error_log('Error al actualizar personal: ' . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al actualizar personal']);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
}
?>
