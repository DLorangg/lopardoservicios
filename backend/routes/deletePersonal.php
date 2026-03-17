<?php
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    $idPersonal = $_GET['IdPersonal'];

    if (!$idPersonal) {
        http_response_code(400);
        echo json_encode(['message' => 'ID de personal no proporcionado']);
        exit;
    }

    try {
        $sql = 'DELETE FROM personal WHERE IdPersonal = ?';
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$idPersonal])) {
            echo json_encode(['success' => true, 'message' => 'Personal eliminado exitosamente']);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                'message' => 'Error en el servidor al eliminar el personal', 
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
