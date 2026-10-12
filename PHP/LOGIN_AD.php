<?php
session_start();

// Evitar caché del navegador
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Incluir el archivo de conexión
require_once 'CONEXION.php';

$mensaje = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST['username'] ?? '';
    $clave = $_POST['password'] ?? '';

    // **CAMBIOS AQUÍ:** Verificar usuario y contraseña con SHA2
    $stmt = $conn->prepare("SELECT id_empleado, nombre, contraseña, tipo 
                           FROM empleados 
                           WHERE usuario = ? AND contraseña = SHA2(?, 256)");
    $stmt->execute([$usuario, $clave]);
    $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user_data) {
        if ($user_data['tipo'] === 'administrativo') {
            // Guardamos datos en sesión
            $_SESSION['empleado_id'] = $user_data['id_empleado'];
            $_SESSION['empleado_tipo'] = $user_data['tipo'];
            $_SESSION['empleado_nombre'] = $user_data['nombre'];

            header("Location: ../DASHBOARD/VENTAS_DIA.html");
            exit;
        } else {
            $mensaje = "⚠️ Solo los administrativos pueden ingresar.";
        }
    } else {
        $mensaje = "❌ Usuario o contraseña incorrectos.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Administrador</title>
    <link rel="stylesheet" href="../CSS/CSS_AD.CSS">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link rel="icon" type="image/x-icon" href="../IMAGES/pizza.ico" />
</head>

<body>
    <img src="../IMAGES/hamburguesa.ico" alt="Decoración" class="agave-decoration agave-1 floating"
        style="animation-delay: 0s;" />
    <img src="../IMAGES/hamburguesa.ico" alt="Decoración" class="agave-decoration agave-2 floating"
        style="animation-delay: 2s;" />

    <div class="login-container">
        <div class="glass-effect"></div>
        <div class="logo">
            <h1>Miches</h1>
            <p>Sabores ancestrales, experiencias modernas</p>
            <img src="../IMAGES/CERVEZIN.PNG" alt="Logo de la pizzería" class="logo-img" />
        </div>

        <!-- Formulario de inicio de sesión -->
        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST" autocomplete="off">
            <div class="input-group">
                <i class="fas fa-user"></i>
                <input type="text" id="username" name="username" placeholder="Nombre de usuario" required
                    autocomplete="username" />
            </div>

            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Contraseña" required
                    autocomplete="current-password" />
            </div>

            <button type="submit" class="btn-login">Ingresar</button>
        </form>

        <!-- Mensaje de error -->
        <?php if ($mensaje !== ''): ?>
            <div class="error-message" style="color: red; margin-top: 15px; text-align: center; font-weight: bold;">
                <?= htmlspecialchars($mensaje) ?>
            </div>
        <?php endif; ?>

        <p class="footer-text">Cuenta de Administrador</p>
    </div>

    <script src="../JAVA_SCRIPT/JAVA_LOGGIN.js"></script>
    <script src="../JAVA_SCRIPT/ANIMATION_LOGGIN_AD.JS"></script>
</body>

</html>