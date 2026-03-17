<?php
include '../db.php'; 

// Obtener los parámetros de la solicitud
$rol = isset($_GET['rol']) ? $_GET['rol'] : '';
$fechaCobro = isset($_GET['fechaCobro']) ? $_GET['fechaCobro'] : '';
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
$fechaDesde = isset($_GET['fechaDesde']) ? $_GET['fechaDesde'] : '';
$fechaHasta = isset($_GET['fechaHasta']) ? $_GET['fechaHasta'] : '';
$idEstado = isset($_GET['idEstado']) ? $_GET['idEstado'] : '';
$idCliente = isset($_GET['idCliente']) ? $_GET['idCliente'] : '';

// Preparar la consulta SQL
$sql = 'SELECT * FROM visita WHERE 1=1';
$params = [];

// Añadir condiciones a la consulta
if ($fechaCobro) {
    $sql .= ' AND FechaCobro = ?';
    $params[] = $fechaCobro;
}

// Si llega un rango de fechas, usar BETWEEN
if ($fechaDesde && $fechaHasta) {
    $sql .= ' AND Fecha BETWEEN ? AND ?';
    $params[] = $fechaDesde;
    $params[] = $fechaHasta;
}
// Si no hay rango, pero sí una sola fecha, usá ese filtro
elseif ($fecha) {
    $sql .= ' AND Fecha = ?';
    $params[] = $fecha;
}

if ($idEstado) {
    $sql .= ' AND IdEstado = ?';
    $params[] = $idEstado;
}

if ($idCliente) {
    $sql .= ' AND IdCliente = ?';
    $params[] = $idCliente;
}

$stmt = $pdo->prepare($sql);

try {
    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si el rol es 2, eliminar el campo Precio
    if ($rol === '2') {
        $filteredResult = array_map(function($visit) {
            unset($visit['Precio']);
            return $visit;
        }, $result);
        header('Content-Type: application/json');
        echo json_encode($filteredResult);
    } else {
        header('Content-Type: application/json');
        echo json_encode($result);
    }
} catch (PDOException $e) {
    error_log('Error al obtener las visitas filtradas: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor']);
}
?>
