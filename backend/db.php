<?php
    $host = '193.203.175.99';
    $dbname = 'u172758686_lopardo';
    $username = 'u172758686_lopardoAdm';
    $password = '_Lopardix123';
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die('Error de conexión: ' . $e->getMessage());
    }
?>