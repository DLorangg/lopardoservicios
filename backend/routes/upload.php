<?php
include '../../db.php'; // Ajusta la ruta a db.php según la estructura de tu proyecto

// Configuración para el directorio de carga
$uploadDir = '../../uploads/'; 
$uploadedFiles = [];

// Asegúrate de que el directorio de carga existe y tiene los permisos correctos
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to create upload directory.']);
        exit;
    }
}

// Verifica permisos de escritura en el directorio
if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode(['message' => 'Upload directory is not writable.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['files'])) {
        http_response_code(400);
        echo json_encode(['message' => 'No files uploaded']);
        exit;
    }

    // Iterar sobre los archivos subidos
    foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
        $fileName = time() . '-' . basename($_FILES['files']['name'][$key]); // Guardar archivos con timestamp
        $targetFilePath = $uploadDir . $fileName;

        // Comprobar el tipo de archivo (incluyendo jpg)
        $fileType = mime_content_type($tmpName);
        if (!in_array($fileType, ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid file type: ' . $fileType]);
            exit;
        }

        // Mover el archivo al directorio de carga
        if (move_uploaded_file($tmpName, $targetFilePath)) {
            $uploadedFiles[] = "/uploads/" . $fileName; // Ajusta la URL según la estructura de tu proyecto
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error al subir el archivo: ' . $fileName]);
            exit;
        }
    }

    // Devolver las URLs de los archivos subidos
    echo json_encode(['files' => $uploadedFiles]);
}
?>
