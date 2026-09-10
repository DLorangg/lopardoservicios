<?php
header('Content-Type: application/json');
require '../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. GET: Devuelve las fotos activas ordenadas por orden ASC (Público y Admin)
if ($method === 'GET') {
    try {
        // Intentar consultar con filtro activo = 1
        try {
            $stmt = $pdo->prepare("SELECT * FROM carrusel_fotos WHERE activo = 1 ORDER BY orden ASC");
            $stmt->execute();
            $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'activo') !== false) {
                $stmt = $pdo->prepare("SELECT * FROM carrusel_fotos ORDER BY orden ASC");
                $stmt->execute();
                $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                throw $e;
            }
        }
        echo json_encode($fotos);
    } catch (PDOException $e) {
        error_log('Error al obtener fotos del carrusel: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener las fotos del carrusel']);
    }
    exit();
}

// --- TODAS LAS DEMÁS OPERACIONES (POST, PUT, DELETE) REQUIEREN JWT DE ADMIN ---
require '../verificarToken.php';

if (!isset($usuarioLogueado['role']) || (string)$usuarioLogueado['role'] !== '1') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit();
}

// 2. POST: Subir nueva imagen al carrusel
if ($method === 'POST') {
    $file = $_FILES['imagen'] ?? $_FILES['foto'] ?? $_FILES['file'] ?? null;

    if (!$file || !isset($file['tmp_name']) || empty($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No se recibió ningún archivo de imagen válido.']);
        exit();
    }

    // A. Validar tamaño máximo: 5 MB (5 * 1024 * 1024 bytes)
    $maxBytes = 5 * 1024 * 1024;
    if ($file['size'] > $maxBytes) {
        http_response_code(400);
        echo json_encode(['error' => 'El archivo supera el tamaño máximo permitido de 5 MB.']);
        exit();
    }

    // B. Validar extensión de archivo (jpg, jpeg, png, webp)
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato no permitido. Solo se admiten archivos JPG, JPEG, PNG y WEBP.']);
        exit();
    }

    // C. Validar tipo MIME
    $fileType = mime_content_type($file['tmp_name']);
    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($fileType, $allowedMimes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo MIME inválido: solo se permiten imágenes reales (' . $fileType . ').']);
        exit();
    }

    // D. Sanitizar el nombre original del archivo
    $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
    $baseName = strtolower($baseName);
    $accents = [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
        'ü' => 'u', 'ñ' => 'n'
    ];
    $baseName = strtr($baseName, $accents);
    $baseName = preg_replace('/[^a-z0-9_]/', '_', $baseName);
    $baseName = trim($baseName, '_');
    if (empty($baseName)) {
        $baseName = 'foto';
    }

    $uniqueFileName = time() . '_' . uniqid() . '_' . $baseName . '.' . $extension;
    $uploadDir = dirname(__DIR__) . '/uploads/carrusel/';

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo crear el directorio de subida para el carrusel.']);
            exit();
        }
    }

    $targetFilePath = $uploadDir . $uniqueFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al mover el archivo subido al servidor.']);
        exit();
    }

    $url = '/uploads/carrusel/' . $uniqueFileName;

    // E. Insertar registro asignando orden = (SELECT IFNULL(MAX(orden), 0) + 1 FROM carrusel_fotos)
    try {
        $stmtMax = $pdo->query("SELECT IFNULL(MAX(orden), 0) FROM carrusel_fotos");
        $nuevoOrden = (int)$stmtMax->fetchColumn() + 1;

        try {
            $stmtInsert = $pdo->prepare("INSERT INTO carrusel_fotos (url, nombre_archivo, orden, activo) VALUES (:url, :nombre, :orden, 1)");
            $stmtInsert->execute([
                ':url' => $url,
                ':nombre' => $uniqueFileName,
                ':orden' => $nuevoOrden
            ]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'activo') !== false) {
                $stmtInsert = $pdo->prepare("INSERT INTO carrusel_fotos (url, nombre_archivo, orden) VALUES (:url, :nombre, :orden)");
                $stmtInsert->execute([
                    ':url' => $url,
                    ':nombre' => $uniqueFileName,
                    ':orden' => $nuevoOrden
                ]);
            } else {
                throw $e;
            }
        }

        $id = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Imagen subida y agregada al carrusel exitosamente.',
            'foto' => [
                'id' => (int)$id,
                'url' => $url,
                'nombre_archivo' => $uniqueFileName,
                'orden' => $nuevoOrden
            ]
        ]);
    } catch (PDOException $e) {
        // En caso de fallo en BD, limpiar el archivo subido
        if (file_exists($targetFilePath)) {
            @unlink($targetFilePath);
        }
        error_log('Error al insertar foto en carrusel: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error en base de datos al registrar la foto del carrusel']);
    }
    exit();
}

// 3. PUT: Reordenar fotos del carrusel (Transacción)
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    // Admite array directo [{ id, orden }] o envuelto en { fotos: [...] }, { items: [...] }, etc.
    $items = is_array($input) && isset($input[0]) ? $input : ($input['fotos'] ?? $input['items'] ?? $input['orden'] ?? null);

    if (!is_array($items) || empty($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'Se requiere un array de elementos con "id" y "orden" para reordenar.']);
        exit();
    }

    try {
        $pdo->beginTransaction();
        $stmtUpdate = $pdo->prepare("UPDATE carrusel_fotos SET orden = :orden WHERE id = :id");

        foreach ($items as $item) {
            if (!isset($item['id']) || !isset($item['orden'])) {
                throw new Exception("Cada elemento debe incluir 'id' y 'orden'.");
            }
            $stmtUpdate->execute([
                ':orden' => intval($item['orden']),
                ':id' => intval($item['id'])
            ]);
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Orden del carrusel actualizado exitosamente.']);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log('Error al reordenar carrusel: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar el orden del carrusel: ' . $e->getMessage()]);
    }
    exit();
}

// 4. DELETE: Borrar foto física y registro de la tabla carrusel_fotos
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de foto no válido.']);
        exit();
    }

    try {
        // A. Obtener datos de la foto
        $stmtFind = $pdo->prepare("SELECT url, nombre_archivo FROM carrusel_fotos WHERE id = :id");
        $stmtFind->execute([':id' => $id]);
        $foto = $stmtFind->fetch(PDO::FETCH_ASSOC);

        if (!$foto) {
            http_response_code(404);
            echo json_encode(['error' => 'Foto no encontrada en el carrusel.']);
            exit();
        }

        // B. Borrar archivo físico del disco si existe
        $uploadDir = dirname(__DIR__) . '/uploads/carrusel/';
        if (!empty($foto['nombre_archivo'])) {
            $filePath = $uploadDir . basename($foto['nombre_archivo']);
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }
        if (!empty($foto['url'])) {
            $filePathUrl = $uploadDir . basename($foto['url']);
            if (file_exists($filePathUrl)) {
                @unlink($filePathUrl);
            }
        }

        // C. Eliminar registro de la base de datos
        $stmtDel = $pdo->prepare("DELETE FROM carrusel_fotos WHERE id = :id");
        $stmtDel->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Foto eliminada exitosamente del carrusel.']);
    } catch (PDOException $e) {
        error_log('Error al eliminar foto de carrusel: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Error en el servidor al eliminar la foto']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
