<?php
include '../db.php'; 

// Habilitar la visualización de errores para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verificar si se ha pasado el parámetro 'IdCliente' en la URL
if (isset($_GET['IdCliente'])) {
    $idCliente = intval($_GET['IdCliente']); // Convertir el parámetro a entero para mayor seguridad

    if ($idCliente > 0) {
        // Consulta para obtener el cliente específico
        $sql = 'SELECT * FROM cliente WHERE IdCliente = ?';
        $stmt = $pdo->prepare($sql);
        
        try {
            $stmt->execute([$idCliente]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                header('Content-Type: application/json');
                echo json_encode($result); // Devuelve el cliente encontrado
            } else {
                // Si no se encuentra un cliente con ese IdCliente
                header('Content-Type: application/json');
                http_response_code(404);
                echo json_encode(['Message' => 'Cliente no encontrado']);
            }
        } catch (PDOException $e) {
            // Manejo de errores de SQL
            error_log('Error al obtener el cliente: ' . $e->getMessage());
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['Message' => 'Error en el servidor']);
        }
    } else {
        // Manejar el caso en el que 'IdCliente' no es válido
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['Message' => 'ID de cliente no válido']);
    }
} else {
    // Si no se pasa el parámetro 'IdCliente', devolver todos los clientes
    $sql = 'SELECT * FROM cliente';
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($result); // Devuelve todos los clientes
    } catch (PDOException $e) {
        // Manejo de errores
        error_log('Error al obtener los clientes: ' . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['Message' => 'Error en el servidor']);
    }
}
?>
