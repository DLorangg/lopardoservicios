<?php
include '../../db.php'; // Ajusta la ruta a db.php según la estructura de tu proyecto
require '../verificarToken.php';

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
        $originalName = $_FILES['files']['name'][$key];
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        // 1. Validación secundaria de extensión
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'pdf'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid file extension: .' . $extension]);
            exit;
        }

        // 2. Sanitizar el nombre del archivo original
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $baseName = strtolower($baseName);

        // Quitar acentos/tildes
        $accents = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'ü' => 'u', 'ñ' => 'n',
            'ä' => 'a', 'ë' => 'e', 'ï' => 'i', 'ö' => 'o',
            'â' => 'a', 'ê' => 'e', 'î' => 'i', 'ô' => 'o', 'û' => 'u'
        ];
        $baseName = strtr($baseName, $accents);

        // Reemplazar espacios por guiones bajos
        $baseName = str_replace(' ', '_', $baseName);

        // Eliminar caracteres especiales (dejar solo alfanuméricos y guiones bajos)
        $baseName = preg_replace('/[^a-z0-9_]/', '', $baseName);

        // Asignar nombre seguro alternativo si quedó vacío
        if (empty($baseName)) {
            $baseName = 'file';
        }

        // Generar nombre de archivo final seguro
        $fileName = time() . '-' . $baseName . '.' . $extension;
        $targetFilePath = $uploadDir . $fileName;

        // 3. Comprobar el tipo de archivo MIME de forma estricta
        $fileType = mime_content_type($tmpName);
        if (!in_array($fileType, ['image/jpeg', 'image/png', 'application/pdf'])) {
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
