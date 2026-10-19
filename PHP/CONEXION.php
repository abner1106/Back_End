<?php

final class PizzeriaConnection
{
    private static ?PDO $instance = null;

    private function __construct()
    {
    }

    public static function getInstance(): PDO
    {
        // Chiquilín: Singleton centraliza la conexión y devuelve la misma PDO
        // durante esta solicitud, para que las páginas compartan su configuración.
        if (self::$instance === null) {
            $host = 'localhost';
            $db = 'pizzeria';
            $user = 'root';
            $pass = 'abner';
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                throw new PDOException(
                    'Error de conexión a la base de datos. Verifica la configuración de MySQL.',
                    (int) $e->getCode(),
                    $e
                );
            }
        }

        return self::$instance;
    }
}

// Chiquilín, aquí se usa Singleton: todas las páginas reciben la misma
// conexión PDO durante la solicitud mediante esta instancia compartida.
$conn = PizzeriaConnection::getInstance();
