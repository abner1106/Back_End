(() => {
    'use strict';

    const apiUrl = 'PHP/API_PEDIDOS_DOMICILIO.php';
    const list = document.getElementById('orders-list');
    const message = document.getElementById('orders-message');
    const subscribers = new Set();
    let loading = false;

    class PedidoSubject {
        suscribir(observer) {
            subscribers.add(observer);
        }

        notificar(pedidos) {
            subscribers.forEach(observer => observer.actualizar(pedidos));
        }
    }

    class PedidoListObserver {
        actualizar(pedidos) {
            renderOrders(pedidos);
        }
    }

    // Chiquilín, Observer centraliza el redibujado cuando llegan pedidos nuevos
    // o cambia un estado; evita repetir renderizado en cada botón o respuesta.
    // La consulta periódica sincroniza otras sesiones sin recargar la página.
    const pedidos = new PedidoSubject();
    pedidos.suscribir(new PedidoListObserver());

    class ComandoCancelarPedido {
        constructor(idVenta, motivo) {
            this.idVenta = idVenta;
            this.motivo = motivo;
        }

        async ejecutar() {
            return enviarCambio({
                id_venta: this.idVenta,
                estado: 'cancelado',
                motivo: this.motivo
            });
        }
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    function setMessage(text, isError = false) {
        message.textContent = text;
        message.classList.toggle('is-error', isError);
    }

    async function loadOrders() {
        if (loading) return;
        loading = true;
        try {
            const response = await fetch(apiUrl, { credentials: 'same-origin', cache: 'no-store' });
            const data = await response.json();
            if (!response.ok || data.success !== true) {
                throw new Error(data.message || 'No se pudieron cargar los pedidos.');
            }
            pedidos.notificar(data.pedidos);
            setMessage(data.pedidos.length ? `Pedidos: ${data.pedidos.length}` : 'No hay pedidos a domicilio.');
        } catch (error) {
            setMessage(error.message, true);
        } finally {
            loading = false;
        }
    }

    function renderOrders(records) {
        if (!records.length) {
            list.innerHTML = '<div class="empty-state">Todavía no hay pedidos a domicilio.</div>';
            return;
        }

        list.innerHTML = records.map(order => {
            const status = escapeHtml(order.estado_pedido);
            let actions = '';
            if (order.estado_pedido === 'pendiente') {
                actions = `
                    <button class="button button-primary button-small" data-action="entregado" data-id="${escapeHtml(order.id_venta)}">Marcar entregado</button>
                    <button class="button button-danger button-small" data-action="cancelar" data-id="${escapeHtml(order.id_venta)}">Cancelar</button>`;
            } else if (order.estado_pedido === 'entregado') {
                actions = `
                    <label class="payment-choice">Cobrar con
                        <select data-payment aria-label="Método de pago del pedido ${escapeHtml(order.id_venta)}">
                            <option value="efectivo" ${order.metodo_pago === 'efectivo' ? 'selected' : ''}>Efectivo</option>
                            <option value="tarjeta" ${order.metodo_pago === 'tarjeta' ? 'selected' : ''}>Tarjeta</option>
                            <option value="transferencia" ${order.metodo_pago === 'transferencia' ? 'selected' : ''}>Transferencia</option>
                        </select>
                    </label>
                    <button class="button button-primary button-small" data-action="cobrado" data-id="${escapeHtml(order.id_venta)}">Marcar cobrado</button>`;
            }

            const cancelReason = order.motivo_cancelacion
                ? `<p class="cancel-reason"><strong>Motivo:</strong> ${escapeHtml(order.motivo_cancelacion)}</p>`
                : '';
            const paymentLabel = order.estado_pedido === 'cobrado'
                ? escapeHtml(order.metodo_pago)
                : 'Pendiente de confirmar';

            return `
                <article class="order-card">
                    <div class="order-heading">
                        <div>
                            <p class="order-number">Pedido #${escapeHtml(order.id_venta)}</p>
                            <h3>${escapeHtml(order.cliente_nombre)}</h3>
                        </div>
                        <span class="status status-${status}">${status}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Teléfono:</strong> ${escapeHtml(order.telefono || 'Sin teléfono')}</p>
                        <p><strong>Dirección:</strong> ${escapeHtml(order.direccion || 'Sin dirección')}</p>
                        <p><strong>Fecha:</strong> ${escapeHtml(order.fecha)}</p>
                        <p><strong>Pago:</strong> ${paymentLabel}</p>
                        <p class="order-total">$${Number(order.total).toFixed(2)}</p>
                        ${cancelReason}
                    </div>
                    <div class="order-actions">${actions || '<span class="order-number">Sin acciones disponibles</span>'}</div>
                </article>`;
        }).join('');
    }

    async function enviarCambio(payload) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.success !== true) {
            throw new Error(data.message || 'No se pudo actualizar el pedido.');
        }
        await loadOrders();
    }

    list.addEventListener('click', async event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        button.disabled = true;
        try {
            if (button.dataset.action === 'cancelar') {
                const motivo = window.prompt('Indica el motivo de cancelación:');
                if (motivo === null) return;
                if (!motivo.trim()) {
                    throw new Error('El motivo de cancelación es obligatorio.');
                }
                // Chiquilín, Command empaqueta pedido y motivo en una operación;
                // así la cancelación no puede ejecutarse sin su dato de auditoría.
                await new ComandoCancelarPedido(Number(button.dataset.id), motivo.trim()).ejecutar();
            } else {
                const payload = {
                    id_venta: Number(button.dataset.id),
                    estado: button.dataset.action
                };
                if (button.dataset.action === 'cobrado') {
                    payload.metodo_pago = button.closest('.order-card').querySelector('[data-payment]').value;
                }
                await enviarCambio(payload);
            }
            setMessage('Estado del pedido actualizado.');
        } catch (error) {
            setMessage(error.message, true);
        } finally {
            button.disabled = false;
        }
    });

    document.getElementById('refresh-orders').addEventListener('click', loadOrders);
    loadOrders();
    window.setInterval(loadOrders, 15000);
})();
