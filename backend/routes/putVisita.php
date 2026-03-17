<?php
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obtener datos JSON y decodificarlos
    $input = file_get_contents("php://input");
    $visitaData = json_decode($input, true);

    $id = $_GET['id'];

    // Log para verificar los datos recibidos
    error_log("Datos recibidos para actualizar visita: " . json_encode($visitaData));
    error_log("ID recibido para actualización: " . $id);

    // Preparar la consulta SQL con campos opcionales
    $sqlVisita = "UPDATE visita SET ";
    $fields = [];
    $values = [];

    // Construir la consulta dinámica con los campos proporcionados
    if (isset($visitaData['Descripcion'])) {
        $fields[] = "Descripcion = :descripcion";
        $values[':descripcion'] = $visitaData['Descripcion'];
    }
    if (isset($visitaData['IdEquipamiento']) && $visitaData['IdEquipamiento'] !== '') {
        $fields[] = "IdEquipamiento = :idEquipamiento";
        $values[':idEquipamiento'] = $visitaData['IdEquipamiento'];
    } else {
        $fields[] = "IdEquipamiento = NULL";
    }
    if (isset($visitaData['IdEstado'])) {
        $fields[] = "IdEstado = :idEstado";
        $values[':idEstado'] = $visitaData['IdEstado'];
    }
    if (isset($visitaData['Precio'])) {
        $fields[] = "Precio = :precio";
        $values[':precio'] = $visitaData['Precio'];
    }
    if (isset($visitaData['Garantia'])) {
        $fields[] = "Garantia = :garantia";
        $values[':garantia'] = $visitaData['Garantia'];
    }
    if (isset($visitaData['Fecha'])) {
        $fields[] = "Fecha = :fecha";
        $values[':fecha'] = $visitaData['Fecha'];
    }
    if (isset($visitaData['FormaPago'])) {
        $fields[] = "FormaPago = :formaPago";
        $values[':formaPago'] = $visitaData['FormaPago'];
    }
    if (isset($visitaData['FechaCobro']) && $visitaData['FechaCobro'] !== '') {
        $fields[] = "FechaCobro = :fechaCobro";
        $values[':fechaCobro'] = $visitaData['FechaCobro'];
    } else {
        $fields[] = "FechaCobro = NULL";
    }
    if (isset($visitaData['IdPersonal']) && $visitaData['IdPersonal'] !== '') {
        $fields[] = "IdPersonal = :idPersonal";
        $values[':idPersonal'] = $visitaData['IdPersonal'];
    } else {
        $fields[] = "IdPersonal = NULL";
    }
    // Añadir Número de Factura
    if (isset($visitaData['NumeroFactura'])) {
        $fields[] = "NumeroFactura = :numeroFactura";
        $values[':numeroFactura'] = $visitaData['NumeroFactura'];
    }
    // Añadir Número de Cheque
    if (isset($visitaData['NumeroCheque'])) {
        $fields[] = "NumeroCheque = :numeroCheque";
        $values[':numeroCheque'] = $visitaData['NumeroCheque'];
    }

    // Completar la consulta SQL
    $sqlVisita .= implode(", ", $fields) . " WHERE IdVisita = :id";
    $values[':id'] = $id;

    $stmt = $pdo->prepare($sqlVisita);

    try {
        $stmt->execute($values);
        echo json_encode(["success" => true, "message" => "Visita actualizada exitosamente"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error interno del servidor al actualizar visita", "details" => $e->getMessage()]);
    }
}
?>

El createVisita.php también:
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
?><?php
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