<?php
// OBTENER_EMPLEADO.php
session_start();

// Configuración de encabezados
header('Content-Type: application/json; charset=utf-8');
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Verificar si hay sesión activa
if (!isset($_SESSION['empleado_id']) || !isset($_SESSION['empleado_nombre'])) {
    echo json_encode([
        'success' => false,
        'message' => 'No hay sesión activa'
    ]);
    exit;
}

// Retornar información del empleado
echo json_encode([
    'success' => true,
    'id_empleado' => $_SESSION['empleado_id'],
    'nombre' => $_SESSION['empleado_nombre'],
    'tipo' => $_SESSION['empleado_tipo']
]);
exit;
?>