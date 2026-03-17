<?php
include '../db.php';

$idDato = $_GET['idDato'] ?? null;

if (!$idDato) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['Message' => 'ID de visita no proporcionado']);
    exit;
}

$sqlVisita = "
    SELECT v.*, GROUP_CONCAT(a.URL) AS Adjuntos
    FROM visita v
    LEFT JOIN adjunto a ON FIND_IN_SET(a.IdAdjunto, v.IdAdjunto) > 0
    WHERE v.IdVisita = ?
    GROUP BY v.IdVisita
";

try {
    $stmt = $pdo->prepare($sqlVisita);
    $stmt->execute([$idDato]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['Message' => 'Visita no encontrada']);
    } else {
        header('Content-Type: application/json');
        echo json_encode($result);
    }
} catch (PDOException $e) {
    // Manejo de errores
    error_log('Error al obtener detalles de la visita: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['Message' => 'Error en el servidor', 'error' => $e->getMessage()]);
}
?>
