<?php
// --- CONFIGURACIÓN DE CORS ---
// Permitir solicitudes desde cualquier origen (útil para desarrollo)
header("Access-Control-Allow-Origin: *");
// Permitir los métodos HTTP que usa tu aplicación
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Permitir los encabezados que Axios y Fetch envían
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Manejar la petición "Preflight" (OPTIONS) que hace el navegador antes de un POST o PUT
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// -----------------------------

// Si la variable de entorno existe (Docker), la usa. Si no (Hostinger), usa el default.
$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'u172758686_lopardo';
$username = getenv('DB_USER') ?: 'u172758686_lopardoAdm';
$password = getenv('DB_PASS') ?: '_Lopardix123';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Error de conexión: ' . $e->getMessage());
}
?>