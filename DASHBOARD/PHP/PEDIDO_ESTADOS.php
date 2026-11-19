<?php

interface EstadoPedido
{
    public function cambiarA(string $nuevoEstado): string;
}

abstract class EstadoPedidoBase implements EstadoPedido
{
    protected function validarTransicion(string $nuevoEstado, array $permitidos): string
    {
        if (!in_array($nuevoEstado, $permitidos, true)) {
            throw new DomainException('La transición solicitada no está permitida.');
        }

        return $nuevoEstado;
    }
}

final class EstadoPendiente extends EstadoPedidoBase
{
    public function cambiarA(string $nuevoEstado): string
    {
        return $this->validarTransicion($nuevoEstado, ['entregado', 'cancelado']);
    }
}

final class EstadoEntregado extends EstadoPedidoBase
{
    public function cambiarA(string $nuevoEstado): string
    {
        return $this->validarTransicion($nuevoEstado, ['cobrado']);
    }
}

final class EstadoCobrado extends EstadoPedidoBase
{
    public function cambiarA(string $nuevoEstado): string
    {
        return $this->validarTransicion($nuevoEstado, []);
    }
}

final class EstadoCancelado extends EstadoPedidoBase
{
    public function cambiarA(string $nuevoEstado): string
    {
        return $this->validarTransicion($nuevoEstado, []);
    }
}

final class PedidoStateMachine
{
    public function transicionar(string $estadoActual, string $nuevoEstado): string
    {
        $estados = [
            'pendiente' => new EstadoPendiente(),
            'entregado' => new EstadoEntregado(),
            'cobrado' => new EstadoCobrado(),
            'cancelado' => new EstadoCancelado(),
        ];

        if (!isset($estados[$estadoActual])) {
            throw new DomainException('El pedido tiene un estado desconocido.');
        }

        // Chiquilín, State deja que cada estado decida sus siguientes pasos.
        // Evita un switch de transiciones repartido entre la API y la pantalla,
        // y rechaza cambios inválidos antes de tocar la base de datos.
        return $estados[$estadoActual]->cambiarA($nuevoEstado);
    }
}

// Chiquilín, Command concentra los datos y efectos de cancelar (motivo,
// empleado, transacción y auditoría) en una operación reutilizable y verificable.
final class ComandoCancelarPedido
{
    private PDO $conexion;
    private int $idVenta;
    private int $idEmpleado;
    private string $motivo;

    public function __construct(PDO $conexion, int $idVenta, int $idEmpleado, string $motivo)
    {
        $this->conexion = $conexion;
        $this->idVenta = $idVenta;
        $this->idEmpleado = $idEmpleado;
        $this->motivo = $motivo;
    }

    public function ejecutar(): void
    {
        $this->conexion->beginTransaction();

        try {
            $consulta = $this->conexion->prepare(
                "SELECT estado_pedido FROM ventas
                 WHERE id_venta = ? AND tipo_venta = 'domicilio' FOR UPDATE"
            );
            $consulta->execute([$this->idVenta]);
            $estado = $consulta->fetchColumn();

            if ($estado === false) {
                throw new OutOfBoundsException('No se encontró el pedido.');
            }

            (new PedidoStateMachine())->transicionar((string) $estado, 'cancelado');

            $actualizar = $this->conexion->prepare(
                "UPDATE ventas
                 SET estado_pedido = 'cancelado', motivo_cancelacion = ?,
                     id_empleado_cancelacion = ?,
                     fecha_estado = CURRENT_TIMESTAMP
                 WHERE id_venta = ? AND tipo_venta = 'domicilio'"
            );
            $actualizar->execute([$this->motivo, $this->idEmpleado, $this->idVenta]);
            $this->conexion->commit();

            // Chiquilín, Command encapsula la cancelación (pedido, motivo y
            // empleado) para que esta operación quede validada antes de guardarse.
        } catch (Throwable $error) {
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }

            throw $error;
        }
    }
}
