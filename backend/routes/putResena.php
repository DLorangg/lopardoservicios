<?php
include '../db.php';
require '../verificarToken.php'; 

header('Content-Type: application/json');

// Requerir autenticación de administrador mediante JWT para operaciones de edición
if (!isset($usuarioLogueado['role']) || (string)$usuarioLogueado['role'] !== '1') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit();
}

// Obtener los datos desde el cuerpo de la solicitud (JSON)
$input = json_decode(file_get_contents('php://input'), true);

// El ID puede venir por query string o en el cuerpo JSON
$id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de reseña no válido.']);
    exit();
}

$updates = [];
$params = [];

// 1. Normalizar nombre del cliente si se envía
if (isset($input['nombre']) || isset($input['nombre_cliente'])) {
    $rawNombre = $input['nombre'] ?? $input['nombre_cliente'];
    $nombreNormalizado = mb_convert_case(trim($rawNombre), MB_CASE_TITLE, "UTF-8");
    if ($nombreNormalizado === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre no puede estar vacío.']);
        exit();
    }
    $updates[] = "nombre_cliente = ?";
    $params[] = $nombreNormalizado;
}

// 2. Validar comentario si se envía (máximo 320 caracteres)
if (isset($input['comentario'])) {
    $comentario = trim($input['comentario']);
    if ($comentario === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede estar vacío.']);
        exit();
    }
    if (mb_strlen($comentario, 'UTF-8') > 320) {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede superar los 320 caracteres.']);
        exit();
    }
    $updates[] = "comentario = ?";
    $params[] = $comentario;
}

// 3. Empresa si se envía
if (isset($input['empresa'])) {
    $empresa = trim($input['empresa']);
    $updates[] = "empresa = ?";
    $params[] = ($empresa !== '') ? $empresa : null;
}

// 4. Estado si se envía
if (isset($input['estado'])) {
    $estado = trim($input['estado']);
    if (!in_array($estado, ['pendiente', 'aprobado', 'rechazado'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Estado incorrecto (debe ser "pendiente", "aprobado" o "rechazado").']);
        exit();
    }
    $updates[] = "estado = ?";
    $params[] = $estado;
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(['error' => 'No se proporcionaron campos para actualizar.']);
    exit();
}

try {
    $params[] = $id;
    $sql = "UPDATE resenas SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Verificamos si realmente existe el registro en la BD
    $checkSql = "SELECT COUNT(*) FROM resenas WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$id]);
    
    if ($checkStmt->fetchColumn() == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Reseña no encontrada']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Reseña actualizada exitosamente']);
    }
} catch (PDOException $e) {
    error_log('Error al actualizar reseña: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor al actualizar la reseña']);
}
?>
