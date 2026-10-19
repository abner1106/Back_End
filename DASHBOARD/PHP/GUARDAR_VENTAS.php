<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'CONEXION.php';
require_once __DIR__ . '/VENTA_SERVICIOS.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Obtener el contenido JSON del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validar que el JSON sea correcto
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }
    if (!is_array($data)) {
        throw new InvalidArgumentException('El cuerpo JSON debe ser un objeto.');
    }

    // Chiquilín, aquí se usa Decorator para añadir registro de errores y
    // operaciones sin cambiar el repositorio PDO.
    $repository = new LoggingVentaRepositoryDecorator(new PdoVentaRepository($conn));
    // Chiquilín, aquí se usa Facade para coordinar la creación y el registro
    // de la venta detrás de una sola interfaz.
    // La fábrica concreta aplica Factory Method al preparar los productos.
    $sale = new VentaRegistrationFacade($repository, new ProductoVentaLocalFactory());
    $result = $sale->register($data);

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'id_venta' => $result['id_venta'],
        'message' => 'Venta registrada correctamente',
        'data' => [
            'metodo_pago' => $result['metodo_pago'],
            'total' => $result['total'],
            'productos_count' => $result['productos_count']
        ]
    ]);

} catch (Exception $e) {
    // Revertir transacción si hay error
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }

    // Respuesta de error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la venta: ' . $e->getMessage(),
        'error_info' => $e->getTraceAsString()
    ]);
}
?>