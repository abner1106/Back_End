<?php
header('Content-Type: application/json');
require_once 'CONEXION.php';

try {
    $fecha = $_GET['fecha'] ?? date('Y-m-d');
    
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        throw new Exception('Formato de fecha inválido');
    }
    
    // Consulta para obtener las ventas del día
    $stmtVentas = $conn->prepare("
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
        WHERE DATE(v.fecha) = :fecha
        ORDER BY v.fecha DESC
    ");
    $stmtVentas->bindParam(':fecha', $fecha);
    $stmtVentas->execute();
    
    // Consulta para obtener retiros del día
    $stmtRetiros = $conn->prepare("
        SELECT 
            r.id_retiro,
            r.fecha,
            r.motivo,
            r.monto,
            e.nombre AS empleado
        FROM retiros_caja r
        JOIN empleados e ON r.id_empleado = e.id_empleado
        WHERE DATE(r.fecha) = :fecha
        ORDER BY r.fecha DESC
    ");
    $stmtRetiros->bindParam(':fecha', $fecha);
    $stmtRetiros->execute();
    
    // Procesar ventas
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
    
    $retiros = $stmtRetiros->fetchAll(PDO::FETCH_ASSOC);
    
    // Calcular totales
    $stmtTotales = $conn->prepare("
        SELECT 
            COALESCE(SUM(total), 0) AS total_dia,
            COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN total ELSE 0 END), 0) AS total_efectivo,
            COALESCE(SUM(CASE WHEN metodo_pago = 'tarjeta' THEN total ELSE 0 END), 0) AS total_tarjeta,
            COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN total ELSE 0 END), 0) AS total_transferencia
        FROM ventas
        WHERE DATE(fecha) = :fecha
    ");
    $stmtTotales->bindParam(':fecha', $fecha);
    $stmtTotales->execute();
    $totales = $stmtTotales->fetch(PDO::FETCH_ASSOC);
    
    // Calcular total retiros
    $totalRetiros = $conn->prepare("
        SELECT COALESCE(SUM(monto), 0) AS total_retiros
        FROM retiros_caja
        WHERE DATE(fecha) = :fecha
    ");
    $totalRetiros->bindParam(':fecha', $fecha);
    $totalRetiros->execute();
    $retirosSum = $totalRetiros->fetch(PDO::FETCH_ASSOC);
    
    // Calcular efectivo en caja
    $efectivoCaja = ($totales['total_efectivo'] ?? 0) - ($retirosSum['total_retiros'] ?? 0);
    
    echo json_encode([
        'success' => true,
        'ventas' => array_values($ventas),
        'retiros' => $retiros,
        'totales' => [
            'efectivo' => $totales['total_efectivo'] ?? 0,
            'tarjeta' => $totales['total_tarjeta'] ?? 0,
            'transferencia' => $totales['total_transferencia'] ?? 0,
            'total_dia' => $totales['total_dia'] ?? 0,
            'efectivo_caja' => $efectivoCaja,
            'total_retiros' => $retirosSum['total_retiros'] ?? 0
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener datos: ' . $e->getMessage()
    ]);
}
?>