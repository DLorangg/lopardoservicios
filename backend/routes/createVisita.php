<?php
include '../db.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visitaData = json_decode(file_get_contents("php://input"), true);

    // Verificar los datos recibidos
    error_log("Datos recibidos para crear visita: " . print_r($visitaData, true));

    // Validar fechas
    function validateDate($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    $fecha = isset($visitaData['Fecha']) && validateDate($visitaData['Fecha']) ? $visitaData['Fecha'] : null;
    $fechaCobro = isset($visitaData['FechaCobro']) && validateDate($visitaData['FechaCobro']) ? $visitaData['FechaCobro'] : null;

    error_log("Fecha: $fecha, FechaCobro: $fechaCobro");

    // Asigna un valor predeterminado a IdEquipamiento si está vacío
    $idEquipamiento = isset($visitaData['IdEquipamiento']) && !empty($visitaData['IdEquipamiento']) 
        ? $visitaData['IdEquipamiento']
        : null;

    error_log("IdEquipamiento: $idEquipamiento");

    // Procesa los adjuntos solo si hay alguno
    $idAdjuntosString = null;
    if (!empty($visitaData['IdAdjunto'])) {
        $idAdjuntos = [];
        $adjuntos = explode(',', $visitaData['IdAdjunto']);

        foreach ($adjuntos as $index => $fileName) {
            $idAdjunto = 'ADJ' . (time() + $index); // Generar un ID único
            $sqlAdjunto = "INSERT INTO adjunto (IdAdjunto, URL) VALUES (?, ?)";
            $stmt = $pdo->prepare($sqlAdjunto);

            if (!$stmt->execute([$idAdjunto, trim($fileName)])) {
                error_log("Error al crear adjunto: " . implode(', ', $stmt->errorInfo()));
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear adjuntos']);
                exit;
            }

            $idAdjuntos[] = $idAdjunto;
        }
        $idAdjuntosString = implode(',', $idAdjuntos);
    }

    // Inserta la visita con los adjuntos creados (o sin ellos)
    $sqlVisita = "
        INSERT INTO visita (IdCliente, Ciudad, Direccion, Descripcion, IdEquipamiento, IdEstado, IdPersonal, Precio, Garantia, Fecha, FormaPago, FechaCobro, IdAdjunto, NumeroFactura, NumeroCheque)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $pdo->prepare($sqlVisita);
    $values = [
        $visitaData['IdCliente'],
        $visitaData['Ciudad'],
        $visitaData['Direccion'],
        $visitaData['Descripcion'],
        $idEquipamiento ?: null,
        $visitaData['IdEstado'] ?: null, 
        $visitaData['IdPersonal'],
        $visitaData['Precio'],
        $visitaData['Garantia'],
        $fecha,
        $visitaData['FormaPago'] ?: null,
        $fechaCobro ?: null,
        $idAdjuntosString ?: null,
        $visitaData['NumeroFactura'] ?: null, // Nuevo campo
        $visitaData['NumeroCheque'] ?: null  // Nuevo campo
    ];

    if ($stmt->execute($values)) {
        echo json_encode(['success' => true, 'message' => 'Visita creada exitosamente']);
    } else {
        error_log("Error al crear visita: " . implode(', ', $stmt->errorInfo()));
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear la visita']);
    }
}
?>