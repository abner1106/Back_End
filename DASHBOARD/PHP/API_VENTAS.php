<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

require 'CONEXION.php';

function sendResponse($success, $data = null, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'error' => $error,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

try {
    $conn->query("SELECT 1");
} catch (PDOException $e) {
    sendResponse(false, null, 'Error de conexión: ' . $e->getMessage(), 500);
}

date_default_timezone_set('America/Mexico_City');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendResponse(false, null, 'Método no permitido', 405);
    }

    if (!isset($_GET['action']) || empty($_GET['action'])) {
        sendResponse(false, null, 'Parámetro "action" requerido', 400);
    }

    $action = trim($_GET['action']);
    
    switch ($action) {
        case 'get_report':
            if (!isset($_GET['startDate']) || !isset($_GET['endDate'])) {
                sendResponse(false, null, 'Parámetros startDate y endDate requeridos', 400);
            }
            handleReportRequest($conn);
            break;
            
        case 'get_sale_details':
            if (!isset($_GET['id'])) {
                sendResponse(false, null, 'Parámetro "id" requerido', 400);
            }
            handleSaleDetailsRequest($conn);
            break;
            
        default:
            sendResponse(false, null, 'Acción no válida', 400);
    }
} catch (Exception $e) {
    sendResponse(false, null, $e->getMessage(), 500);
}

function handleReportRequest($conn) {
    $params = [
        'startDate' => trim($_GET['startDate']),
        'endDate' => trim($_GET['endDate']),
        'saleType' => $_GET['saleType'] ?? 'all',
        'paymentMethod' => $_GET['paymentMethod'] ?? 'all'
    ];

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $params['startDate']) || 
        !preg_match('/^\d{4}-\d{2}-\d{2}$/', $params['endDate'])) {
        sendResponse(false, null, 'Formato de fecha inválido. Use YYYY-MM-DD', 400);
    }

    // Consulta de ventas (igual que antes)
    $queryVentas = "SELECT id_venta, tipo_venta, cliente_nombre, total, fecha, metodo_pago
                   FROM ventas 
                   WHERE fecha BETWEEN :startDate AND :endDate";
    
    $conditions = [
        ':startDate' => $params['startDate'] . ' 00:00:00',
        ':endDate' => $params['endDate'] . ' 23:59:59'
    ];
    
    if ($params['saleType'] !== 'all') {
        $queryVentas .= " AND tipo_venta = :saleType";
        $conditions[':saleType'] = $params['saleType'];
    }
    
    if ($params['paymentMethod'] !== 'all') {
        $queryVentas .= " AND metodo_pago = :paymentMethod";
        $conditions[':paymentMethod'] = $params['paymentMethod'];
    }

    $queryVentas .= " ORDER BY fecha DESC";

    try {
        $stmt = $conn->prepare($queryVentas);
        $stmt->execute($conditions);
        $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        sendResponse(false, null, 'Error al consultar ventas: ' . $e->getMessage(), 500);
    }

    // CONSULTA DE PRODUCTOS DEFINITIVA (Solución al problema del N/A)
    $queryProductos = "SELECT 
                      dv.id_producto,
                      CASE 
                        WHEN dv.nombre_producto IS NULL OR TRIM(dv.nombre_producto) = '' 
                        THEN CONCAT('Producto ', dv.id_producto)
                        ELSE TRIM(dv.nombre_producto)
                      END as producto,
                      SUM(dv.cantidad) as vendidos,
                      SUM(dv.cantidad * dv.precio_unitario) as ingresos,
                      NULL as disponibles
                      FROM detalle_venta dv
                      JOIN ventas v ON dv.id_venta = v.id_venta
                      WHERE v.fecha BETWEEN :startDate AND :endDate
                      GROUP BY dv.id_producto, dv.nombre_producto
                      ORDER BY vendidos DESC";

    try {
        $stmt = $conn->prepare($queryProductos);
        $stmt->execute([
            ':startDate' => $params['startDate'] . ' 00:00:00',
            ':endDate' => $params['endDate'] . ' 23:59:59'
        ]);
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        sendResponse(false, null, 'Error al consultar productos: ' . $e->getMessage(), 500);
    }

    $totalVentas = array_sum(array_column($ventas, 'total'));

    foreach ($productos as &$producto) {
        $producto['porcentaje'] = $totalVentas > 0 ? round(($producto['ingresos'] / $totalVentas) * 100, 2) : 0;
    }

    $responseData = [
        'ventas' => $ventas,
        'productos' => $productos,
        'totalVentas' => $totalVentas,
        'productoMasVendido' => !empty($productos) ? $productos[0] : null,
        'productoMenosVendido' => !empty($productos) ? end($productos) : null,
        'fechaInicio' => $params['startDate'],
        'fechaFin' => $params['endDate']
    ];

    sendResponse(true, $responseData);
}

function handleSaleDetailsRequest($conn) {
    $ventaId = $_GET['id'];
    
    if (!is_numeric($ventaId)) {
        sendResponse(false, null, 'ID de venta debe ser numérico', 400);
    }

    try {
        $stmt = $conn->prepare("SELECT id_venta, tipo_venta, cliente_nombre, total, fecha, metodo_pago
                              FROM ventas WHERE id_venta = :id");
        $stmt->execute([':id' => $ventaId]);
        $venta = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$venta) {
            sendResponse(false, null, 'Venta no encontrada', 404);
        }
    } catch (PDOException $e) {
        sendResponse(false, null, 'Error al consultar venta: ' . $e->getMessage(), 500);
    }

    try {
        $stmt = $conn->prepare("SELECT id_producto, nombre_producto, cantidad, precio_unitario, 
                              especialidades, ingredientes, observaciones
                              FROM detalle_venta WHERE id_venta = :id");
        $stmt->execute([':id' => $ventaId]);
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        sendResponse(false, null, 'Error al consultar detalles: ' . $e->getMessage(), 500);
    }

    sendResponse(true, [
        'venta' => $venta,
        'productos' => $productos
    ]);
}