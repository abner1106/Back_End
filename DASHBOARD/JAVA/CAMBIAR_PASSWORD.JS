document.addEventListener('DOMContentLoaded', function () {
    // Fermin: este script se usa en la pantalla de cambio de contraseña
    // (PASSWORD.PHP). Da retroalimentación inmediata y valida el formulario
    // antes de enviarlo; PASSWORD.PHP repite las reglas en el servidor.
    const nuevaPassword = document.getElementById('nueva_password');
    const confirmarPassword = document.getElementById('confirmar_password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const form = document.getElementById('form-cambiar-password');

    // Elementos de requisitos
    const reqNumeros = document.getElementById('req-numeros');
    const reqLetras = document.getElementById('req-letras');
    const reqLongitud = document.getElementById('req-longitud');

    // Al escribir, actualiza los requisitos y el indicador de fortaleza sin
    // esperar el envío, para que el usuario sepa qué debe corregir.
    nuevaPassword.addEventListener('input', function () {
        const password = this.value;
        validarFortaleza(password);
        verificarCoincidencia();
    });

    // Compara ambos campos mientras se escribe para avisar si no coinciden.
    confirmarPassword.addEventListener('input', verificarCoincidencia);

    function validarFortaleza(password) {
        const numeros = (password.match(/[0-9]/g) || []).length;
        const letras = (password.match(/[a-zA-Z]/g) || []).length;
        const longitud = password.length;

        // Actualizar requisitos visualmente
        reqNumeros.className = numeros >= 5 ? 'valid' : '';
        reqLetras.className = letras >= 1 ? 'valid' : '';
        reqLongitud.className = longitud >= 6 ? 'valid' : '';

        // Calcular fortaleza
        let strength = 0;
        let color = '';
        let text = '';

        if (numeros >= 5 && letras >= 1 && longitud >= 6) {
            strength = 100;
            color = '#2ECC71';
            text = 'Contraseña fuerte';
        } else if (numeros >= 3 && letras >= 1 && longitud >= 6) {
            strength = 66;
            color = '#E67E22';
            text = 'Contraseña media';
        } else if (longitud > 0) {
            strength = 33;
            color = '#C0392B';
            text = 'Contraseña débil';
        } else {
            strength = 0;
            color = '#e0e0e0';
            text = 'Fortaleza de la contraseña';
        }

        strengthFill.style.width = strength + '%';
        strengthFill.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    function verificarCoincidencia() {
        const password1 = nuevaPassword.value;
        const password2 = confirmarPassword.value;

        if (password2 === '') {
            passwordMatch.textContent = '';
            passwordMatch.style.color = '';
        } else if (password1 === password2) {
            passwordMatch.textContent = '✓ Las contraseñas coinciden';
            passwordMatch.style.color = '#2ECC71';
        } else {
            passwordMatch.textContent = '✗ Las contraseñas no coinciden';
            passwordMatch.style.color = '#C0392B';
        }
    }

    // Bloquea el envío si la contraseña no cumple los requisitos o no coincide
    // con su confirmación. Esta validación mejora la experiencia, pero no
    // sustituye la validación del backend en PASSWORD.PHP.
    form.addEventListener('submit', function (e) {
        const password = nuevaPassword.value;
        const confirmar = confirmarPassword.value;

        if (!validarFortalezaFinal(password)) {
            e.preventDefault();
            alert('La contraseña no cumple con los requisitos mínimos de seguridad.');
            return;
        }

        if (password !== confirmar) {
            e.preventDefault();
            alert('Las contraseñas no coinciden.');
            return;
        }
    });

    function validarFortalezaFinal(password) {
        const numeros = (password.match(/[0-9]/g) || []).length;
        const letras = (password.match(/[a-zA-Z]/g) || []).length;
        return numeros >= 5 && letras >= 1 && password.length >= 6;
    }
});