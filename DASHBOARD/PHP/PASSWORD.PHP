<?php
session_start();

// Evitar caché del navegador
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Verificar si el usuario está logueado
if (!isset($_SESSION['empleado_id'])) {
    header("Location: login.php");
    exit;
}

// Incluir conexión común
require_once 'CONEXION.php';

// Inicializar variables
$mensaje = '';
$tipoMensaje = ''; // success, error
$empleado_nombre = $_SESSION['empleado_nombre'];
$empleado_id = $_SESSION['empleado_id'];

// Procesar cambio de contraseña
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['cambiar_password'])) {
    $password_actual = $_POST['password_actual'] ?? '';
    $nueva_password = $_POST['nueva_password'] ?? '';
    $confirmar_password = $_POST['confirmar_password'] ?? '';

    // Validar campos vacíos
    if (empty($password_actual) || empty($nueva_password) || empty($confirmar_password)) {
        $mensaje = "⚠️ Todos los campos son obligatorios.";
        $tipoMensaje = 'error';
    }
    // Validar que las nuevas contraseñas coincidan
    elseif ($nueva_password !== $confirmar_password) {
        $mensaje = "⚠️ Las nuevas contraseñas no coinciden.";
        $tipoMensaje = 'error';
    }
    // Validar fortaleza de la nueva contraseña
    elseif (!validarFortalezaPassword($nueva_password)) {
        $mensaje = "⚠️ La nueva contraseña debe tener al menos 5 números y 1 letra.";
        $tipoMensaje = 'error';
    } else {
        try {
            // **VERIFICAR CONTRASEÑA ACTUAL CON SHA2**
            $stmt = $conn->prepare("SELECT contraseña FROM empleados WHERE id_empleado = ? AND contraseña = SHA2(?, 256)");
            $stmt->execute([$empleado_id, $password_actual]);
            $empleado = $stmt->fetch();

            if ($empleado) {
                // **ACTUALIZAR CON NUEVA CONTRASEÑA ENCRIPTADA CON SHA2**
                $stmt = $conn->prepare("UPDATE empleados SET contraseña = SHA2(?, 256) WHERE id_empleado = ?");
                $stmt->execute([$nueva_password, $empleado_id]);

                $mensaje = "✅ Contraseña cambiada exitosamente.";
                $tipoMensaje = 'success';
            } else {
                $mensaje = "❌ La contraseña actual es incorrecta.";
                $tipoMensaje = 'error';
            }

        } catch (PDOException $e) {
            $mensaje = "⚠️ Error al cambiar la contraseña: " . $e->getMessage();
            $tipoMensaje = 'error';
        }
    }
}

// Función para validar fortaleza de la contraseña
function validarFortalezaPassword($password)
{
    // Al menos 5 números y 1 letra
    $numeros = preg_match_all('/[0-9]/', $password);
    $letras = preg_match_all('/[a-zA-Z]/', $password);

    return $numeros >= 5 && $letras >= 1;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cambiar Contraseña - Pizzería</title>
    <link rel="stylesheet" href="../CSS/PASSWORD.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link rel="icon" type="image/x-icon" href="../IMAGES/pizza.ico">
</head>

<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo">
                <img src="../IMAGES/CERVEZIN.PNG" alt="Logo Pizzería" class="sidebar-logo">
                <h2>LAS MICHES</h2>
                <p>Panel de Control</p>
            </div>
            <ul class="menu">

                <li class="active"><a href="#"><i class="fas fa-key"></i> Cambiar Contraseña</a></li>
                <li>
                    <a href="../../">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span><?php echo htmlspecialchars($empleado_nombre); ?></span>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Cambiar Contraseña</h1>
                    <p>Actualiza tu contraseña de acceso</p>
                </div>
                <div class="header-right">
                    <img src="../IMAGES/CERVEZIN.PNG" alt="Logo Pizzería" class="header-logo">
                </div>
            </div>

            <div class="content">
                <!-- Mensajes -->
                <?php if (!empty($mensaje)): ?>
                    <div class="alert alert-<?php echo $tipoMensaje; ?>">
                        <i
                            class="fas fa-<?php echo $tipoMensaje === 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i>
                        <?php echo htmlspecialchars($mensaje); ?>
                    </div>
                <?php endif; ?>

                <!-- Card para cambiar contraseña -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-lock"></i> Cambiar Contraseña</h2>
                    </div>
                    <div class="card-body">
                        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST"
                            id="form-cambiar-password">
                            <div class="form-group">
                                <label for="password_actual">Contraseña Actual *</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" id="password_actual" name="password_actual" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="nueva_password">Nueva Contraseña *</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-key"></i>
                                    <input type="password" id="nueva_password" name="nueva_password" required
                                        placeholder="Mínimo 5 números y 1 letra">
                                </div>
                                <div class="password-strength">
                                    <div class="strength-bar">
                                        <div class="strength-fill" id="strength-fill"></div>
                                    </div>
                                    <span class="strength-text" id="strength-text">Fortaleza de la contraseña</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="confirmar_password">Confirmar Nueva Contraseña *</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-check-circle"></i>
                                    <input type="password" id="confirmar_password" name="confirmar_password" required>
                                </div>
                                <span class="password-match" id="password-match"></span>
                            </div>

                            <div class="requisitos">
                                <h4>Requisitos de la contraseña:</h4>
                                <ul>
                                    <li id="req-numeros">Al menos 5 números</li>
                                    <li id="req-letras">Al menos 1 letra</li>
                                    <li id="req-longitud">Mínimo 6 caracteres</li>
                                </ul>
                            </div>

                            <div class="form-actions">
                                <button type="submit" name="cambiar_password" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Cambiar Contraseña
                                </button>
                                <button type="reset" class="btn btn-secondary">
                                    <i class="fas fa-undo"></i> Limpiar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../JAVA_SCRIPT/CAMBIAR_PASSWORD.js"></script>
</body>

</html>