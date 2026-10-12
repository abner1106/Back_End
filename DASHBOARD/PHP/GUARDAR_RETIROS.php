<?php
header('Content-Type: application/json');
require_once 'CONEXION.php';

try {
    // Obtener datos del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Validar datos
    if (!isset($data['id_empleado']) || !isset($data['monto']) || !isset($data['motivo'])) {
        throw new Exception('Datos incompletos para el retiro');
    }
    
    $id_empleado = $data['id_empleado'];
    $monto = floatval($data['monto']);
    $motivo = $data['motivo'];
    
    if ($monto <= 0) {
        throw new Exception('El monto debe ser mayor que cero');
    }
    
    // Insertar retiro en la base de datos
    $stmt = $conn->prepare("
        INSERT INTO retiros_caja (id_empleado, monto, motivo)
        VALUES (:id_empleado, :monto, :motivo)
    ");
    
    $stmt->bindParam(':id_empleado', $id_empleado);
    $stmt->bindParam(':monto', $monto);
    $stmt->bindParam(':motivo', $motivo);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al registrar el retiro');
    }
    
    // Obtener información del retiro registrado
    $id_retiro = $conn->lastInsertId();
    
    $stmtRetiro = $conn->prepare("
        SELECT r.*, e.nombre AS empleado
        FROM retiros_caja r
        JOIN empleados e ON r.id_empleado = e.id_empleado
        WHERE r.id_retiro = :id_retiro
    ");
    
    $stmtRetiro->bindParam(':id_retiro', $id_retiro);
    $stmtRetiro->execute();
    $retiro = $stmtRetiro->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'retiro' => $retiro
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar retiro: ' . $e->getMessage()
    ]);
}
?>