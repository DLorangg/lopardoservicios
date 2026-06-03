<?php
include '../db.php';
require '../verificarToken.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];

    $fecha = $data['fecha'];
    $detalle = $data['detalle'];
    $ingreso = $data['ingreso'];
    $egreso = $data['egreso'];

    // Verificar si el registro existe
    $sqlGet = 'SELECT saldo, ingreso, egreso FROM caja WHERE id = ?';
    $stmt = $pdo->prepare($sqlGet);
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        http_response_code(404);
        echo json_encode(['message' => 'Registro no encontrado']);
        exit;
    }

    $previousSaldo = $result['saldo'];
    $previousIngreso = $result['ingreso'];
    $previousEgreso = $result['egreso'];

    // Ajustar el saldo basado en el nuevo ingreso y egreso
    // Primero, calculamos el saldo ajustado para los ingresos y egresos antiguos
    $intermediateSaldo = $previousSaldo - $previousIngreso + $previousEgreso;

    // Luego, ajustamos el saldo para reflejar los nuevos valores
    $newSaldo = $intermediateSaldo + $ingreso - $egreso;

    // Actualizar el registro
    $sqlUpdate = 'UPDATE caja SET fecha = ?, detalle = ?, ingreso = ?, egreso = ?, saldo = ? WHERE id = ?';
    $stmtUpdate = $pdo->prepare($sqlUpdate);
    if ($stmtUpdate->execute([$fecha, $detalle, $ingreso, $egreso, $newSaldo, $id])) {
        echo json_encode(['success' => true, 'message' => 'Registro actualizado exitosamente']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error interno del servidor al actualizar el registro']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido']);
}
?>
