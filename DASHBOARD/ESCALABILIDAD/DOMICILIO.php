<?php
// Enable CORS and set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verify POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Solo se permite el método POST',
        'received_method' => $_SERVER['REQUEST_METHOD']
    ]);
    exit();
}

// Get and validate JSON input
$jsonInput = file_get_contents('php://input');
if (empty($jsonInput)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No se recibieron datos JSON'
    ]);
    exit();
}

$data = json_decode($jsonInput, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'JSON inválido: ' . json_last_error_msg()
    ]);
    exit();
}

// Include your existing connection file
require_once 'CONEXION.php';

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception('Error de conexión a la base de datos: ' . $conn->connect_error);
    }

    // Validate required fields
    $requiredFields = [
        'id_empleado' => 'integer',
        'tipo_venta' => ['local', 'domicilio'],
        'cliente_nombre' => 'string',
        'telefono' => 'string',
        'direccion' => 'string',
        'total' => 'numeric',
        'metodo_pago' => ['efectivo', 'tarjeta', 'transferencia'],
        'productos' => 'array'
    ];

    foreach ($requiredFields as $field => $type) {
        if (!isset($data[$field])) {
            throw new Exception("Campo requerido faltante: $field");
        }
        
        if (is_array($type)) {
            if (!in_array(strtolower($data[$field]), array_map('strtolower', $type))) {
                throw new Exception("Valor inválido para $field. Permitidos: " . implode(', ', $type));
            }
        } elseif ($field === 'productos') {
            if (!is_array($data[$field]) || empty($data[$field])) {
                throw new Exception("La lista de productos no puede estar vacía");
            }
        }
    }

    // Start transaction
    $conn->begin_transaction();

    // Insert main sale
    $stmt = $conn->prepare("INSERT INTO ventas 
        (id_empleado, tipo_venta, cliente_nombre, telefono, direccion, total, metodo_pago, fecha) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param(
        "isssdss",
        $data['id_empleado'],
        $data['tipo_venta'],
        $data['cliente_nombre'],
        $data['telefono'],
        $data['direccion'],
        $data['total'],
        $data['metodo_pago']
    );

    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
    }

    $venta_id = $conn->insert_id;
    $stmt->close();

    // Insert products
    $stmt = $conn->prepare("INSERT INTO venta_productos 
        (id_venta, nombre_producto, categoria, cantidad, precio) 
        VALUES (?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta de productos: " . $conn->error);
    }

    foreach ($data['productos'] as $producto) {
        if (empty($producto['nombre']) || empty($producto['categoria']) || 
            !is_numeric($producto['cantidad']) || !is_numeric($producto['precio'])) {
            throw new Exception("Datos de producto inválidos");
        }

        $stmt->bind_param(
            "issdd",
            $venta_id,
            $producto['nombre'],
            $producto['categoria'],
            $producto['cantidad'],
            $producto['precio']
        );

        if (!$stmt->execute()) {
            throw new Exception("Error al insertar producto: " . $stmt->error);
        }
    }
    $stmt->close();

    $conn->commit();
    
    $response = [
        'success' => true,
        'message' => 'Venta registrada exitosamente',
        'data' => ['id_venta' => $venta_id]
    ];
    
    echo json_encode($response);

} catch (Exception $e) {
    if (isset($conn) && $conn instanceof mysqli && $conn->thread_id) {
        $conn->rollback();
    }
    
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ];
    
    echo json_encode($response);
    
} finally {
    if (isset($conn) && $conn instanceof mysqli && $conn->thread_id) {
        $conn->close();
    }
}
?>