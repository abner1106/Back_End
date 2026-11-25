<?php

abstract class ProductoVentaFactory
{
    final public function create(array $data): array
    {
        $nombre = $data['nombre'] ?? null;
        $cantidad = $data['cantidad'] ?? null;
        $precio = $data['precio'] ?? null;
        $descripcion = $data['descripcion'] ?? null;
        $especialidades = $data['especialidades'] ?? null;
        $observaciones = $data['observaciones'] ?? null;

        if (
            !is_string($nombre)
            || trim($nombre) === ''
            || !is_numeric($cantidad)
            || !is_finite((float) $cantidad)
            || (float) $cantidad <= 0
            || !is_numeric($precio)
            || !is_finite((float) $precio)
            || (float) $precio < 0
            || ($descripcion !== null && !is_string($descripcion))
            || ($especialidades !== null && !is_string($especialidades))
            || ($observaciones !== null && !is_string($observaciones))
        ) {
            throw new InvalidArgumentException('Un producto contiene datos inválidos.');
        }

        return $this->createProduct($data, trim($nombre), (float) $cantidad, (float) $precio);
    }

    // Chiquilín: Factory Method deja que cada fábrica concreta decida cómo
    // transformar los datos de un producto, sin acoplar el endpoint a ese formato.
    abstract protected function createProduct(
        array $data,
        string $nombre,
        float $cantidad,
        float $precio
    ): array;
}

// Chiquilín: esta fábrica concreta entrega al endpoint los campos de producto
// que requieren las ventas guardadas con PDO.
final class ProductoVentaLocalFactory extends ProductoVentaFactory
{
    protected function createProduct(
        array $data,
        string $nombre,
        float $cantidad,
        float $precio
    ): array {
        return [
            'nombre' => $nombre,
            'descripcion' => trim((string) ($data['descripcion'] ?? $nombre)),
            'cantidad' => $cantidad,
            'precio' => $precio,
            'especialidades' => $data['especialidades'] ?? null,
            'observaciones' => $data['observaciones'] ?? null,
        ];
    }
}

abstract class VentaValidationHandler
{
    private ?VentaValidationHandler $nextHandler = null;

    public function setNext(VentaValidationHandler $handler): VentaValidationHandler
    {
        $this->nextHandler = $handler;
        return $handler;
    }

    final public function handle(array &$venta): void
    {
        $this->validate($venta);
        if ($this->nextHandler !== null) {
            $this->nextHandler->handle($venta);
        }
    }

    abstract protected function validate(array &$venta): void;
}

final class EmpleadoVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        $idEmpleado = filter_var($venta['id_empleado'] ?? null, FILTER_VALIDATE_INT);
        if ($idEmpleado === false || $idEmpleado <= 0) {
            throw new InvalidArgumentException('Se requiere un identificador de empleado válido.');
        }
    }
}

final class TotalVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        $total = $venta['total'] ?? null;
        if (!is_numeric($total) || !is_finite((float) $total) || (float) $total < 0) {
            throw new InvalidArgumentException('Se requiere un total válido.');
        }
    }
}

final class TipoVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        $tipoVenta = $venta['tipo_venta'] ?? 'local';
        if (!is_string($tipoVenta) || !in_array($tipoVenta, ['local', 'domicilio'], true)) {
            throw new InvalidArgumentException('El tipo de venta no es válido.');
        }
    }
}

final class MetodoPagoVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        $metodoPago = $venta['metodo_pago'] ?? '';
        if (!is_string($metodoPago) || !in_array($metodoPago, ['efectivo', 'transferencia'], true)) {
            throw new InvalidArgumentException('El método de pago no es válido.');
        }
    }
}

final class ClienteVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        if (
            !is_string($venta['cliente_nombre'] ?? null)
            || trim($venta['cliente_nombre']) === ''
        ) {
            throw new InvalidArgumentException('Se requiere el nombre del cliente.');
        }
    }
}

final class TextoOpcionalVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        foreach (['direccion', 'telefono', 'concepto', 'detalles'] as $optionalText) {
            if (isset($venta[$optionalText]) && !is_string($venta[$optionalText])) {
                throw new InvalidArgumentException("El campo $optionalText debe ser texto.");
            }
        }
    }
}

final class ProductosVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        if ($venta['productos'] === []) {
            throw new InvalidArgumentException('La venta debe incluir al menos un producto.');
        }
    }
}

final class NormalizarVentaValidationHandler extends VentaValidationHandler
{
    protected function validate(array &$venta): void
    {
        $venta['id_empleado'] = filter_var($venta['id_empleado'], FILTER_VALIDATE_INT);
        $venta['cliente_nombre'] = trim($venta['cliente_nombre']);
        $venta['total'] = (float) $venta['total'];
        $venta['tipo_venta'] = $venta['tipo_venta'] ?? 'local';
        $venta['metodo_pago'] = $venta['metodo_pago'] ?? '';
    }
}

final class VentaBuilder
{
    // Chiquilín: Builder permite completar el pedido paso a paso y concentrar
    // sus reglas de validación antes de que el backend lo guarde.
    private array $venta = ['productos' => []];

    public function setEmpleado($idEmpleado): self
    {
        $this->venta['id_empleado'] = $idEmpleado;
        return $this;
    }

    public function setTipoVenta($tipoVenta): self
    {
        $this->venta['tipo_venta'] = $tipoVenta;
        return $this;
    }

    public function setCliente($nombre, $direccion, $telefono): self
    {
        $this->venta['cliente_nombre'] = $nombre;
        $this->venta['direccion'] = $direccion;
        $this->venta['telefono'] = $telefono;
        return $this;
    }

    public function setTotal($total): self
    {
        $this->venta['total'] = $total;
        return $this;
    }

    public function setMetodoPago($metodoPago): self
    {
        $this->venta['metodo_pago'] = $metodoPago;
        return $this;
    }

    public function setConcepto($concepto, $detalles): self
    {
        $this->venta['concepto'] = $concepto;
        $this->venta['detalles'] = $detalles;
        return $this;
    }

    public function addProducto(array $data, ProductoVentaFactory $factory): self
    {
        $this->venta['productos'][] = $factory->create($data);
        return $this;
    }

    public function build(): array
    {
        // Chiquilín: Chain of Responsibility valida en DASHBOARD/PHP/VENTA_PATRONES.php;
        // cada handler revisa una regla y delega al siguiente para aislar las validaciones.
        $validationChain = new EmpleadoVentaValidationHandler();
        $validationChain
            ->setNext(new TotalVentaValidationHandler())
            ->setNext(new TipoVentaValidationHandler())
            ->setNext(new MetodoPagoVentaValidationHandler())
            ->setNext(new ClienteVentaValidationHandler())
            ->setNext(new TextoOpcionalVentaValidationHandler())
            ->setNext(new ProductosVentaValidationHandler())
            ->setNext(new NormalizarVentaValidationHandler());

        $validationChain->handle($this->venta);

        return $this->venta;
    }
}
