<?php
require 'CONEXION.php';

try {
    $stmt = $conn->query("SHOW TABLES");
    echo "¡Conexión exitosa!<br>Tablas en la base de datos:<br>";
    while ($row = $stmt->fetch()) {
        echo "- " . $row['Tables_in_pizzeria'] . "<br>";
    }
} catch (PDOException $e) {
    die("Error al listar tablas: " . $e->getMessage());
}