<?php
include '../db.php';

// Habilitar la visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    echo "Método DELETE recibido.\n";
    
    $idCliente = $_GET['IdCliente'];
    echo "ID Cliente recibido: $idCliente\n";

    if (!$idCliente) {
        http_response_code(400);
        echo json_encode(['message' => 'ID de cliente no proporcionado']);
        exit;
    }

    try {
        $sql = 'DELETE FROM cliente WHERE IdCliente = ?';
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$idCliente])) {
            echo json_encode(['success' => true, 'message' => 'Cliente eliminado exitosamente']);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                'message' => 'Error en el servidor al eliminar el cliente', 
                'error' => $errorInfo
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Error inesperado',
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Método HTTP no permitido']);
}
?>
