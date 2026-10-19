<?php

require_once __DIR__ . '/VENTA_PATRONES.php';

interface VentaRepository
{
    public function save(array $venta): string;
}

final class PdoVentaRepository implements VentaRepository
{
    private PDO $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function save(array $venta): string
    {
        $this->connection->beginTransaction();

        try {
            $stmtVenta = $this->connection->prepare("
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
            $stmtVenta->execute([
                $venta['id_empleado'],
                $venta['tipo_venta'],
                $venta['cliente_nombre'],
                $venta['direccion'],
                $venta['telefono'],
                $venta['total'],
                $venta['metodo_pago'],
                $venta['concepto'],
                $venta['detalles'],
            ]);

            $idVenta = $this->connection->lastInsertId();
            $stmtProducto = $this->connection->prepare("
                INSERT INTO productos (nombre, descripcion, precio, activo, cantidad_disponible)
                VALUES (?, ?, ?, 1, ?)
                ON DUPLICATE KEY UPDATE
                    precio = VALUES(precio),
                    cantidad_disponible = cantidad_disponible - VALUES(cantidad_disponible)
            ");
            $stmtDetalle = $this->connection->prepare("
                INSERT INTO detalle_venta (
                    id_venta,
                    nombre_producto,
                    precio_unitario,
                    cantidad,
                    especialidades,
                    observaciones
                ) VALUES (?, ?, ?, ?, ?, ?)
            ");

            foreach ($venta['productos'] as $producto) {
                $stmtProducto->execute([
                    $producto['nombre'],
                    $producto['descripcion'],
                    $producto['precio'],
                    $producto['cantidad'],
                ]);
                $stmtDetalle->execute([
                    $idVenta,
                    $producto['nombre'],
                    $producto['precio'],
                    $producto['cantidad'],
                    $producto['especialidades'],
                    $producto['observaciones'],
                ]);
            }

            $this->connection->commit();
            return $idVenta;
        } catch (Throwable $error) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }

            throw $error;
        }
    }
}

final class LoggingVentaRepositoryDecorator implements VentaRepository
{
    private VentaRepository $repository;

    public function __construct(VentaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function save(array $venta): string
    {
        try {
            $idVenta = $this->repository->save($venta);
        } catch (Throwable $error) {
            error_log('No se pudo registrar una venta: ' . $error->getMessage());
            throw $error;
        }

        error_log(sprintf(
            'Venta registrada: id=%s, productos=%d',
            $idVenta,
            count($venta['productos'])
        ));

        return $idVenta;
    }
}

final class VentaRegistrationFacade
{
    private VentaRepository $repository;
    private ProductoVentaFactory $productoFactory;

    public function __construct(VentaRepository $repository, ProductoVentaFactory $productoFactory)
    {
        $this->repository = $repository;
        $this->productoFactory = $productoFactory;
    }

    public function register(array $data): array
    {
        if (!isset($data['productos']) || !is_array($data['productos'])) {
            throw new InvalidArgumentException('El cuerpo debe incluir una lista de productos.');
        }

        // Chiquilín, aquí se usa Builder para armar y validar la venta
        // paso a paso antes de guardarla.
        $builder = (new VentaBuilder())
            ->setEmpleado($data['id_empleado'] ?? null)
            ->setTipoVenta($data['tipo_venta'] ?? 'local')
            ->setCliente(
                $data['cliente_nombre'] ?? '',
                $data['direccion'] ?? null,
                $data['telefono'] ?? null
            )
            ->setTotal($data['total'] ?? null)
            ->setMetodoPago($data['metodo_pago'] ?? '')
            ->setConcepto($data['concepto'] ?? null, $data['detalles'] ?? null);

        foreach ($data['productos'] as $producto) {
            if (!is_array($producto)) {
                throw new InvalidArgumentException('Cada producto debe ser un objeto.');
            }
            $builder->addProducto($producto, $this->productoFactory);
        }

        $venta = $builder->build();

        return [
            'id_venta' => $this->repository->save($venta),
            'metodo_pago' => $venta['metodo_pago'],
            'total' => $venta['total'],
            'productos_count' => count($venta['productos']),
        ];
    }
}
