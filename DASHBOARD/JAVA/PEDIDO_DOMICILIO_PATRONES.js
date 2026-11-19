(() => {
    'use strict';

    class PrecioEstandarStrategy {
        calcularPrecio(extra) {
            return extra.precioEstandar;
        }
    }

    // Chiquilín, Strategy intercambia precio de catálogo y precio manual sin
    // meter condicionales de precio en cada cálculo; agregar otra regla requiere
    // otra estrategia, no modificar el cálculo del pedido.
    class PrecioEmpleadoStrategy {
        calcularPrecio(extra) {
            return extra.precioEmpleado;
        }
    }

    class ProductoBase {
        constructor(nombre, precio, cantidad) {
            this.nombre = nombre;
            this.precio = precio;
            this.cantidad = cantidad;
        }

        getCosto() {
            return this.precio * this.cantidad;
        }
    }

    class Extra {
        constructor(nombre, precio, cantidad, estrategia, precioEmpleado = precio) {
            this.nombre = nombre;
            this.precioEstandar = precio;
            this.precioEmpleado = precioEmpleado;
            this.cantidad = cantidad;
            this.estrategia = estrategia;
        }

        getCosto() {
            return this.estrategia.calcularPrecio(this) * this.cantidad;
        }
    }

    class PedidoComposite {
        constructor() {
            this.items = [];
        }

        agregar(item) {
            this.items.push(item);
        }

        getCosto() {
            return this.items.reduce((total, item) => total + item.getCosto(), 0);
        }
    }

    class ProcesadorPedido {
        procesar(lineas) {
            if (!Array.isArray(lineas) || lineas.length === 0) {
                throw new Error('El pedido debe incluir al menos un producto.');
            }

            const base = this.calcularBase(lineas);
            const extras = this.agregarExtras(lineas);
            const total = this.aplicarImpuestos(base + extras);

            return {
                base,
                extras,
                total,
                ticket: this.generarTicket(lineas, total)
            };
        }

        // Chiquilín, Template Method fija un único flujo de validación, subtotales
        // e impresión. Cada tipo de pedido personaliza solo sus pasos, evitando
        // duplicar el proceso completo cuando cambian las reglas.
        calcularBase() {
            throw new Error('El procesador debe calcular el subtotal base.');
        }

        agregarExtras() {
            throw new Error('El procesador debe calcular los extras.');
        }

        aplicarImpuestos(subtotal) {
            return subtotal;
        }

        generarTicket(lineas, total) {
            return {
                lineas: lineas.map(linea => ({
                    nombre: linea.name,
                    cantidad: linea.quantity,
                    subtotal: linea.subtotal
                })),
                total
            };
        }
    }

    class ProcesadorDomicilio extends ProcesadorPedido {
        calcularBase(lineas) {
            return lineas.reduce((total, linea) => total + linea.productoBase.getCosto(), 0);
        }


        agregarExtras(lineas) {
            return lineas.reduce((total, linea) => (
                total + linea.extras.reduce((subtotal, extra) => subtotal + extra.getCosto(), 0)
            ), 0);
        }
    }

    window.PedidoDomicilioPatterns = {
        Extra,
        PedidoComposite,
        PrecioEmpleadoStrategy,
        PrecioEstandarStrategy,
        ProcesadorDomicilio,
        ProductoBase
    };
})();
