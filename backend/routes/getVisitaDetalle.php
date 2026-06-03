<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../db.php';
require '../verificarToken.php';

$idVisita = $_GET['idVisita'] ?? null;

if (!$idVisita) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de visita no proporcionado']);
    exit;
}

try {
    // 1. Fetch main visit data
    $sqlVisita = "SELECT * FROM visita WHERE IdVisita = ?";
    $stmtVisita = $pdo->prepare($sqlVisita);
    $stmtVisita->execute([$idVisita]);
    $visita = $stmtVisita->fetch(PDO::FETCH_ASSOC);

    if (!$visita) {
        http_response_code(404);
        echo json_encode(['message' => 'Visita no encontrada']);
        exit;
    }

    // 2. Fetch associated attachments
    $sqlAdjuntos = "SELECT IdAdjunto, IdVisita, URL, NombreOriginal, Tipo, FechaSubida FROM adjunto WHERE IdVisita = ?";
    $stmtAdjuntos = $pdo->prepare($sqlAdjuntos);
    $stmtAdjuntos->execute([$idVisita]);
    $adjuntos = $stmtAdjuntos->fetchAll(PDO::FETCH_ASSOC);

    // 3. Combine results
    $visita['adjuntos'] = $adjuntos;

    // 4. Return combined JSON
    echo json_encode($visita);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor al obtener los detalles de la visita.', 'error' => $e->getMessage()]);
}
?>
