<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/REPORTE_PERIODO_ADAPTER.php';

$logFile = 'errores.log';

function logError($message) {
    global $logFile;
    $timestamp = date('[Y-m-d H:i:s]');
    file_put_contents($logFile, $timestamp." ".$message.PHP_EOL, FILE_APPEND);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Método no permitido', 405);
    }

    require_once 'CONEXION.php';
    
    if (!$conn) {
        throw new Exception('Error de conexión a la base de datos', 500);
    }

    $period = (new ReportPeriodAdapter())->adapt($_GET);
    $filtroBase = 'DATE(%s) BETWEEN :inicio AND :fin';
    $params = [
        ':inicio' => $period['inicio'],
        ':fin' => $period['fin'],
    ];
    $titulo = $period['titulo'];

    // Construir WHERE específicos para cada tabla
    $whereVentas = sprintf($filtroBase, 'v.fecha');
    $whereRetiros = sprintf($filtroBase, 'retiros_caja.fecha'); // Cambiado a nombre de tabla en lugar de alias
    $whereVentasSinAlias = sprintf($filtroBase, 'ventas.fecha');

    // Consulta de ventas con detalle
    $queryVentas = "
        SELECT 
            v.id_venta, 
            v.fecha AS fecha_hora, 
            v.total, 
            v.metodo_pago,
            v.cliente_nombre,
            dv.id_detalle,
            dv.nombre_producto AS nombre,
            dv.precio_unitario AS precio,
            dv.cantidad,
            dv.especialidades,
            dv.observaciones
        FROM ventas v
        JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        WHERE $whereVentas
        ORDER BY v.fecha DESC
    ";
    
    $stmtVentas = $conn->prepare($queryVentas);
    foreach ($params as $key => $value) {
        $stmtVentas->bindValue($key, $value);
    }
    $stmtVentas->execute();
    
    $ventas = [];
    while ($row = $stmtVentas->fetch(PDO::FETCH_ASSOC)) {
        $ventaId = $row['id_venta'];
        
        if (!isset($ventas[$ventaId])) {
            $ventas[$ventaId] = [
                'id_venta' => $row['id_venta'],
                'fecha_hora' => $row['fecha_hora'],
                'total' => $row['total'],
                'metodo_pago' => $row['metodo_pago'],
                'cliente_nombre' => $row['cliente_nombre'],
                'productos' => []
            ];
        }
        
        $ventas[$ventaId]['productos'][] = [
            'nombre' => $row['nombre'],
            'precio' => $row['precio'],
            'cantidad' => $row['cantidad'],
            'especialidades' => $row['especialidades'],
            'observaciones' => $row['observaciones']
        ];
    }
    
    // Consulta de totales de ventas (sin alias en la tabla)
    $queryTotales = "
        SELECT 
            COALESCE(SUM(total), 0) AS total,
            COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN total ELSE 0 END), 0) AS efectivo,
            COALESCE(SUM(CASE WHEN metodo_pago = 'tarjeta' THEN total ELSE 0 END), 0) AS tarjeta,
            COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN total ELSE 0 END), 0) AS transferencia
        FROM ventas
        WHERE $whereVentasSinAlias
    ";
    
    $stmtTotales = $conn->prepare($queryTotales);
    foreach ($params as $key => $value) {
        $stmtTotales->bindValue($key, $value);
    }
    $stmtTotales->execute();
    $totales = $stmtTotales->fetch(PDO::FETCH_ASSOC);
    
    // Consulta de retiros (corregido el alias)
    $queryRetiros = "
        SELECT 
            id_retiro,
            fecha,
            monto,
            motivo,
            (SELECT nombre FROM empleados WHERE id_empleado = retiros_caja.id_empleado) AS empleado
        FROM retiros_caja
        WHERE $whereRetiros
        ORDER BY fecha DESC
    ";
    
    $stmtRetiros = $conn->prepare($queryRetiros);
    foreach ($params as $key => $value) {
        $stmtRetiros->bindValue($key, $value);
    }
    $stmtRetiros->execute();
    $retiros = $stmtRetiros->fetchAll(PDO::FETCH_ASSOC);
    
    // Total de retiros
    $queryTotalRetiros = "SELECT COALESCE(SUM(monto), 0) AS total_retiros FROM retiros_caja WHERE $whereRetiros";
    $stmtTotalRetiros = $conn->prepare($queryTotalRetiros);
    foreach ($params as $key => $value) {
        $stmtTotalRetiros->bindValue($key, $value);
    }
    $stmtTotalRetiros->execute();
    $retirosSum = $stmtTotalRetiros->fetch(PDO::FETCH_ASSOC);
    
    // Calcular efectivo en caja
    $efectivoCaja = ($totales['efectivo'] ?? 0) - ($retirosSum['total_retiros'] ?? 0);
    
    $response = [
        'success' => true,
        'titulo' => $titulo,
        'ventas' => array_values($ventas),
        'retiros' => $retiros,
        'totales' => [
            'efectivo' => $totales['efectivo'] ?? 0,
            'tarjeta' => $totales['tarjeta'] ?? 0,
            'transferencia' => $totales['transferencia'] ?? 0,
            'total' => $totales['total'] ?? 0,
            'efectivo_caja' => $efectivoCaja,
            'total_retiros' => $retirosSum['total_retiros'] ?? 0
        ]
    ];
    
    echo json_encode($response);
    
} catch (PDOException $e) {
    http_response_code(500);
    logError("Error PDO: ".$e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    $statusCode = $e->getCode() ?: 500;
    http_response_code($statusCode);
    logError("Error: ".$e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error' => [
            'code' => $statusCode,
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
?>