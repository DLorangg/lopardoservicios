<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include '../db.php';

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$idAdjunto = $_GET['id'] ?? null;

if (!$idAdjunto) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de adjunto no proporcionado']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Get the file path from the database
    $sqlSelect = "SELECT URL FROM adjunto WHERE IdAdjunto = ?";
    $stmtSelect = $pdo->prepare($sqlSelect);
    $stmtSelect->execute([$idAdjunto]);
    $adjunto = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if (!$adjunto) {
        http_response_code(404);
        echo json_encode(['message' => 'Adjunto no encontrado.']);
        $pdo->rollBack();
        exit;
    }

    $filePath = '../../' . $adjunto['URL']; // Adjust path to be relative to this script

    // 2. Delete the file from the filesystem
    if (file_exists($filePath)) {
        if (!unlink($filePath)) {
            throw new Exception("No se pudo eliminar el archivo: $filePath");
        }
    }

    // 3. Delete the record from the database
    $sqlDelete = "DELETE FROM adjunto WHERE IdAdjunto = ?";
    $stmtDelete = $pdo->prepare($sqlDelete);
    $stmtDelete->execute([$idAdjunto]);

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Adjunto eliminado exitosamente.']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Error al eliminar el adjunto.', 'details' => $e->getMessage()]);
}
?>