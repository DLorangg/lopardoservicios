<?php
include '../db.php'; // Asegúrate de ajustar la ruta a db.php según sea necesario
require '../verificarToken.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $fecha = $data['fecha'];
    $detalle = $data['detalle'];
    $ingreso = $data['ingreso'];
    $egreso = $data['egreso'];

    // Obtener el último saldo de la tabla
    $getLastSaldoQuery = "SELECT saldo FROM caja ORDER BY id DESC LIMIT 1";
    $stmt = $pdo->prepare($getLastSaldoQuery);
    
    if ($stmt->execute()) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $lastSaldo = $result ? $result['saldo'] : 0; // Si no hay registros previos, el saldo inicial es 0

        // Calcular el nuevo saldo
        $newSaldo = $lastSaldo + $ingreso - $egreso;

        // Insertar el nuevo registro en la tabla caja
        $insertQuery = "INSERT INTO caja (fecha, detalle, ingreso, egreso, saldo) VALUES (?, ?, ?, ?, ?)";
        $stmtInsert = $pdo->prepare($insertQuery);
        if ($stmtInsert->execute([$fecha, $detalle, $ingreso, $egreso, $newSaldo])) {
            echo json_encode(['success' => true, 'message' => 'Registro creado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor al insertar el registro en caja']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor al obtener el último saldo']);
    }
}
?>
