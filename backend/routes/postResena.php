<?php
include '../db.php';

// Obtener los datos desde el cuerpo de la solicitud (JSON)
$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {
    // Validar campos obligatorios
    if (!isset($input['nombre_cliente']) || trim($input['nombre_cliente']) === '' ||
        !isset($input['comentario']) || trim($input['comentario']) === '') {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['error' => 'El nombre del cliente y el comentario son campos requeridos.']);
        exit;
    }

    $nombreCliente = trim($input['nombre_cliente']);
    $empresa = isset($input['empresa']) && trim($input['empresa']) !== '' ? trim($input['empresa']) : null;
    $comentario = trim($input['comentario']);

    // Validar que el comentario no supere los 320 caracteres
    if (mb_strlen($comentario, 'UTF-8') > 320) {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede superar los 320 caracteres.']);
        exit;
    }

    $sql = "INSERT INTO resenas (nombre_cliente, empresa, comentario, estado) VALUES (?, ?, ?, 'pendiente')";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$nombreCliente, $empresa, $comentario]);
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Reseña creada exitosamente']);
    } catch (PDOException $e) {
        error_log('Error al insertar reseña: ' . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al crear la reseña']);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
}
?>
