<?php
include '../db.php';
require '../verificarToken.php';

// Obtener el rol del query
$rol = isset($_GET['rol']) ? $_GET['rol'] : '';

// Verificar el rol
if ($rol !== '2') {
    $sql = 'SELECT * FROM caja';
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($result);
    } catch (PDOException $e) {
        // Manejo de errores
        error_log('Error al obtener la caja: ' . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['message' => 'Error en el servidor']);
    }
} else {
    // Acceso denegado
    header('Content-Type: application/json');
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
}
?>
