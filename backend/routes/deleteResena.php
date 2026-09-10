<?php
include '../db.php';
require '../verificarToken.php'; 

header('Content-Type: application/json');

// Requerir autenticación de administrador mediante JWT para operaciones destructivas
if (!isset($usuarioLogueado['role']) || (string)$usuarioLogueado['role'] !== '1') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de reseña no válido.']);
    exit();
}

try {
    // Verificar si existe la reseña
    $checkStmt = $pdo->prepare("SELECT id FROM resenas WHERE id = ?");
    $checkStmt->execute([$id]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Reseña no encontrada.']);
        exit();
    }

    // Intentar borrado lógico con activo = 0 si la columna existe; de lo contrario, borrado físico
    try {
        $stmt = $pdo->prepare("UPDATE resenas SET activo = 0 WHERE id = ?");
        $stmt->execute([$id]);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'activo') !== false) {
            $stmtDel = $pdo->prepare("DELETE FROM resenas WHERE id = ?");
            $stmtDel->execute([$id]);
        } else {
            throw $e;
        }
    }

    echo json_encode(['success' => true, 'message' => 'Reseña eliminada exitosamente.']);
} catch (PDOException $e) {
    error_log('Error al eliminar reseña: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno al eliminar la reseña.']);
}
