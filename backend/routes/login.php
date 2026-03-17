<?php
header('Content-Type: application/json');
require '../db.php'; // Incluye el archivo de conexión a la base de datos

// Obtén los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username && $password) {
    try {
        $sql = "SELECT * FROM usuarios WHERE Nombre = :username AND Contraseña = :password";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['username' => $username, 'password' => $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Enviar el nombre de usuario y el rol junto con la respuesta
            echo json_encode([
                'userName' => $user['Nombre'],
                'userRole' => $user['Rol'],
                'message' => 'Inicio de sesión exitoso'
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales incorrectas']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en el servidor']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Datos de entrada inválidos']);
}
?>