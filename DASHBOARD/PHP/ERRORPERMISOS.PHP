<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Denegado - Pizzería Las Miches</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../IMAGES/FONDO.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }

        .error-container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
            width: 90%;
        }

        .cat-container {
            position: relative;
            margin-bottom: 30px;
        }

        .cat-image {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid rgba(255, 255, 255, 0.3);
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .cat-ears {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 40px;
        }

        .ear {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 25px solid #ff6b6b;
        }

        .ear-left {
            left: 20px;
            transform: rotate(-15deg);
        }

        .ear-right {
            right: 20px;
            transform: rotate(15deg);
        }

        .error-title {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #ff6b6b;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            animation: pulse 2s infinite;
        }

        .error-message {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.6;
            color: #e0e0e0;
        }

        .login-btn {
            background: linear-gradient(45deg, #ff6b6b, #ff4757);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
            position: relative;
            overflow: hidden;
        }

        .login-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
            background: linear-gradient(45deg, #ff4757, #ff3742);
        }

        .login-btn:active {
            transform: translateY(-1px);
        }

        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .login-btn:hover::before {
            left: 100%;
        }

        .paw-prints {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .paw {
            position: absolute;
            font-size: 24px;
            opacity: 0.3;
            animation: pawMove 4s linear infinite;
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0px);
            }

            50% {
                transform: translateY(-15px);
            }
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.05);
            }
        }

        @keyframes pawMove {
            0% {
                transform: translateX(-100px) rotate(0deg);
                opacity: 0;
            }

            10% {
                opacity: 0.3;
            }

            90% {
                opacity: 0.3;
            }

            100% {
                transform: translateX(calc(100vw + 100px)) rotate(360deg);
                opacity: 0;
            }
        }

        .blink {
            animation: blink 3s infinite;
        }

        @keyframes blink {

            0%,
            90%,
            100% {
                opacity: 1;
            }

            95% {
                opacity: 0.3;
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .error-container {
                padding: 30px 20px;
            }

            .cat-image {
                width: 150px;
                height: 150px;
            }

            .error-title {
                font-size: 2rem;
            }

            .error-message {
                font-size: 1rem;
            }
        }
    </style>
</head>

<body>
    <div class="paw-prints" id="pawPrints"></div>

    <div class="error-container">
        <div class="cat-container">
            <div class="cat-ears">
                <div class="ear ear-left"></div>
                <div class="ear ear-right"></div>
            </div>
            <img src="../IMAGES/GATO.PNG" alt="Gato triste" class="cat-image blink">
        </div>

        <h1 class="error-title">¡Ups! 🐾</h1>
        <p class="error-message">
            No tienes permisos para acceder a esta área.<br>
            Solo los administradores pueden gestionar empleados.
        </p>
        <a href="http://localhost/PIZZERIA_MICHES/PHP/LOGIN_AD.PHP" class="login-btn">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión como Admin
        </a>
    </div>

    <script>
        // Crear huellas de patitas animadas
        function createPawPrints() {
            const pawPrintsContainer = document.getElementById('pawPrints');
            const pawCount = 8;

            for (let i = 0; i < pawCount; i++) {
                const paw = document.createElement('div');
                paw.innerHTML = '🐾';
                paw.className = 'paw';

                // Posición aleatoria
                const top = Math.random() * 100;
                const left = -100;

                paw.style.top = top + 'vh';
                paw.style.left = left + 'px';
                paw.style.animationDelay = (Math.random() * 10) + 's';
                paw.style.animationDuration = (15 + Math.random() * 10) + 's';

                pawPrintsContainer.appendChild(paw);
            }
        }

        // Efecto de escritura para el título
        function typeWriterEffect() {
            const title = document.querySelector('.error-title');
            const originalText = title.textContent;
            title.textContent = '';

            let i = 0;
            const typing = setInterval(() => {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 100);
        }

        // Efecto de parpadeo aleatorio para el gato
        function randomBlink() {
            const catImage = document.querySelector('.cat-image');
            setInterval(() => {
                if (Math.random() > 0.7) {
                    catImage.style.animation = 'none';
                    setTimeout(() => {
                        catImage.style.animation = 'blink 3s infinite, float 3s ease-in-out infinite';
                    }, 100);
                }
            }, 3000);
        }

        // Inicializar efectos cuando la página cargue
        document.addEventListener('DOMContentLoaded', function () {
            createPawPrints();
            typeWriterEffect();
            randomBlink();

            // Efecto de sonido al hacer hover en el botón (opcional)
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.addEventListener('mouseenter', function () {
                // Podrías agregar un sonido aquí si quieres
                console.log('🔊 Miauuu!');
            });
        });

        // Efecto de partículas al hacer clic
        document.addEventListener('click', function (e) {
            createClickEffect(e.clientX, e.clientY);
        });

        function createClickEffect(x, y) {
            const effect = document.createElement('div');
            effect.style.position = 'fixed';
            effect.style.left = x + 'px';
            effect.style.top = y + 'px';
            effect.style.width = '10px';
            effect.style.height = '10px';
            effect.style.borderRadius = '50%';
            effect.style.background = 'rgba(255, 107, 107, 0.6)';
            effect.style.pointerEvents = 'none';
            effect.style.zIndex = '9999';
            effect.style.animation = 'clickEffect 0.6s ease-out forwards';

            document.body.appendChild(effect);

            // Agregar la animación CSS dinámicamente
            if (!document.querySelector('#clickEffectStyle')) {
                const style = document.createElement('style');
                style.id = 'clickEffectStyle';
                style.textContent = `
                    @keyframes clickEffect {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(3);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                effect.remove();
            }, 600);
        }
    </script>

    <!-- Font Awesome para el ícono -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</body>

</html>