<?php
include '../db.php'; 

// Obtener los datos del cliente desde el cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {
    $nombre = $input['Nombre'];
    $dni = $input['DNI'];
    $ciudad = $input['Ciudad'];
    $direccion = $input['Direccion'];
    $equipamiento = isset($input['Equipamiento']) ? implode(', ', $input['Equipamiento']) : null;
    $telefono = $input['Telefono'];
    $razonSocial = $input['RazonSocial'];
    $email = $input['Email'];
    $email2 = isset($input['Email2']) ? $input['Email2'] : null;

    $sql = "INSERT INTO cliente (Nombre, DNI, Ciudad, Direccion, Equipamiento, Telefono, RazonSocial, Email, Email2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$nombre, $dni, $ciudad, $direccion, $equipamiento, $telefono, $razonSocial, $email, $email2]);
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Cliente creado exitosamente']);
    } catch (PDOException $e) {
        // Manejo de errores
        error_log('Error al insertar cliente: ' . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al crear cliente']);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
}
?>
