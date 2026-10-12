document.addEventListener('DOMContentLoaded', function () {
    const { jsPDF } = window.jspdf;
    let productsChart, salesTrendChart;
    const modal = document.getElementById('details-modal');
    const closeBtn = document.querySelector('.close');

    initDateFilters();
    setupEventListeners();

    function setupEventListeners() {
        document.getElementById('generate-report').addEventListener('click', generateReport);
        document.getElementById('export-pdf').addEventListener('click', exportToPDF);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');

                if (tabId === 'employees-tab') {
                    document.getElementById('employees-tab').innerHTML = `
                        <div class="no-data-message">
                            <i class="fas fa-info-circle"></i>
                            <p>Información de empleados no disponible</p>
                        </div>
                    `;
                }
            });
        });

        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function initDateFilters() {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        document.getElementById('start-date').valueAsDate = oneMonthAgo;
        document.getElementById('end-date').valueAsDate = today;
    }

    async function generateReport() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const saleType = document.getElementById('sale-type').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!startDate || !endDate) {
            showError('Por favor seleccione un rango de fechas válido');
            return;
        }

        showLoadingState();

        try {
            const params = new URLSearchParams();
            params.append('action', 'get_report');
            params.append('startDate', startDate);
            params.append('endDate', endDate);

            if (saleType !== 'all') params.append('saleType', saleType);
            if (paymentMethod !== 'all') params.append('paymentMethod', paymentMethod);

            const url = `./PHP/API_VENTAS.php?${params.toString()}`;
            console.log('Solicitando URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`La respuesta no es JSON: ${text.substring(0, 100)}...`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error desconocido al generar el reporte');
            }

            updateDashboard(data.data);
            updateCharts(data.data);
        } catch (error) {
            console.error('Error al generar reporte:', error);
            showError(`Error al cargar datos: ${error.message}`);
        }
    }

    function showLoadingState() {
        document.querySelectorAll('.summary-card .amount, .summary-card .product').forEach(el => {
            el.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        });

        document.querySelectorAll('#products-table-body, #sales-table-body').forEach(el => {
            el.innerHTML = '<tr><td colspan="6" class="loading-text"><i class="fas fa-spinner fa-spin"></i> Cargando datos...</td></tr>';
        });
    }

    function showError(message) {
        const existingError = document.getElementById('error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;

        const container = document.querySelector('.container') || document.body;
        container.insertBefore(errorDiv, container.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function updateDashboard(data) {
        try {
            document.querySelector('.total-sales .amount').textContent =
                `$${data.totalVentas?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}`;
            document.querySelector('.total-sales .period').textContent =
                `Del ${formatDate(data.fechaInicio)} al ${formatDate(data.fechaFin)}`;

            if (data.productoMasVendido) {
                document.querySelector('.best-seller .product').textContent =
                    data.productoMasVendido.producto || 'Producto no disponible';
                document.querySelector('.best-seller .amount').textContent =
                    `${data.productoMasVendido.vendidos || 0} unidades`;
            }

            if (data.productoMenosVendido) {
                document.querySelector('.worst-seller .product').textContent =
                    data.productoMenosVendido.producto || 'Producto no disponible';
                document.querySelector('.worst-seller .amount').textContent =
                    `${data.productoMenosVendido.vendidos || 0} unidades`;
            }

            const productsBody = document.getElementById('products-table-body');
            productsBody.innerHTML = '';

            if (data.productos && data.productos.length > 0) {
                data.productos.forEach((producto, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${producto.producto || 'Producto ' + producto.id_producto}</td>
                        <td>${producto.vendidos || 0}</td>
                        <td>$${(producto.ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td>${producto.porcentaje?.toFixed(1) || '0.0'}%</td>
                    `;
                    productsBody.appendChild(row);
                });
            } else {
                productsBody.innerHTML = '<tr><td colspan="6">No se encontraron productos</td></tr>';
            }

            const salesBody = document.getElementById('sales-table-body');
            salesBody.innerHTML = '';

            if (data.ventas && data.ventas.length > 0) {
                data.ventas.forEach(venta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${venta.id_venta || 'N/A'}</td>
                        <td>${formatDate(venta.fecha)}</td>
                        <td>${venta.tipo_venta ? venta.tipo_venta.charAt(0).toUpperCase() + venta.tipo_venta.slice(1) : ''}</td>
                        <td>${venta.metodo_pago ? venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1) : ''}</td>
                        <td>$${(venta.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td><button class="details-btn" data-id="${venta.id_venta}">Ver detalles</button></td>
                    `;
                    salesBody.appendChild(row);
                });

                document.querySelectorAll('.details-btn').forEach(btn => {
                    btn.addEventListener('click', showSaleDetails);
                });
            } else {
                salesBody.innerHTML = '<tr><td colspan="7">No se encontraron ventas</td></tr>';
            }

        } catch (error) {
            console.error('Error al actualizar dashboard:', error);
            showError('Error al mostrar los datos');
        }
    }

    async function showSaleDetails(e) {
        const ventaId = e.target.getAttribute('data-id');

        if (!ventaId) {
            showError('ID de venta no válido');
            return;
        }

        try {
            const url = `./PHP/API_VENTAS.php?action=get_sale_details&id=${ventaId}`;
            console.log('Solicitando detalles:', url);

            const response = await fetch(url);


            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error al obtener detalles');
            }

            showModalWithDetails(data.data);
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            showError(`Error al cargar detalles: ${error.message}`);
        }
    }

    function showModalWithDetails(detalles) {
        if (!detalles) {
            showError('No se recibieron detalles de la venta');
            return;
        }

        document.getElementById('modal-title').textContent = `Detalles de Venta #${detalles.venta?.id_venta || 'N/A'}`;

        let modalHtml = `
            <div class="modal-section">
                <h3><i class="fas fa-info-circle"></i> Información General</h3>
                <p><strong>Fecha:</strong> ${formatDateTime(detalles.venta?.fecha)}</p>
                <p><strong>Tipo:</strong> ${detalles.venta?.tipo_venta ? detalles.venta.tipo_venta.charAt(0).toUpperCase() + detalles.venta.tipo_venta.slice(1) : ''}</p>
                <p><strong>Método de pago:</strong> ${detalles.venta?.metodo_pago ? detalles.venta.metodo_pago.charAt(0).toUpperCase() + detalles.venta.metodo_pago.slice(1) : ''}</p>
                <p><strong>Total:</strong> $${(detalles.venta?.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div class="modal-section">
                <h3><i class="fas fa-list"></i> Productos</h3>
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                            <th>Especificaciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (detalles.productos && detalles.productos.length > 0) {
            detalles.productos.forEach(item => {
                const especificaciones = [
                    item.especialidades,
                    item.ingredientes,
                    item.observaciones
                ].filter(Boolean).join(', ') || '-';

                modalHtml += `
                    <tr>
                        <td>${item.nombre_producto || 'Producto ' + item.id_producto}</td>
                        <td>${item.cantidad || 0}</td>
                        <td>$${(item.precio_unitario || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td>$${((item.cantidad || 0) * (item.precio_unitario || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td>${especificaciones}</td>
                    </tr>
                `;
            });
        } else {
            modalHtml += `
                <tr>
                    <td colspan="5">No se encontraron productos para esta venta</td>
                </tr>
            `;
        }

        modalHtml += `
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('modal-body').innerHTML = modalHtml;
        modal.style.display = 'block';
    }

    function exportToPDF() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            showError('Por favor genere un reporte primero');
            return;
        }

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm'
            });

            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Ventas - Pizzería', 140, 15, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.setFont('helvetica', 'normal');
            doc.text(`Del ${formatDate(startDate)} al ${formatDate(endDate)}`, 140, 22, { align: 'center' });

            doc.setFontSize(10);
            doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 275, 10, { align: 'right' });

            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text('Resumen de Ventas', 15, 35);

            doc.setFontSize(10);
            doc.setTextColor(60);

            const ventasTotales = document.querySelector('.total-sales .amount')?.textContent || '$0.00';
            const periodo = document.querySelector('.total-sales .period')?.textContent || '';
            const masVendido = document.querySelector('.best-seller .product')?.textContent || 'N/A';
            const cantidadMasVendido = document.querySelector('.best-seller .amount')?.textContent || '0 unidades';
            const menosVendido = document.querySelector('.worst-seller .product')?.textContent || 'N/A';
            const cantidadMenosVendido = document.querySelector('.worst-seller .amount')?.textContent || '0 unidades';

            doc.text(`• Ventas totales: ${ventasTotales} (${periodo})`, 20, 45);
            doc.text(`• Producto más vendido: ${masVendido} (${cantidadMasVendido})`, 20, 50);
            doc.text(`• Producto menos vendido: ${menosVendido} (${cantidadMenosVendido})`, 20, 55);

            const productosData = [];
            document.querySelectorAll('#products-table-body tr').forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 6) {
                    productosData.push([
                        cols[0].textContent,
                        cols[1].textContent,
                        cols[2].textContent,
                        cols[3].textContent,
                        cols[4].textContent,
                        cols[5].textContent
                    ]);
                }
            });

            if (productosData.length > 0) {
                doc.autoTable({
                    startY: 75,
                    head: [['#', 'Producto', 'Vendidos', 'Ingresos', '% del Total', 'Disponibles']],
                    body: productosData,
                    headStyles: {
                        fillColor: [248, 87, 166],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                        fillColor: [240, 240, 240]
                    },
                    margin: { left: 15 }
                });
            }

            const ventasData = [];
            document.querySelectorAll('#sales-table-body tr').forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 6) {
                    ventasData.push([
                        cols[0].textContent,
                        cols[1].textContent,
                        cols[2].textContent,
                        cols[3].textContent,
                        cols[4].textContent,
                        cols[5].textContent
                    ]);
                }
            });

            if (ventasData.length > 0) {
                doc.addPage();
                doc.setFontSize(14);
                doc.text('Detalle de Ventas', 15, 20);

                doc.autoTable({
                    startY: 25,
                    head: [['ID', 'Fecha', 'Tipo', 'Método Pago', 'Total']],
                    body: ventasData,
                    headStyles: {
                        fillColor: [24, 24, 177],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    columnStyles: {
                        0: { cellWidth: 20 },
                        1: { cellWidth: 30 },
                        5: { cellWidth: 25 }
                    },
                    alternateRowStyles: {
                        fillColor: [240, 240, 240]
                    },
                    margin: { left: 15 }
                });
            }

            const chartCanvas = document.getElementById('productsChart');
            if (chartCanvas) {
                try {
                    const chartImage = chartCanvas.toDataURL('./IMAGES/LOGO.png');
                    doc.addPage();
                    doc.setFontSize(14);
                    doc.text('Distribución de Ventas por Producto', 15, 20);
                    doc.addImage(chartImage, 'PNG', 15, 30, 260, 130);
                } catch (e) {
                    console.error('Error al agregar gráfico al PDF:', e);
                }
            }

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(`Página ${i} de ${pageCount}`, 140, 200, { align: 'center' });
                doc.text('© Pizzería', 275, 200, { align: 'right' });
            }

            doc.save(`Reporte_Ventas_${formatDate(startDate)}_a_${formatDate(endDate)}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            showError('Error al generar el PDF');
        }
    }

    function updateCharts(data) {
        if (productsChart) productsChart.destroy();
        if (salesTrendChart) salesTrendChart.destroy();

        const productsCtx = document.getElementById('productsChart')?.getContext('2d');
        if (productsCtx && data.productos && data.productos.length > 0) {
            productsChart = new Chart(productsCtx, {
                type: 'pie',
                data: {
                    labels: data.productos.map(p => p.producto || 'Producto ' + p.id_producto),
                    datasets: [{
                        data: data.productos.map(p => p.vendidos || 0),
                        backgroundColor: [
                            '#f857a6', '#730abe', '#1818b1', '#28a745', '#ffc107', '#17a2b8'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} unidades (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        const trendCtx = document.getElementById('salesTrendChart')?.getContext('2d');
        if (trendCtx) {
            salesTrendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas mensuales',
                        data: [12000, 19000, 15000, 18000, 22000, 24000],
                        borderColor: '#f857a6',
                        backgroundColor: 'rgba(248, 87, 166, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    function formatDateTime(datetimeStr) {
        if (!datetimeStr) return '';
        try {
            const date = new Date(datetimeStr);
            return date.toLocaleString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return datetimeStr;
        }
    }
});