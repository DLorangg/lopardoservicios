<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include '../db.php';

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// We use POST to handle multipart/form-data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$idVisita = $_GET['idVisita'] ?? null;
if (!$idVisita) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de visita no proporcionado.']);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // --- 1. Update Visita Details ---
    $sqlVisita = "
        UPDATE visita SET 
            Descripcion = :Descripcion,
            IdEquipamiento = :IdEquipamiento,
            IdEstado = :IdEstado,
            Precio = :Precio,
            Garantia = :Garantia,
            Fecha = :Fecha,
            IdPersonal = :IdPersonal,
            FormaPago = :FormaPago,
            FechaCobro = :FechaCobro,
            NumeroCheque = :NumeroCheque,
            NumeroFactura = :NumeroFactura
        WHERE IdVisita = :IdVisita
    ";

    $stmtVisita = $pdo->prepare($sqlVisita);

    // Bind parameters from $_POST
    $stmtVisita->bindValue(':Descripcion', $_POST['Descripcion'] ?? null);
    $stmtVisita->bindValue(':IdEquipamiento', !empty($_POST['IdEquipamiento']) ? $_POST['IdEquipamiento'] : null);
    $stmtVisita->bindValue(':IdEstado', $_POST['IdEstado'] ?? null);
    $stmtVisita->bindValue(':Precio', $_POST['Precio'] ?? null);
    $stmtVisita->bindValue(':Garantia', isset($_POST['Garantia']) ? (int)$_POST['Garantia'] : null);
    $stmtVisita->bindValue(':Fecha', !empty($_POST['Fecha']) ? $_POST['Fecha'] : null);
    $stmtVisita->bindValue(':IdPersonal', $_POST['IdPersonal'] ?? null);
    $stmtVisita->bindValue(':FormaPago', isset($_POST['FormaPago']) ? (int)$_POST['FormaPago'] : null);
    $stmtVisita->bindValue(':FechaCobro', !empty($_POST['FechaCobro']) ? $_POST['FechaCobro'] : null);
    $stmtVisita->bindValue(':NumeroCheque', $_POST['NumeroCheque'] ?? null);
    $stmtVisita->bindValue(':NumeroFactura', $_POST['NumeroFactura'] ?? null);
    $stmtVisita->bindValue(':IdVisita', $idVisita, PDO::PARAM_INT);

    $stmtVisita->execute();

    // --- 2. Handle Attachments to Delete ---
    if (isset($_POST['adjuntos_a_eliminar'])) {
        $adjuntosParaEliminar = json_decode($_POST['adjuntos_a_eliminar'], true);

        if (is_array($adjuntosParaEliminar)) {
            $sqlSelectAdjunto = "SELECT URL FROM adjunto WHERE IdAdjunto = :IdAdjunto";
            $stmtSelectAdjunto = $pdo->prepare($sqlSelectAdjunto);

            $sqlDeleteAdjunto = "DELETE FROM adjunto WHERE IdAdjunto = :IdAdjunto";
            $stmtDeleteAdjunto = $pdo->prepare($sqlDeleteAdjunto);

            foreach ($adjuntosParaEliminar as $idAdjunto) {
                // Get file path
                $stmtSelectAdjunto->execute([':IdAdjunto' => $idAdjunto]);
                $adjunto = $stmtSelectAdjunto->fetch(PDO::FETCH_ASSOC);

                if ($adjunto) {
                    // Delete file from server
                    $filePath = '../../' . ltrim($adjunto['URL'], '/');
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }

                    // Delete from database
                    $stmtDeleteAdjunto->execute([':IdAdjunto' => $idAdjunto]);
                }
            }
        }
    }

    // --- 3. Handle New File Uploads ---
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
    
    // Commit transaction
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Visita actualizada exitosamente.']);

} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la visita.', 'details' => $e->getMessage()]);
}
?>
