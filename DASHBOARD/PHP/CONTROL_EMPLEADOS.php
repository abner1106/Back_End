<?php
session_start();

// Verificar si el usuario está logueado y es administrativo
if (!isset($_SESSION['empleado_id']) || $_SESSION['empleado_tipo'] !== 'administrativo') {
    header("Location: ERRORPERMISOS.PHP");
    exit();
}

require_once 'CONEXION.php';

// Inicializar variables
$mensaje = "";
$error = "";
$accion = "";

// Iniciar sesión si aún no se ha iniciado
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Procesar cierre de sesión
if (isset($_GET['logout'])) {
    // Destruir la sesión actual
    session_unset(); // Limpia las variables de sesión
    session_destroy(); // Destruye la sesión

    // Redirigir al login de administrador
    header("Location: ../../");
    exit();
}

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

        if ($stmt_check->rowCount() > 0) {
            $error = "El nombre de usuario ya existe";
        } else {
            // **CORRECCIÓN: Usar SHA2 para encriptar la contraseña**
            $sql = "INSERT INTO empleados (nombre, tipo, usuario, contraseña) VALUES (?, ?, ?, SHA2(?, 256))";
            $stmt = $conn->prepare($sql);

            if ($stmt->execute([$nombre, $tipo, $usuario, $contraseña])) {
                $mensaje = "Empleado creado exitosamente con contraseña encriptada";
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
    $empleados = [];
}

// Función para obtener el nombre del tipo de empleado
function getTipoEmpleado($tipo)
{
    switch ($tipo) {
        case 'venta':
            return 'Ventas';
        case 'recepcionista':
            return 'Recepcionista';
        case 'administrativo':
            return 'Administrativo';
        default:
            return $tipo;
    }
}

// Función para obtener la clase CSS del badge
function getBadgeClass($tipo)
{
    switch ($tipo) {
        case 'venta':
            return 'venta';
        case 'recepcionista':
            return 'recepcionista';
        case 'administrativo':
            return 'admin';
        default:
            return 'default';
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Control de Empleados - Pizzería</title>
    <link rel="stylesheet" href="../CSS/GESTION_EMPLEADOS.css">
    <link rel="icon" type="image/x-icon" href="../IMAGES/CERVEZIN.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <div class="admin-container">
        <div class="sidebar">
            <div class="logo">
                <h2>Las Miches</h2>
                <p>Panel de Control</p>
                <p class="user-info">
                    <i class="fas fa-user"></i>
                    <?php echo htmlspecialchars($_SESSION['empleado_nombre']); ?> (Admin)
                </p>
            </div>
            <ul class="menu">
                <li><a href="../VENTAS_DIA.html"><i class="fas fa-home"></i> Inicio</a></li>
                <li class="active"><a href="#"><i class="fas fa-users-cog"></i> Control Empleados</a></li>
                <li><a href="../PRODUCTOS.HTML"><i class="fas fa-chart-line"></i> Analitica de Ventas</a></li>
                <li>
                    <a href="?logout=true" onclick="return confirm('¿Estás seguro de que quieres cerrar sesión?')">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Control de Empleados</h1>
                    <p>Bienvenido, <?php echo htmlspecialchars($_SESSION['empleado_nombre']); ?> (Administrativo)</p>
                </div>
                <div class="header-right">
                    <img src="../IMAGES/CERVEZIN.PNG" alt="Logo Pizzería" class="header-logo">
                </div>
            </div>

            <div class="content">
                <!-- Mensajes -->
                <?php if (!empty($mensaje)): ?>
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        <?php echo htmlspecialchars($mensaje); ?>
                    </div>
                <?php endif; ?>

                <?php if (!empty($error)): ?>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <!-- Card para crear empleado -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-user-plus"></i> Crear Nuevo Empleado</h2>
                    </div>
                    <div class="card-body">
                        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST"
                            id="form-crear-empleado">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nombre">Nombre Completo *</label>
                                    <input type="text" id="nombre" name="nombre" required>
                                </div>
                                <div class="form-group">
                                    <label for="tipo">Tipo de Empleado *</label>
                                    <select id="tipo" name="tipo" required>
                                        <option value="">Seleccionar tipo</option>
                                        <option value="venta">Ventas</option>
                                        <option value="recepcionista">Recepcionista</option>
                                        <option value="administrativo">Administrativo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="usuario">Nombre de Usuario *</label>
                                    <input type="text" id="usuario" name="usuario" required>
                                </div>
                                <div class="form-group">
                                    <label for="contraseña">Contraseña *</label>
                                    <input type="password" id="contraseña" name="contraseña" required minlength="6">
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" name="crear_empleado" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Crear Empleado
                                </button>
                                <button type="reset" class="btn btn-secondary">
                                    <i class="fas fa-undo"></i> Limpiar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Card para lista de empleados -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-list"></i> Lista de Empleados</h2>
                    </div>
                    <div class="card-body">
                        <!-- Filtro de empleados -->
                        <div class="filtro-container">
                            <label for="filtro-tipo" class="filtro-label">
                                <i class="fas fa-filter"></i> Filtrar por tipo:
                            </label>
                            <select id="filtro-tipo" class="filtro-select">
                                <option value="todos">Todos los empleados</option>
                                <option value="administrativo">Administrativo</option>
                                <option value="ventas">Ventas</option>
                                <option value="recepcionista">Recepcionista</option>
                            </select>
                        </div>

                        <?php if (empty($empleados)): ?>
                            <div class="empty-state">
                                <i class="fas fa-users-slash"></i>
                                <p>No hay empleados registrados</p>
                            </div>
                        <?php else: ?>
                            <div class="table-container">
                                <table class="empleados-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Usuario</th>
                                            <th>Tipo</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($empleados as $empleado): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($empleado['id_empleado']); ?></td>
                                                <td><?php echo htmlspecialchars($empleado['nombre']); ?></td>
                                                <td><?php echo htmlspecialchars($empleado['usuario']); ?></td>
                                                <td>
                                                    <span class="badge badge-<?php echo getBadgeClass($empleado['tipo']); ?>">
                                                        <?php echo getTipoEmpleado($empleado['tipo']); ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="btn btn-danger btn-sm"
                                                        onclick="abrirModalEliminar(<?php echo $empleado['id_empleado']; ?>, '<?php echo htmlspecialchars($empleado['nombre']); ?>')">
                                                        <i class="fas fa-trash"></i> Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para eliminar empleado -->
    <div id="modalEliminar" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
                <span class="close" onclick="cerrarModalEliminar()">&times;</span>
            </div>
            <div class="modal-body">
                <p id="textoConfirmacion">¿Está seguro que desea eliminar al empleado?</p>
                <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST"
                    id="form-eliminar-empleado">
                    <input type="hidden" id="id_empleado_eliminar" name="id_empleado">
                    <div class="form-group">
                        <label for="motivo_eliminacion">Motivo de eliminación *</label>
                        <textarea id="motivo_eliminacion" name="motivo_eliminacion" rows="3"
                            placeholder="Explique el motivo de la eliminación..." required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" name="eliminar_empleado" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Confirmar Eliminación
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="cerrarModalEliminar()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="../JAVA/GESTION_EMPLEADOS.js"></script>
</body>

</html>