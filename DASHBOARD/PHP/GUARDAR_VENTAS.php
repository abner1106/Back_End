<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'CONEXION.php';
require_once __DIR__ . '/VENTA_PATRONES.php';

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

    if (!is_array($data) || !isset($data['productos']) || !is_array($data['productos'])) {
        throw new InvalidArgumentException('El cuerpo debe incluir una lista de productos.');
    }

    // Chiquilín: aquí usamos Builder para armar la venta por partes y validar
    // cliente, pago y productos antes de iniciar la transacción en la base.
    $productoFactory = new ProductoVentaLocalFactory();
    $ventaBuilder = (new VentaBuilder())
        ->setEmpleado($data['id_empleado'] ?? null)
        ->setTipoVenta($data['tipo_venta'] ?? 'local')
        ->setCliente(
            $data['cliente_nombre'] ?? '',
            $data['direccion'] ?? null,
            $data['telefono'] ?? null
        )
        ->setTotal($data['total'] ?? null)
        ->setMetodoPago($data['metodo_pago'] ?? '')
        ->setConcepto(
            $data['concepto'] ?? null,
            $data['detalles'] ?? null
        );

    foreach ($data['productos'] as $producto) {
        if (!is_array($producto)) {
            throw new InvalidArgumentException('Cada producto debe ser un objeto.');
        }
        $ventaBuilder->addProducto($producto, $productoFactory);
    }

    $ventaData = $ventaBuilder->build();
    $metodo_pago = $ventaData['metodo_pago'];

    // Iniciar transacción
    $conn->beginTransaction();

    // 1. Insertar venta principal
    $stmtVenta = $conn->prepare("
        INSERT INTO ventas (
            id_empleado, 
            tipo_venta, 
            cliente_nombre, 
            direccion, 
            telefono, 
            total, 
            metodo_pago,
            concepto, 
            detalles
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (
        !$stmtVenta->execute([
            $ventaData['id_empleado'],
            $ventaData['tipo_venta'],
            $ventaData['cliente_nombre'],
            $ventaData['direccion'],
            $ventaData['telefono'],
            $ventaData['total'],
            $ventaData['metodo_pago'],
            $ventaData['concepto'],
            $ventaData['detalles']
        ])
    ) {
        throw new Exception("Error al insertar la venta principal: " . implode(", ", $stmtVenta->errorInfo()));
    }

    $id_venta = $conn->lastInsertId();

    // 2. Insertar o actualizar productos en la tabla productos
    $stmtProducto = $conn->prepare("
        INSERT INTO productos (nombre, descripcion, precio, activo, cantidad_disponible)
        VALUES (?, ?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE 
            precio = VALUES(precio),
            cantidad_disponible = cantidad_disponible - VALUES(cantidad_disponible)
    ");

    // 3. Insertar detalles de venta
    $stmtDetalle = $conn->prepare("
        INSERT INTO detalle_venta (
            id_venta, 
            nombre_producto, 
            precio_unitario, 
            cantidad,
            especialidades,
            observaciones
        ) VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($ventaData['productos'] as $producto) {
        if (
            !$stmtProducto->execute([
                $producto['nombre'],
                $producto['descripcion'],
                $producto['precio'],
                $producto['cantidad']
            ])
        ) {
            throw new Exception("Error al insertar/actualizar producto: {$producto['nombre']}");
        }

        // Insertar detalle de venta
        if (
            !$stmtDetalle->execute([
                $id_venta,
                $producto['nombre'],
                $producto['precio'],
                $producto['cantidad'],
                $producto['especialidades'],
                $producto['observaciones']
            ])
        ) {
            throw new Exception("Error al insertar detalle de venta para producto: {$producto['nombre']}");
        }
    }

    // Confirmar transacción
    $conn->commit();

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'id_venta' => $id_venta,
        'message' => 'Venta registrada correctamente',
        'data' => [
            'metodo_pago' => $metodo_pago,
            'total' => $ventaData['total'],
            'productos_count' => count($ventaData['productos'])
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