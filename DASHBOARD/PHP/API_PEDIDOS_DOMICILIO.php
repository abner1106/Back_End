<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['empleado_id'])) {
    responder(401, ['success' => false, 'message' => 'La sesión del empleado expiró.']);
}

require_once __DIR__ . '/CONEXION.php';
require_once __DIR__ . '/PEDIDO_ESTADOS.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $consulta = $conn->query(
            "SELECT id_venta, cliente_nombre, direccion, telefono, total, metodo_pago,
                    fecha, estado_pedido, motivo_cancelacion, fecha_estado
             FROM ventas
             WHERE tipo_venta = 'domicilio'
             ORDER BY FIELD(estado_pedido, 'pendiente', 'entregado', 'cobrado', 'cancelado'),
                      fecha DESC, id_venta DESC"
        );
        responder(200, ['success' => true, 'pedidos' => $consulta->fetchAll(PDO::FETCH_ASSOC)]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder(405, ['success' => false, 'message' => 'Método no permitido.']);
    }

    $datos = json_decode(file_get_contents('php://input'), true);
    if (!is_array($datos)) {
        responder(400, ['success' => false, 'message' => 'El cuerpo JSON no es válido.']);
    }

    $idVenta = filter_var($datos['id_venta'] ?? null, FILTER_VALIDATE_INT);
    $estadoSolicitado = $datos['estado'] ?? null;
    if ($idVenta === false || $idVenta <= 0 || !is_string($estadoSolicitado)) {
        responder(400, ['success' => false, 'message' => 'El pedido o el estado no son válidos.']);
    }

    if ($estadoSolicitado === 'cancelado') {
        $motivo = trim((string) ($datos['motivo'] ?? ''));
        if ($motivo === '') {
            responder(400, ['success' => false, 'message' => 'Escribe el motivo de cancelación.']);
        }
        // encapsula la cancelacion como una operacion completa explica quien la hizo y el motivo de la cancelacion
        (new ComandoCancelarPedido(
            $conn,
            $idVenta,
            (int) $_SESSION['empleado_id'],
            $motivo
        ))->ejecutar();

        responder(200, ['success' => true, 'message' => 'Pedido cancelado.']);
    }

    $metodoPago = $datos['metodo_pago'] ?? null;
    if (
        $estadoSolicitado === 'cobrado'
        && (!is_string($metodoPago)
            || !in_array($metodoPago, ['efectivo', 'tarjeta', 'transferencia'], true))
    ) {
        responder(400, ['success' => false, 'message' => 'Selecciona un método de pago válido.']);
    }

    $conn->beginTransaction();
    $consulta = $conn->prepare(
        'SELECT estado_pedido FROM ventas WHERE id_venta = ? AND tipo_venta = ? FOR UPDATE'
    );
    $consulta->execute([$idVenta, 'domicilio']);
    $estadoActual = $consulta->fetchColumn();

    if ($estadoActual === false) {
        throw new OutOfBoundsException('No se encontró el pedido a domicilio.');
    }
//pedido estado
    $nuevoEstado = (new PedidoStateMachine())->transicionar(
        (string) $estadoActual,
        $estadoSolicitado
    );
    if ($nuevoEstado === 'cobrado') {
        $actualizar = $conn->prepare(
            'UPDATE ventas SET estado_pedido = ?, metodo_pago = ?, fecha_estado = CURRENT_TIMESTAMP
             WHERE id_venta = ? AND tipo_venta = ?'
        );
        $actualizar->execute([$nuevoEstado, $metodoPago, $idVenta, 'domicilio']);
    } else {
        $actualizar = $conn->prepare(
            'UPDATE ventas SET estado_pedido = ?, fecha_estado = CURRENT_TIMESTAMP
             WHERE id_venta = ? AND tipo_venta = ?'
        );
        $actualizar->execute([$nuevoEstado, $idVenta, 'domicilio']);
    }
    $conn->commit();

    responder(200, ['success' => true, 'estado' => $nuevoEstado]);
} catch (DomainException $error) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    responder(409, ['success' => false, 'message' => $error->getMessage()]);
} catch (OutOfBoundsException $error) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    responder(404, ['success' => false, 'message' => $error->getMessage()]);
} catch (Throwable $error) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log('Error al procesar el estado de pedido: ' . $error->getMessage());
    responder(500, ['success' => false, 'message' => 'No se pudo actualizar el pedido.']);
}
