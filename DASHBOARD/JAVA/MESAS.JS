class GestorMesas {
    constructor() {
        this.mesas = [];
        this.mesaSeleccionada = null;
        this.init();
    }

    init() {
        this.cargarMesasDesdeStorage();
        this.renderizarMesas();
        this.actualizarContadores();
        this.configurarEventListeners();
    }

    cargarMesasDesdeStorage() {
        const mesasGuardadas = localStorage.getItem('mesasRestaurante');

        if (mesasGuardadas) {
            this.mesas = JSON.parse(mesasGuardadas);
            // Convertir timestamps de string a Date objects
            this.mesas.forEach(mesa => {
                if (mesa.timestamp) {
                    mesa.timestamp = new Date(mesa.timestamp);
                }
            });
        } else {
            this.generarMesasIniciales();
            this.guardarMesasEnStorage();
        }
    }

    generarMesasIniciales() {
        // Crear 12 mesas inicialmente disponibles
        this.mesas = Array.from({ length: 12 }, (_, i) => ({
            numero: i + 1,
            ocupada: false,
            timestamp: null,
            tiempoOcupacion: null
        }));
    }

    guardarMesasEnStorage() {
        localStorage.setItem('mesasRestaurante', JSON.stringify(this.mesas));
    }

    renderizarMesas() {
        const grid = document.getElementById('mesas-grid');
        grid.innerHTML = '';

        this.mesas.forEach(mesa => {
            const mesaElement = this.crearElementoMesa(mesa);
            grid.appendChild(mesaElement);
        });
    }

    crearElementoMesa(mesa) {
        const div = document.createElement('div');
        div.className = `mesa-item ${mesa.ocupada ? 'ocupada' : ''}`;
        div.setAttribute('data-mesa', mesa.numero);

        const estado = mesa.ocupada ? 'Ocupada' : 'Disponible';
        const estadoClass = mesa.ocupada ? 'estado-ocupada' : 'estado-disponible';
        const icono = mesa.ocupada ? 'fa-utensils' : 'fa-chair';

        // Calcular tiempo transcurrido si está ocupada
        const tiempoInfo = mesa.ocupada && mesa.timestamp ?
            this.calcularTiempoOcupacion(mesa.timestamp) : '';

        div.innerHTML = `
            <div class="mesa-icon">
                <i class="fas ${icono}"></i>
            </div>
            <div class="mesa-numero">Mesa ${mesa.numero}</div>
            <div class="mesa-estado ${estadoClass}">${estado}</div>
            ${tiempoInfo ? `<div class="mesa-tiempo">${tiempoInfo}</div>` : ''}
        `;

        // Agregar evento click dependiendo del estado
        if (mesa.ocupada) {
            div.addEventListener('click', () => this.seleccionarLiberarMesa(mesa.numero));
        } else {
            div.addEventListener('click', () => this.seleccionarOcuparMesa(mesa.numero));
        }

        return div;
    }

    calcularTiempoOcupacion(timestamp) {
        const ahora = new Date();
        const diferencia = ahora - timestamp;
        const minutos = Math.floor(diferencia / (1000 * 60));
        const horas = Math.floor(minutos / 60);

        if (horas > 0) {
            return `${horas}h ${minutos % 60}m`;
        } else {
            return `${minutos}m`;
        }
    }

    seleccionarOcuparMesa(numeroMesa) {
        this.mesaSeleccionada = numeroMesa;
        this.mostrarModalOcupar(numeroMesa);
    }

    seleccionarLiberarMesa(numeroMesa) {
        this.mesaSeleccionada = numeroMesa;
        this.mostrarModalLiberar(numeroMesa);
    }

    mostrarModalOcupar(numeroMesa) {
        const modal = document.getElementById('modalOcupar');
        const texto = document.getElementById('textoConfirmacionOcupar');

        texto.textContent = `¿Está seguro que desea marcar la Mesa ${numeroMesa} como ocupada?`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    mostrarModalLiberar(numeroMesa) {
        const modal = document.getElementById('modalLiberar');
        const texto = document.getElementById('textoConfirmacionLiberar');

        texto.textContent = `¿Está seguro que desea liberar la Mesa ${numeroMesa}?`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    cerrarModalOcupar() {
        const modal = document.getElementById('modalOcupar');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.mesaSeleccionada = null;
    }

    cerrarModalLiberar() {
        const modal = document.getElementById('modalLiberar');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.mesaSeleccionada = null;
    }

    confirmarOcuparMesa() {
        if (this.mesaSeleccionada) {
            this.ocuparMesa(this.mesaSeleccionada);
            this.cerrarModalOcupar();
        }
    }

    confirmarLiberarMesa() {
        if (this.mesaSeleccionada) {
            this.liberarMesa(this.mesaSeleccionada);
            this.cerrarModalLiberar();
        }
    }

    ocuparMesa(numeroMesa) {
        const mesaIndex = this.mesas.findIndex(m => m.numero === numeroMesa);
        if (mesaIndex !== -1) {
            this.mesas[mesaIndex].ocupada = true;
            this.mesas[mesaIndex].timestamp = new Date();
            this.guardarMesasEnStorage();
            this.renderizarMesas();
            this.actualizarContadores();
            this.mostrarNotificacion(`Mesa ${numeroMesa} marcada como ocupada`, 'success');
        }
    }

    liberarMesa(numeroMesa) {
        const mesaIndex = this.mesas.findIndex(m => m.numero === numeroMesa);
        if (mesaIndex !== -1) {
            this.mesas[mesaIndex].ocupada = false;
            this.mesas[mesaIndex].timestamp = null;
            this.guardarMesasEnStorage();
            this.renderizarMesas();
            this.actualizarContadores();
            this.mostrarNotificacion(`Mesa ${numeroMesa} liberada`, 'success');
        }
    }

    liberarTodasMesas() {
        this.mesas.forEach(mesa => {
            mesa.ocupada = false;
            mesa.timestamp = null;
        });
        this.guardarMesasEnStorage();
        this.renderizarMesas();
        this.actualizarContadores();
        this.mostrarNotificacion('Todas las mesas han sido liberadas', 'success');
    }

    ocuparTodasMesas() {
        this.mesas.forEach(mesa => {
            mesa.ocupada = true;
            mesa.timestamp = new Date();
        });
        this.guardarMesasEnStorage();
        this.renderizarMesas();
        this.actualizarContadores();
        this.mostrarNotificacion('Todas las mesas han sido ocupadas', 'warning');
    }

    actualizarContadores() {
        const total = this.mesas.length;
        const ocupadas = this.mesas.filter(m => m.ocupada).length;
        const disponibles = total - ocupadas;

        document.getElementById('total-mesas').textContent = total;
        document.getElementById('mesas-ocupadas').textContent = ocupadas;
        document.getElementById('mesas-disponibles').textContent = disponibles;
    }

    configurarEventListeners() {
        // Cerrar modales al hacer clic fuera
        const modals = ['modalOcupar', 'modalLiberar'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modalId === 'modalOcupar') {
                        this.cerrarModalOcupar();
                    } else {
                        this.cerrarModalLiberar();
                    }
                }
            });
        });

        // Cerrar modales con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModalOcupar();
                this.cerrarModalLiberar();
            }
        });

        // Actualizar tiempos cada minuto
        setInterval(() => {
            this.actualizarTiemposOcupacion();
        }, 60000);
    }

    actualizarTiemposOcupacion() {
        const mesasOcupadas = this.mesas.filter(mesa => mesa.ocupada);
        if (mesasOcupadas.length > 0) {
            this.renderizarMesas();
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <div class="notificacion-content">
                <i class="fas fa-${this.obtenerIconoNotificacion(tipo)}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.obtenerColorNotificacion(tipo)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 4000);
    }

    obtenerIconoNotificacion(tipo) {
        const iconos = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return iconos[tipo] || 'info-circle';
    }

    obtenerColorNotificacion(tipo) {
        const colores = {
            'success': '#690a0a',
            'warning': '#E67E22',
            'info': '#2F4F4F'
        };
        return colores[tipo] || '#2F4F4F';
    }

    // Método para resetear todas las mesas (útil para debugging)
    resetearMesas() {
        localStorage.removeItem('mesasRestaurante');
        this.generarMesasIniciales();
        this.guardarMesasEnStorage();
        this.renderizarMesas();
        this.actualizarContadores();
        this.mostrarNotificacion('Mesas reseteadas a estado inicial', 'info');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gestorMesas = new GestorMesas();
});

// Funciones globales para los botones
function liberarTodasMesas() {
    if (window.gestorMesas) {
        window.gestorMesas.liberarTodasMesas();
    }
}

function ocuparTodasMesas() {
    if (window.gestorMesas) {
        window.gestorMesas.ocuparTodasMesas();
    }
}

function cerrarModalOcupar() {
    if (window.gestorMesas) {
        window.gestorMesas.cerrarModalOcupar();
    }
}

function cerrarModalLiberar() {
    if (window.gestorMesas) {
        window.gestorMesas.cerrarModalLiberar();
    }
}

function confirmarOcuparMesa() {
    if (window.gestorMesas) {
        window.gestorMesas.confirmarOcuparMesa();
    }
}

function confirmarLiberarMesa() {
    if (window.gestorMesas) {
        window.gestorMesas.confirmarLiberarMesa();
    }
}

// Agregar estilos CSS para animaciones y nuevos elementos
const estiloAnimaciones = document.createElement('style');
estiloAnimaciones.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notificacion-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .mesa-tiempo {
        font-size: 0.8rem;
        color: var(--dark);
        margin-top: 5px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.7);
        padding: 2px 8px;
        border-radius: 10px;
        display: inline-block;
    }
`;
document.head.appendChild(estiloAnimaciones);