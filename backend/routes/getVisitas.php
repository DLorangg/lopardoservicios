<?php
include '../db.php';
require '../verificarToken.php'; // Verifica el token antes de continuar

// Obtener los parámetros de la solicitud
$rol = isset($_GET['rol']) ? $_GET['rol'] : '';
$limit = isset($_GET['limit']) ? $_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? $_GET['offset'] : 0;

// Validar que sean números enteros no negativos
if (filter_var($limit, FILTER_VALIDATE_INT) === false || filter_var($offset, FILTER_VALIDATE_INT) === false || (int)$limit < 0 || (int)$offset < 0) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['message' => 'Los parámetros limit y offset deben ser números enteros no negativos']);
    exit();
}

$limit = (int)$limit;
$offset = (int)$offset;

try {
    // Obtener el total de visitas registradas
    $sqlCount = 'SELECT COUNT(*) FROM visita';
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute();
    $total = (int)$stmtCount->fetchColumn();

    // Preparar y ejecutar la consulta para obtener las visitas con orden descendente
    $sql = 'SELECT * FROM visita ORDER BY Fecha DESC, IdVisita DESC LIMIT :limit OFFSET :offset';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Si el rol es 2, eliminar el campo Precio de las visitas
    if ($rol === '2') {
        $result = array_map(function($visit) {
            unset($visit['Precio']); // Eliminar el campo Precio
            return $visit;
        }, $result);
    }

    // Preparar la respuesta paginada
    $response = [
        'data' => $result,
        'total' => $total
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al obtener las visitas: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor']);
}
?>
