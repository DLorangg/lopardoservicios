<?php
include '../db.php'; 

$id = isset($_GET['id']) ? $_GET['id'] : null; // Obtener el ID del parámetro de consulta

if ($id === null) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['message' => 'ID no proporcionado']);
    exit();
}

$sql = 'SELECT * FROM equipamiento WHERE IdEquipamiento = ?';
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result === false) {
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['message' => 'Equipamiento no encontrado']);
    } else {
        header('Content-Type: application/json');
        echo json_encode($result);
    }
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al obtener equipamiento: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor']);
}
?>
