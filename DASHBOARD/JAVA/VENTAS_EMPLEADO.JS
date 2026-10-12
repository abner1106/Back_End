class HistorialVentas {
    constructor() {
        this.fechaInput = document.getElementById('fecha');
        this.btnBuscar = document.getElementById('btnBuscar');
        this.listaVentas = document.getElementById('listaVentas');
        this.tablaVentas = document.getElementById('tabla-ventas');
        this.modal = document.getElementById('modalDetalle');
        this.modalBody = document.getElementById('modalBody');
        this.ventasData = []; // Almacenar datos de ventas
        this.nombreEmpleado = 'Empleado'; // Variable para almacenar el nombre del empleado logueado

        this.init();
    }

    init() {
        this.establecerFechaHoy();
        this.bindEvents();
        this.actualizarNombreEmpleado().then(() => {
            this.cargarVentasDelDia();
        });
    }

    establecerFechaHoy() {
        const hoy = new Date();
        const fechaFormateada = this.formatearFechaParaInput(hoy);
        this.fechaInput.value = fechaFormateada;
    }

    formatearFechaParaInput(fecha) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    bindEvents() {
        this.btnBuscar.addEventListener('click', () => this.cargarVentasDelDia());
        this.fechaInput.addEventListener('change', () => this.cargarVentasDelDia());

        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => this.cerrarModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.cerrarModal();
        });
    }

    // Función para actualizar el nombre del empleado logueado
    async actualizarNombreEmpleado() {
        const userName = document.getElementById('userName');

        try {
            // Hacer una petición al servidor para obtener el nombre del empleado
            const response = await fetch('./PHP/OBTENER_EMPLEADO.php');

            if (!response.ok) {
                throw new Error('Error al obtener datos del empleado');
            }

            const data = await response.json();

            if (data.success && data.nombre) {
                this.nombreEmpleado = data.nombre; // Guardar el nombre en la variable de clase
                userName.textContent = data.nombre;
            } else {
                this.nombreEmpleado = 'Empleado';
                userName.textContent = 'Empleado';
            }
        } catch (error) {
            console.error('Error al obtener nombre del empleado:', error);
            this.nombreEmpleado = 'Empleado';
            userName.textContent = 'Empleado';
        }
    }

    async cargarVentasDelDia() {
        const fecha = this.fechaInput.value;

        if (!fecha) {
            this.mostrarError('Por favor selecciona una fecha');
            return;
        }

        try {
            this.mostrarLoading();

            // No necesitamos obtener el ID del empleado porque PHP ya lo obtiene de la sesión
            const fechaCodificada = encodeURIComponent(fecha);

            // Llamar al PHP que ya obtiene las ventas del empleado logueado
            const response = await fetch(`./PHP/VENTAS_EMPLEADO.PHP?fecha=${fechaCodificada}`);

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();

            if (data.success) {
                // Asegurar que todas las ventas tengan el nombre del empleado logueado
                data.ventas = data.ventas.map(venta => ({
                    ...venta,
                    empleado_nombre: this.nombreEmpleado // Usar el nombre del empleado logueado
                }));

                this.ventasData = data.ventas;
                this.mostrarResumen(data.totales);
                this.mostrarListaVentas(data.ventas);
                this.mostrarTablaDetalles(data.ventas);

                this.mostrarMensajeInfo(`Mostrando ventas del ${this.formatearFechaLegible(fecha)}`);
            } else {
                this.mostrarError(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarError('Error al cargar las ventas: ' + error.message);
        }
    }

    mostrarResumen(totales) {
        document.getElementById('totalDia').textContent = `$${this.formatearNumero(totales.total_dia)}`;
        document.getElementById('totalEfectivo').textContent = `$${this.formatearNumero(totales.efectivo)}`;
        document.getElementById('totalTarjeta').textContent = `$${this.formatearNumero(totales.tarjeta)}`;
        document.getElementById('totalTransferencia').textContent = `$${this.formatearNumero(totales.transferencia)}`;
    }

    mostrarListaVentas(ventas) {
        if (ventas.length === 0) {
            this.listaVentas.innerHTML = `
                <div class="loading">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No hay ventas registradas para esta fecha</p>
                    <small>Selecciona otra fecha para ver más ventas</small>
                </div>
            `;
            return;
        }

        this.listaVentas.innerHTML = ventas.map(venta => `
            <div class="sale-item" onclick="historial.mostrarDetalleVenta(${venta.id_venta})">
                <div class="sale-header">
                    <span class="sale-id">Venta #${venta.id_venta}</span>
                    <span class="sale-time">${this.formatearFechaHora(venta.fecha_hora)}</span>
                </div>
                <div class="sale-details">
                    <div class="detail-item">
                        <span class="detail-label">Empleado</span>
                        <span class="detail-value">${venta.empleado_nombre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total</span>
                        <span class="detail-value">$${this.formatearNumero(venta.total)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Método Pago</span>
                        <span class="detail-value">${this.formatearMetodoPago(venta.metodo_pago)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Productos</span>
                        <span class="detail-value">${venta.productos.length} productos</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    mostrarTablaDetalles(ventas) {
        const tbody = this.tablaVentas.querySelector('tbody');

        if (ventas.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem; display: block;"></i>
                    No hay ventas registradas para esta fecha
                </td>
            </tr>
        `;
            return;
        }

        let html = '';
        ventas.forEach((venta, ventaIndex) => {
            venta.productos.forEach((producto, productoIndex) => {
                const totalProducto = producto.precio * producto.cantidad;
                const esPrimeraFila = productoIndex === 0;
                const esUltimaFila = productoIndex === venta.productos.length - 1;

                let claseFila = 'fila-misma-venta';
                if (esPrimeraFila) {
                    claseFila = 'primera-fila-venta';
                } else if (esUltimaFila) {
                    claseFila = 'ultima-fila-venta';
                }

                html += `
                <tr class="${claseFila}">
                    <td>${esPrimeraFila ? this.formatearHora(venta.fecha_hora) : ''}</td>
                    <td>${esPrimeraFila ? this.nombreEmpleado : ''}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${this.formatearNumero(producto.precio)}</td>
                    <td>$${this.formatearNumero(totalProducto)}</td>
                    <td>${esPrimeraFila ? `<span class="badge-pago badge-${venta.metodo_pago}">${this.formatearMetodoPago(venta.metodo_pago)}</span>` : ''}</td>
                </tr>
            `;

                if (esUltimaFila && ventaIndex < ventas.length - 1) {
                    html += `
                    <tr class="venta-separator">
                        <td colspan="7">
                            <div style="height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); margin: 0.5rem 0;"></div>
                        </td>
                    </tr>
                `;
                }
            });
        });

        tbody.innerHTML = html;
    }

    mostrarDetalleVenta(idVenta) {
        // Buscar la venta en los datos cargados
        const venta = this.ventasData.find(v => v.id_venta === idVenta);

        if (!venta) {
            this.mostrarErrorModal('No se encontraron detalles para esta venta');
            return;
        }

        this.mostrarModalDetalle(venta);
    }

    mostrarModalDetalle(venta) {
        const productosHTML = venta.productos.map(producto => {
            const totalProducto = producto.precio * producto.cantidad;
            return `
                <div class="producto-detalle">
                    <div class="producto-header">
                        <span class="producto-nombre">${producto.nombre}</span>
                        <span class="producto-total">$${this.formatearNumero(totalProducto)}</span>
                    </div>
                    <div class="producto-info">
                        <div class="info-item">
                            <span class="info-label">Cantidad:</span>
                            <span class="info-value">${producto.cantidad}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Precio Unitario:</span>
                            <span class="info-value">$${this.formatearNumero(producto.precio)}</span>
                        </div>
                        ${producto.especialidades ? `
                        <div class="info-item">
                            <span class="info-label">Especialidades:</span>
                            <span class="info-value">${producto.especialidades}</span>
                        </div>
                        ` : ''}
                        ${producto.observaciones ? `
                        <div class="info-item">
                            <span class="info-label">Observaciones:</span>
                            <span class="info-value">${producto.observaciones}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        this.modalBody.innerHTML = `
            <div class="venta-detalle">
                <div class="venta-header">
                    <h3>Venta #${venta.id_venta}</h3>
                    <span class="venta-fecha">${this.formatearFechaHora(venta.fecha_hora)}</span>
                </div>
                
                <div class="venta-info-grid">
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Empleado</span>
                            <span class="info-value">${this.nombreEmpleado}</span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Método de Pago</span>
                            <span class="info-value badge-pago badge-${venta.metodo_pago}">
                                ${this.formatearMetodoPago(venta.metodo_pago)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Total Venta</span>
                            <span class="info-value total-venta">$${this.formatearNumero(venta.total)}</span>
                        </div>
                    </div>
                </div>

                <div class="productos-section">
                    <h4><i class="fas fa-list"></i> Productos (${venta.productos.length})</h4>
                    <div class="productos-lista">
                        ${productosHTML}
                    </div>
                </div>

                <div class="venta-resumen">
                    <div class="resumen-item">
                        <span class="resumen-label">Subtotal:</span>
                        <span class="resumen-value">$${this.formatearNumero(venta.total)}</span>
                    </div>
                    <div class="resumen-item total">
                        <span class="resumen-label">Total:</span>
                        <span class="resumen-value">$${this.formatearNumero(venta.total)}</span>
                    </div>
                </div>
            </div>
        `;

        this.modal.style.display = 'block';
    }

    mostrarErrorModal(mensaje) {
        this.modalBody.innerHTML = `
            <div class="error-modal">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${mensaje}</p>
                <button class="btn-primary" onclick="historial.cerrarModal()">Cerrar</button>
            </div>
        `;
        this.modal.style.display = 'block';
    }

    cerrarModal() {
        this.modal.style.display = 'none';
    }

    mostrarLoading() {
        this.listaVentas.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando ventas...</p>
            </div>
        `;

        this.tablaVentas.querySelector('tbody').innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                </td>
            </tr>
        `;
    }

    mostrarError(mensaje) {
        this.listaVentas.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${mensaje}</p>
            </div>
        `;
    }

    mostrarMensajeInfo(mensaje) {
        console.log('Info:', mensaje);
    }

    formatearNumero(numero) {
        return parseFloat(numero).toFixed(2);
    }

    formatearFechaHora(fechaHora) {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleString('es-ES');
    }

    formatearHora(fechaHora) {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatearFechaLegible(fechaStr) {
        const fecha = new Date(fechaStr);
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    formatearMetodoPago(metodo) {
        const metodos = {
            'efectivo': 'Efectivo',
            'tarjeta': 'Tarjeta',
            'transferencia': 'Transferencia'
        };
        return metodos[metodo] || metodo;
    }
}

// Inicializar la aplicación
const historial = new HistorialVentas();