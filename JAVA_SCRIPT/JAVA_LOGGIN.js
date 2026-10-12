document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validación básica
        if (username.trim() === '' || password.trim() === '') {
            showError('Por favor complete todos los campos');
            return;
        }

        // Aquí iría la lógica de autenticación real
        authenticateUser(username, password);
    });

    function authenticateUser(username, password) {
        // Simulación de autenticación (en un caso real, sería una petición al servidor)
        console.log('Autenticando usuario:', username);

        // Mostrar efecto de carga
        const btnLogin = document.querySelector('.btn-login');
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';
        btnLogin.disabled = true;


    }

    function showError(message) {
        // Eliminar notificaciones previas
        const oldAlert = document.querySelector('.alert');
        if (oldAlert) oldAlert.remove();

        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        loginForm.insertBefore(alert, loginForm.firstChild);

        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        // Eliminar después de 5 segundos
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    }

    function showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        loginForm.insertBefore(alert, loginForm.firstChild);

        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
    }
});

// Añadir estilos dinámicos para las alertas
const style = document.createElement('style');
style.textContent = `
    .alert {
        position: relative;
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    }
    
    .alert.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .alert i {
        margin-right: 10px;
        font-size: 1.2rem;
    }
    
    .alert.error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #f5c6cb;
    }
    
    .alert.success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #c3e6cb;
    }
`;
document.head.appendChild(style);