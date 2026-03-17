<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include '../db.php';

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // --- 1. Insert Visita ---
    $sqlVisita = "
        INSERT INTO visita (IdCliente, Ciudad, Direccion, Descripcion, IdEquipamiento, IdEstado, IdPersonal, Precio, Garantia, Fecha, FormaPago, FechaCobro, NumeroFactura, NumeroCheque)
        VALUES (:IdCliente, :Ciudad, :Direccion, :Descripcion, :IdEquipamiento, :IdEstado, :IdPersonal, :Precio, :Garantia, :Fecha, :FormaPago, :FechaCobro, :NumeroFactura, :NumeroCheque)
    ";

    $stmtVisita = $pdo->prepare($sqlVisita);

    // Bind parameters from $_POST
    $stmtVisita->bindValue(':IdCliente', $_POST['IdCliente'] ?? null);
    $stmtVisita->bindValue(':Ciudad', $_POST['Ciudad'] ?? null);
    $stmtVisita->bindValue(':Direccion', $_POST['Direccion'] ?? null);
    $stmtVisita->bindValue(':Descripcion', $_POST['Descripcion'] ?? null);
    $stmtVisita->bindValue(':IdEquipamiento', !empty($_POST['IdEquipamiento']) ? $_POST['IdEquipamiento'] : null);
    $stmtVisita->bindValue(':IdEstado', $_POST['IdEstado'] ?? null);
    $stmtVisita->bindValue(':IdPersonal', $_POST['IdPersonal'] ?? null);
    $stmtVisita->bindValue(':Precio', $_POST['Precio'] ?? null);
    $stmtVisita->bindValue(':Garantia', isset($_POST['Garantia']) ? (int)$_POST['Garantia'] : null);
    $stmtVisita->bindValue(':Fecha', !empty($_POST['Fecha']) ? $_POST['Fecha'] : null);
    $stmtVisita->bindValue(':FormaPago', $_POST['FormaPago'] ?? null);
    $stmtVisita->bindValue(':FechaCobro', !empty($_POST['FechaCobro']) ? $_POST['FechaCobro'] : null);
    $stmtVisita->bindValue(':NumeroFactura', $_POST['NumeroFactura'] ?? null);
    $stmtVisita->bindValue(':NumeroCheque', $_POST['NumeroCheque'] ?? null);

    $stmtVisita->execute();

    // --- 2. Get the new Visita ID ---
    $idVisita = $pdo->lastInsertId();

    // --- 3. Handle File Uploads ---
    if (!empty($_FILES['adjuntos'])) {
        $uploadDir = '../../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $sqlAdjunto = "
            INSERT INTO adjunto (IdVisita, URL, NombreOriginal, Tipo)
            VALUES (:IdVisita, :URL, :NombreOriginal, :Tipo)
        ";
        $stmtAdjunto = $pdo->prepare($sqlAdjunto);

        // $_FILES['adjuntos'] will be an array of arrays.
        $files = $_FILES['adjuntos'];
        $fileCount = count($files['name']);

        for ($i = 0; $i < $fileCount; $i++) {
            $fileName = $files['name'][$i];
            $tmpName = $files['tmp_name'][$i];
            $fileType = $files['type'][$i];
            $fileError = $files['error'][$i];

            if ($fileError === UPLOAD_ERR_OK) {
                $uniqueName = time() . '-' . uniqid('', true) . '-' . basename($fileName);
                $targetFilePath = $uploadDir . $uniqueName;
                $urlPath = '/uploads/' . $uniqueName; // Path to be stored in DB

                if (move_uploaded_file($tmpName, $targetFilePath)) {
                    // File moved successfully, insert into DB
                    $stmtAdjunto->execute([
                        ':IdVisita' => $idVisita,
                        ':URL' => $urlPath,
                        ':NombreOriginal' => $fileName,
                        ':Tipo' => $fileType
                    ]);
                } else {
                    throw new Exception("Error al mover el archivo subido: $fileName");
                }
            } else {
                 throw new Exception("Error al subir el archivo $fileName. Código: $fileError");
            }
        }
    }

    // --- 4. Commit Transaction ---
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Visita y adjuntos creados exitosamente.', 'idVisita' => $idVisita]);

} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    // Be careful with exposing detailed error messages in production
    echo json_encode(['error' => 'Error al crear la visita.', 'details' => $e->getMessage()]);
}
?>