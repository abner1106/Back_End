document.addEventListener('DOMContentLoaded', function () {
    // Configuración inicial
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarDatosDelDia();

    // Event listeners
    document.getElementById('form-retiro').addEventListener('submit', function (e) {
        e.preventDefault();
        realizarRetiro();
    });

    document.getElementById('imprimir-pdf').addEventListener('click', function () {
        window.print();
    });



    // Manejo del campo "Otro motivo"
    document.getElementById('motivo').addEventListener('change', function () {
        const otroContainer = document.getElementById('otro-motivo-container');
        const otroInput = document.getElementById('otro-motivo');

        if (this.value === 'otro') {
            otroContainer.style.display = 'block';
            otroInput.required = true;
            setTimeout(() => {
                otroInput.focus();
            }, 300);
        } else {
            otroContainer.style.display = 'none';
            otroInput.required = false;
            otroInput.value = '';
        }
    });
});

// Función para formatear moneda
function formatearMoneda(valor) {
    return '$' + parseFloat(valor || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    document.getElementById('fecha-hora').textContent = ahora.toLocaleDateString('es-ES', opciones);
}

// Función principal para cargar datos
async function cargarDatosDelDia() {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const response = await fetch(`./PHP/OBTENER_VENTAS_DIA.php?fecha=${hoy}`);

        if (!response.ok) {
            throw new Error('Error al cargar los datos del servidor');
        }

        const data = await response.json();

        if (data.success) {
            actualizarResumenVentas(data.totales);
            actualizarTablaVentas(data.ventas);
            actualizarTablaRetiros(data.retiros); // Esta es la línea clave
        } else {
            throw new Error(data.message || 'Error en los datos recibidos');
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
    }
}

// Actualizar resumen de ventas
function actualizarResumenVentas(totales) {
    const elementos = {
        'efectivo': totales.efectivo,
        'tarjetas': totales.tarjeta,
        'transferencias': totales.transferencia,
        'total-dia': totales.total_dia,
        'efectivo-caja': totales.efectivo_caja
    };

    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = formatearMoneda(valor);

            // Resaltar el efectivo en caja si es bajo
            if (id === 'efectivo-caja' && valor < 1000) {
                elemento.classList.add('bajo-efectivo');
            } else {
                elemento.classList.remove('bajo-efectivo');
            }
        }
    }
}

// Actualizar tabla de ventas (versión sin nombre de cliente)
function actualizarTablaVentas(ventas) {
    const tbody = document.querySelector('#tabla-ventas tbody');
    if (!tbody) {
        console.error('No se encontró la tabla de ventas');
        return;
    }

    tbody.innerHTML = '';

    if (!ventas || ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay ventas registradas hoy</td>
            </tr>
        `;
        return;
    }

    // Ordenar ventas por fecha (más reciente primero)
    ventas.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

    ventas.forEach(venta => {
        if (!venta.productos || venta.productos.length === 0) return;

        // Formatear hora
        const fechaHora = new Date(venta.fecha_hora);
        const hora = fechaHora.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Mostrar cada producto de la venta
        venta.productos.forEach((producto, index) => {
            const tr = document.createElement('tr');

            // Solo mostrar hora en la primera fila (eliminado el nombre del cliente)
            const horaCell = index === 0 ? hora : '';

            // Mostrar método de pago solo en la primera fila
            const metodoPago = index === 0
                ? (venta.metodo_pago || 'efectivo').charAt(0).toUpperCase() + (venta.metodo_pago || 'efectivo').slice(1)
                : '';

            tr.innerHTML = `
                <td>${horaCell}</td>
                <td>
                    ${producto.nombre}
                    ${producto.observaciones ? '<br><small class="text-muted">' + producto.observaciones + '</small>' : ''}
                    ${producto.especialidades ? '<br><small class="text-muted">' + producto.especialidades + '</small>' : ''}
                </td>
                <td>${producto.cantidad}</td>
                <td>${formatearMoneda(producto.precio)}</td>
                <td>${formatearMoneda(producto.precio * producto.cantidad)}</td>
                <td>${metodoPago}</td>
            `;

            tbody.appendChild(tr);
        });
    });
}

// Función para actualizar tabla de retiros (ESTA ES LA FUNCIÓN QUE FALTABA)
function actualizarTablaRetiros(retiros) {
    const tbody = document.querySelector('#tabla-retiros tbody');
    if (!tbody) {
        console.error('No se encontró la tabla de retiros');
        return;
    }

    tbody.innerHTML = '';

    if (!retiros || retiros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay retiros registrados hoy</td>
            </tr>
        `;
        return;
    }

    // Ordenar retiros por fecha (más reciente primero)
    retiros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    retiros.forEach(retiro => {
        const tr = document.createElement('tr');

        // Formatear fecha y hora
        const fechaHora = new Date(retiro.fecha);
        const fecha = fechaHora.toLocaleDateString('es-MX');
        const hora = fechaHora.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td>${fecha} ${hora}</td>
            <td>${retiro.motivo}${retiro.empleado ? ' (' + retiro.empleado + ')' : ''}</td>
            <td class="monto-retiro">${formatearMoneda(retiro.monto)}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Función para realizar retiros
async function realizarRetiro() {
    const motivoSelect = document.getElementById('motivo');
    const motivoOtro = document.getElementById('otro-motivo');
    const montoInput = document.getElementById('monto');

    let motivo = motivoSelect.value;
    if (motivo === 'otro') {
        motivo = motivoOtro.value.trim();
        if (!motivo) {
            mostrarNotificacion('Por favor especifique el motivo del retiro', 'warning');
            return;
        }
    } else {
        motivo = motivoSelect.options[motivoSelect.selectedIndex].text;
    }

    const monto = parseFloat(montoInput.value);
    if (isNaN(monto) || monto <= 0) {
        mostrarNotificacion('Ingrese un monto válido mayor a cero', 'warning');
        return;
    }

    const efectivoCaja = parseFloat(document.getElementById('efectivo-caja').textContent.replace(/[^0-9.-]+/g, ""));
    if (monto > efectivoCaja) {
        mostrarNotificacion('No hay suficiente efectivo en caja para este retiro', 'error');
        return;
    }

    try {
        const response = await fetch('./PHP/GUARDAR_RETIROS.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                motivo: motivo,
                monto: monto,
                id_empleado: 2 // Cambiar por ID real del empleado
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarNotificacion('Retiro registrado correctamente', 'success');
            document.getElementById('form-retiro').reset();
            cargarDatosDelDia(); // Recargar datos
        } else {
            throw new Error(data.message || 'Error al registrar el retiro');
        }
    } catch (error) {
        console.error('Error al registrar retiro:', error);
        mostrarNotificacion('Error al registrar retiro: ' + error.message, 'error');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

