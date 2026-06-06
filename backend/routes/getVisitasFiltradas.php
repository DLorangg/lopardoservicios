<?php
include '../db.php';
require '../verificarToken.php'; 

// Obtener los parámetros de la solicitud
$rol = isset($_GET['rol']) ? $_GET['rol'] : '';
$fechaCobro = isset($_GET['fechaCobro']) ? $_GET['fechaCobro'] : '';
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
$fechaDesde = isset($_GET['fechaDesde']) ? $_GET['fechaDesde'] : '';
$fechaHasta = isset($_GET['fechaHasta']) ? $_GET['fechaHasta'] : '';
$idEstado = isset($_GET['idEstado']) ? $_GET['idEstado'] : '';
$idCliente = isset($_GET['idCliente']) ? $_GET['idCliente'] : '';

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

// Preparar la consulta SQL
$sql = 'SELECT * FROM visita WHERE 1=1';
$sqlCount = 'SELECT COUNT(*) FROM visita WHERE 1=1';
$params = [];
$paramsCount = [];

// Añadir condiciones a la consulta
if ($fechaCobro) {
    $sql .= ' AND FechaCobro = ?';
    $sqlCount .= ' AND FechaCobro = ?';
    $params[] = $fechaCobro;
    $paramsCount[] = $fechaCobro;
}

// Si llega un rango de fechas, usar BETWEEN
if ($fechaDesde && $fechaHasta) {
    $sql .= ' AND Fecha BETWEEN ? AND ?';
    $sqlCount .= ' AND Fecha BETWEEN ? AND ?';
    $params[] = $fechaDesde;
    $params[] = $fechaHasta;
    $paramsCount[] = $fechaDesde;
    $paramsCount[] = $fechaHasta;
}
// Si no hay rango, pero sí una sola fecha, usá ese filtro
elseif ($fecha) {
    $sql .= ' AND Fecha = ?';
    $sqlCount .= ' AND Fecha = ?';
    $params[] = $fecha;
    $paramsCount[] = $fecha;
}

if ($idEstado) {
    $sql .= ' AND IdEstado = ?';
    $sqlCount .= ' AND IdEstado = ?';
    $params[] = $idEstado;
    $paramsCount[] = $idEstado;
}

if ($idCliente) {
    $sql .= ' AND IdCliente = ?';
    $sqlCount .= ' AND IdCliente = ?';
    $params[] = $idCliente;
    $paramsCount[] = $idCliente;
}

try {
    // Obtener el total de visitas registradas para el filtro
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute($paramsCount);
    $total = (int)$stmtCount->fetchColumn();

    // Añadir paginación y orden descendente
    $sql .= ' ORDER BY Fecha DESC, IdVisita DESC LIMIT ? OFFSET ?';
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key + 1, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si el rol es 2, eliminar el campo Precio
    if ($rol === '2') {
        $result = array_map(function($visit) {
            unset($visit['Precio']);
            return $visit;
        }, $result);
    }

    $response = [
        'data' => $result,
        'total' => $total
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (PDOException $e) {
    error_log('Error al obtener las visitas filtradas: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor']);
}
?>
