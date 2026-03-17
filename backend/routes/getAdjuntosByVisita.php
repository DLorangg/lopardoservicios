<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../db.php';

$idVisita = $_GET['id'] ?? null;

if (!$idVisita) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de visita no proporcionado']);
    exit;
}

try {
    // Fetch associated attachments
    $sqlAdjuntos = "SELECT IdAdjunto, IdVisita, URL, NombreOriginal, Tipo, FechaSubida FROM adjunto WHERE IdVisita = ?";
    $stmtAdjuntos = $pdo->prepare($sqlAdjuntos);
    $stmtAdjuntos->execute([$idVisita]);
    $adjuntos = $stmtAdjuntos->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($adjuntos);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor al obtener los adjuntos.', 'error' => $e->getMessage()]);
}
?>