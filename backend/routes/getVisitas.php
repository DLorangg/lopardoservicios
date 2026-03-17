<?php
include '../db.php';

// Obtener los parámetros de la solicitud
$rol = isset($_GET['rol']) ? $_GET['rol'] : '';

// Preparar y ejecutar la consulta para obtener las visitas
$sql = 'SELECT * FROM visita';
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Si el rol es 2, eliminar el campo Precio de las visitas
    if ($rol === '2') {
        $filteredResult = array_map(function($visit) {
            unset($visit['Precio']); // Eliminar el campo Precio
            return $visit;
        }, $result);
        header('Content-Type: application/json');
        echo json_encode($filteredResult);
    } else {
        header('Content-Type: application/json');
        echo json_encode($result);
    }
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al obtener las visitas: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor']);
}
?>
