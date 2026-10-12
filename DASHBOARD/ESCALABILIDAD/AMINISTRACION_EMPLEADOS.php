<?php
session_start();

// Verificar si el usuario está logueado y es admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'admin') {
    header("Location: ../MENU_VENTAS.html");
    exit();
}

// Incluir conexión común
require_once 'CONEXION.php';

// Inicializar variables
$mensaje = "";
$error = "";
$accion = "";

// Procesar creación de empleado
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['crear_empleado'])) {
    $nombre = trim($_POST['nombre']);
    $tipo = $_POST['tipo'];
    $usuario = trim($_POST['usuario']);
    $contraseña = $_POST['contraseña'];

    try {
        // Verificar si el usuario ya existe
        $sql_check = "SELECT id_empleado FROM empleados WHERE usuario = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->execute([$usuario]);
        $result_check = $stmt_check->fetch();

        if ($result_check) {
            $error = "El nombre de usuario ya existe";
        } else {
            // **ENCRIPTAR CON SHA2**: Insertar con contraseña encriptada
            $sql = "INSERT INTO empleados (nombre, tipo, usuario, contraseña) VALUES (?, ?, ?, SHA2(?, 256))";
            $stmt = $conn->prepare($sql);

            if ($stmt->execute([$nombre, $tipo, $usuario, $contraseña])) {
                $mensaje = "Empleado creado exitosamente";
                $accion = "creacion";
            } else {
                $error = "Error al crear el empleado";
            }
        }

    } catch (PDOException $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Procesar eliminación de empleado
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['eliminar_empleado'])) {
    $id_empleado = $_POST['id_empleado'];
    $motivo = trim($_POST['motivo_eliminacion']);

    try {
        $sql = "DELETE FROM empleados WHERE id_empleado = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt->execute([$id_empleado])) {
            $mensaje = "Empleado eliminado exitosamente. Motivo: " . $motivo;
            $accion = "eliminacion";
        } else {
            $error = "Error al eliminar el empleado";
        }

    } catch (PDOException $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Obtener lista de empleados
try {
    $sql_empleados = "SELECT id_empleado, nombre, tipo, usuario FROM empleados ORDER BY id_empleado";
    $stmt_empleados = $conn->query($sql_empleados);
    $empleados = $stmt_empleados->fetchAll();

} catch (PDOException $e) {
    $error = "Error al cargar empleados: " . $e->getMessage();
}
?>