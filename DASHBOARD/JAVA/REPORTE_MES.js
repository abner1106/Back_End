document.addEventListener('DOMContentLoaded', function () {
    // Configuración inicial
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Configurar fechas por defecto
    configurarFechas();

    // Event listeners
    configurarEventListeners();

    // Generar reporte inicial
    generarReporte();
});

function configurarFechas() {
    const hoy = new Date();
    const fechaMinima = new Date();
    fechaMinima.setMonth(fechaMinima.getMonth() - 3);

    // Configurar fecha día
    document.getElementById('fecha-dia').valueAsDate = hoy;
    document.getElementById('fecha-dia').min = fechaMinima.toISOString().split('T')[0];

    // Configurar semana (lunes de la semana actual)
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));
    document.getElementById('fecha-semana').valueAsDate = lunes;
    document.getElementById('fecha-semana').min = fechaMinima.toISOString().split('T')[0];

    // Configurar mes
    document.getElementById('fecha-mes').value = hoy.toISOString().substring(0, 7);
    document.getElementById('fecha-mes').min = fechaMinima.toISOString().substring(0, 7);

    // Configurar rango personalizado (últimos 7 días por defecto)
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    document.getElementById('fecha-inicio').valueAsDate = hace7Dias;
    document.getElementById('fecha-fin').valueAsDate = hoy;
    document.getElementById('fecha-inicio').min = fechaMinima.toISOString().split('T')[0];
    document.getElementById('fecha-fin').min = fechaMinima.toISOString().split('T')[0];
}

function configurarEventListeners() {
    // Cambiar tipo de reporte
    document.getElementById('tipo-reporte').addEventListener('change', function () {
        const tipo = this.value;

        // Ocultar todos los filtros
        document.querySelectorAll('.filtro-group').forEach(el => {
            el.style.display = 'none';
        });

        // Mostrar el filtro correspondiente
        document.getElementById(`filtro-${tipo}`).style.display = 'block';
    });

    // Generar reporte
    document.getElementById('generar-reporte').addEventListener('click', generarReporte);

    // Exportar a PDF
    document.getElementById('imprimir-pdf').addEventListener('click', generarPDF);
}

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

async function generarReporte() {
    const tipo = document.getElementById('tipo-reporte').value;
    let url = './PHP/REPORTE_MES.php?';
    let titulo = '';

    // Mostrar loader
    const btnGenerar = document.getElementById('generar-reporte');
    const btnOriginal = btnGenerar.innerHTML;
    btnGenerar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    btnGenerar.disabled = true;

    try {
        // Validar y construir URL según el tipo de reporte
        switch (tipo) {
            case 'dia':
                const fechaDia = document.getElementById('fecha-dia').value;
                if (!fechaDia) throw new Error('Selecciona una fecha válida');
                url += `tipo=dia&fecha=${encodeURIComponent(fechaDia)}`;
                titulo = `Ventas del día ${formatFecha(fechaDia)}`;
                break;

            case 'semana':
                const fechaSemana = document.getElementById('fecha-semana').value;
                if (!fechaSemana) throw new Error('Selecciona una fecha válida');
                const fechaDomingo = new Date(fechaSemana);
                fechaDomingo.setDate(fechaDomingo.getDate() + 6);
                url += `tipo=semana&fecha=${encodeURIComponent(fechaSemana)}`;
                titulo = `Ventas de la semana ${formatFecha(fechaSemana)} al ${formatFecha(fechaDomingo.toISOString().split('T')[0])}`;
                break;

            case 'mes':
                const fechaMes = document.getElementById('fecha-mes').value;
                if (!fechaMes) throw new Error('Selecciona un mes válido');
                url += `tipo=mes&fecha=${encodeURIComponent(fechaMes)}`;
                const mesNombre = new Date(fechaMes + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                titulo = `Ventas del mes ${mesNombre}`;
                break;

            case 'personalizado':
                const fechaInicio = document.getElementById('fecha-inicio').value;
                const fechaFin = document.getElementById('fecha-fin').value;
                if (!fechaInicio || !fechaFin) throw new Error('Selecciona un rango de fechas válido');
                if (fechaInicio > fechaFin) throw new Error('La fecha de inicio no puede ser mayor a la fecha final');
                url += `tipo=personalizado&inicio=${encodeURIComponent(fechaInicio)}&fin=${encodeURIComponent(fechaFin)}`;
                titulo = `Ventas del ${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}`;
                break;
        }

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.message || `Error HTTP ${response.status}`;
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data || data.success === false) {
            throw new Error(data?.message || 'Respuesta inválida del servidor');
        }

        // Procesar datos exitosos
        actualizarVista(data, titulo);
        mostrarNotificacion('Datos cargados correctamente', 'success');

    } catch (error) {
        console.error("Error en generarReporte:", error);
        mostrarNotificacion(`Error: ${error.message}`, 'error');
    } finally {
        // Restaurar botón
        btnGenerar.innerHTML = btnOriginal;
        btnGenerar.disabled = false;
    }
}

function actualizarVista(data, titulo) {
    // Verificar datos antes de actualizar
    if (!data) {
        console.error("No hay datos para actualizar la vista");
        return;
    }

    // Actualizar título
    document.querySelector('.header h1').textContent = data.titulo || titulo || 'Reporte de Ventas';

    // Actualizar resumen
    if (data.totales) {
        actualizarResumenVentas(data.totales);
    }

    // Actualizar tablas
    if (data.ventas) {
        actualizarTablaVentas(data.ventas);
    }

    if (data.retiros) {
        actualizarTablaRetiros(data.retiros);
    }
}

function actualizarResumenVentas(totales) {
    const elementos = {
        'efectivo': totales.efectivo,
        'tarjetas': totales.tarjeta,
        'transferencias': totales.transferencia,
        'total-dia': totales.total,
        'efectivo-caja': totales.efectivo_caja || 0  // Asegurar valor por defecto
    };

    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Animación de cambio de valor
            elemento.style.transform = 'scale(1.1)';
            setTimeout(() => {
                elemento.textContent = formatearMoneda(valor);
                elemento.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function actualizarTablaVentas(ventas) {
    const tbody = document.querySelector('#tabla-ventas tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!ventas || ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay ventas registradas en este período</td>
            </tr>
        `;
        return;
    }

    // Ordenar ventas por fecha (más reciente primero)
    ventas.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

    ventas.forEach(venta => {
        if (!venta.productos || venta.productos.length === 0) return;

        const fechaHora = new Date(venta.fecha_hora);
        const hora = fechaHora.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        venta.productos.forEach((producto, index) => {
            const tr = document.createElement('tr');
            tr.style.animation = 'fadeIn 0.3s ease-out';

            // Solo mostrar hora en la primera fila
            const horaCelda = index === 0 ? hora : '';

            // Mostrar método de pago solo en la primera fila
            const metodoPago = index === 0
                ? (venta.metodo_pago || 'efectivo').charAt(0).toUpperCase() + (venta.metodo_pago || 'efectivo').slice(1)
                : '';

            tr.innerHTML = `
                <td>${horaCelda}</td>
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

function actualizarTablaRetiros(retiros) {
    const tbody = document.querySelector('#tabla-retiros tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!retiros || retiros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay retiros registrados en este período</td>
            </tr>
        `;
        return;
    }

    retiros.forEach(retiro => {
        const tr = document.createElement('tr');
        tr.style.animation = 'fadeIn 0.3s ease-out';

        const fechaHora = new Date(retiro.fecha).toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td>${fechaHora}</td>
            <td>${retiro.motivo}${retiro.empleado ? ' (' + retiro.empleado + ')' : ''}</td>
            <td>${formatearMoneda(retiro.monto)}</td>
        `;

        tbody.appendChild(tr);
    });
}

function generarPDF() {
    // Mostrar loader
    const btnPDF = document.getElementById('imprimir-pdf');
    const originalContent = btnPDF.innerHTML;
    btnPDF.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando PDF...';
    btnPDF.disabled = true;

    // Crear un clon del contenido que queremos imprimir
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';

    // Clonar el contenedor principal
    const mainContent = document.querySelector('.container').cloneNode(true);

    // Ocultar elementos que no queremos en el PDF
    const elementsToHide = mainContent.querySelectorAll('.no-print, button, .filtro-group, #generar-reporte, #imprimir-pdf');
    elementsToHide.forEach(el => el.style.display = 'none');

    // Agregar estilos específicos para impresión
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            body, html {
                margin: 0;
                padding: 0;
                background: white;
            }
            .print-container {
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .resumen-ventas {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .resumen-box {
                border: 1px solid #ddd;
                padding: 10px;
                margin: 5px;
                min-width: 150px;
                text-align: center;
            }
        }
    `;

    // Agregar fecha y hora de generación
    const fechaGeneracion = document.createElement('div');
    fechaGeneracion.style.textAlign = 'center';
    fechaGeneracion.style.marginBottom = '15px';
    fechaGeneracion.style.fontStyle = 'italic';
    fechaGeneracion.textContent = `Generado el: ${new Date().toLocaleString('es-ES')}`;

    printContainer.appendChild(fechaGeneracion);
    printContainer.appendChild(mainContent);
    printContainer.appendChild(printStyles);

    // Agregar al cuerpo del documento temporalmente
    document.body.appendChild(printContainer);

    // Esperar un momento para que se renderice el contenido
    setTimeout(() => {
        // Activar la función de impresión del navegador
        window.print();

        // Limpiar después de imprimir
        document.body.removeChild(printContainer);

        // Restaurar botón
        btnPDF.innerHTML = originalContent;
        btnPDF.disabled = false;
    }, 500);
}

function formatearMoneda(valor) {
    return '$' + parseFloat(valor || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function mostrarNotificacion(mensaje, tipo) {
    // Eliminar notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion');
    notificacionesAnteriores.forEach(el => el.remove());

    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${mensaje}
    `;

    document.body.appendChild(notificacion);

    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}