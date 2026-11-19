<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Solo se permite POST.']);
    exit;
}

if (!isset($_SESSION['empleado_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'La sesión del empleado expiró.']);
    exit;
}

require_once __DIR__ . '/../PHP/CONEXION.php';
require_once __DIR__ . '/../PHP/VENTA_SERVICIOS.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        throw new InvalidArgumentException('El cuerpo JSON no es válido.');
    }

    $data['id_empleado'] = (int) $_SESSION['empleado_id'];
    $data['tipo_venta'] = 'domicilio';

    // Chiquilín, Facade coordina la validación y el guardado de todo el pedido
    // desde este endpoint, sin exponer los pasos internos a la interfaz.
    $repository = new LoggingVentaRepositoryDecorator(new PdoVentaRepository($conn));
    $sale = new VentaRegistrationFacade($repository, new ProductoVentaLocalFactory());
    $result = $sale->register($data);

    echo json_encode([
        'success' => true,
        'message' => 'Pedido a domicilio registrado correctamente.',
        'data' => ['id_venta' => $result['id_venta']]
    ], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $error) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    error_log('Error al registrar pedido a domicilio: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo registrar el pedido.']);
}
