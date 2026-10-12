(() => {
    'use strict';

    class SaleItemPrototype {
        constructor() {
            this.template = {
                name: '',
                originalName: '',
                price: 0,
                quantity: 1,
                subtotal: 0,
                category: '',
                ingredients: [],
                specialties: [],
                specialRequests: ''
            };
        }

        clone(values) {
            // Chiquilín: Prototype clona una plantilla para reutilizar la forma
            // del producto y mantener independientes los extras de cada copia.
            return {
                ...this.template,
                ...values,
                ingredients: [...(values.ingredients ?? this.template.ingredients)],
                specialties: [...(values.specialties ?? this.template.specialties)]
            };
        }
    }

    class VentaBuilder {
        // Chiquilín: Builder arma pedidos local y domicilio con los mismos
        // pasos y valida el resultado antes de enviarlo al servidor.
        constructor() {
            this.venta = { productos: [] };
        }

        setEmpleado(idEmpleado) {
            this.venta.id_empleado = idEmpleado;
            return this;
        }

        setTipoVenta(tipoVenta) {
            this.venta.tipo_venta = tipoVenta;
            return this;
        }

        setCliente(nombre, telefono = null, direccion = null) {
            this.venta.cliente_nombre = nombre;
            this.venta.telefono = telefono;
            this.venta.direccion = direccion;
            return this;
        }

        setTotal(total) {
            this.venta.total = total;
            return this;
        }

        setMetodoPago(metodoPago) {
            this.venta.metodo_pago = metodoPago;
            return this;
        }

        addProducto(producto) {
            this.venta.productos.push({ ...producto });
            return this;
        }

        build() {
            const { id_empleado, cliente_nombre, total, metodo_pago, productos } = this.venta;
            if (!Number.isInteger(id_empleado) || id_empleado <= 0) {
                throw new TypeError('La venta requiere un identificador de empleado válido.');
            }
            if (typeof cliente_nombre !== 'string' || !cliente_nombre.trim()) {
                throw new TypeError('La venta requiere el nombre del cliente.');
            }
            if (!Number.isFinite(total) || total < 0) {
                throw new TypeError('La venta requiere un total válido.');
            }
            if (typeof metodo_pago !== 'string' || !metodo_pago) {
                throw new TypeError('La venta requiere un método de pago.');
            }
            if (productos.length === 0) {
                throw new TypeError('La venta debe incluir al menos un producto.');
            }

            productos.forEach((producto, index) => {
                if (typeof producto.nombre !== 'string' || !producto.nombre.trim()
                    || !Number.isFinite(producto.cantidad) || producto.cantidad <= 0
                    || !Number.isFinite(producto.precio) || producto.precio < 0) {
                    throw new TypeError(`El producto ${index + 1} tiene datos inválidos.`);
                }
                if ('categoria' in producto
                    && (typeof producto.categoria !== 'string' || !producto.categoria.trim())) {
                    throw new TypeError(`El producto ${index + 1} requiere una categoría válida.`);
                }
            });

            // Entrega una copia para que cambios posteriores en la venta no alteren
            // accidentalmente el objeto que se enviará al servidor.
            return {
                ...this.venta,
                productos: productos.map(producto => ({ ...producto }))
            };
        }
    }

    window.SaleItemPrototype = SaleItemPrototype;
    window.VentaBuilder = VentaBuilder;
})();
