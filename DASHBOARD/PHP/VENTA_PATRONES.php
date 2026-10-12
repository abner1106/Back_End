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
        $idEmpleado = filter_var($this->venta['id_empleado'] ?? null, FILTER_VALIDATE_INT);
        $total = $this->venta['total'] ?? null;
        $tipoVenta = $this->venta['tipo_venta'] ?? 'local';
        $metodoPago = $this->venta['metodo_pago'] ?? '';

        if ($idEmpleado === false || $idEmpleado <= 0) {
            throw new InvalidArgumentException('Se requiere un identificador de empleado válido.');
        }
        if (!is_numeric($total) || !is_finite((float) $total) || (float) $total < 0) {
            throw new InvalidArgumentException('Se requiere un total válido.');
        }
        if (!is_string($tipoVenta) || !in_array($tipoVenta, ['local', 'domicilio'], true)) {
            throw new InvalidArgumentException('El tipo de venta no es válido.');
        }
        if (!is_string($metodoPago) || !in_array($metodoPago, ['efectivo', 'transferencia'], true)) {
            throw new InvalidArgumentException('El método de pago no es válido.');
        }
        if (
            !is_string($this->venta['cliente_nombre'] ?? null)
            || trim($this->venta['cliente_nombre']) === ''
        ) {
            throw new InvalidArgumentException('Se requiere el nombre del cliente.');
        }
        foreach (['direccion', 'telefono', 'concepto', 'detalles'] as $optionalText) {
            if (
                isset($this->venta[$optionalText])
                && !is_string($this->venta[$optionalText])
            ) {
                throw new InvalidArgumentException("El campo $optionalText debe ser texto.");
            }
        }
        if ($this->venta['productos'] === []) {
            throw new InvalidArgumentException('La venta debe incluir al menos un producto.');
        }

        $this->venta['id_empleado'] = $idEmpleado;
        $this->venta['cliente_nombre'] = trim($this->venta['cliente_nombre']);
        $this->venta['total'] = (float) $total;
        $this->venta['tipo_venta'] = $tipoVenta;
        $this->venta['metodo_pago'] = $metodoPago;

        return $this->venta;
    }
}
