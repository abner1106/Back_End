(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    class LoginAnimationCreator {
        constructor(element) {
            this.element = element;
        }

        createAnimation() {
            throw new Error('Cada creador debe definir su animación.');
        }
    }

    class EntranceAnimationCreator extends LoginAnimationCreator {
        createAnimation() {
            return this.element.animate(
                [
                    { opacity: 0, transform: 'translateY(16px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                { duration: 450, easing: 'ease-out', fill: 'both' }
            );
        }
    }

    class ErrorAnimationCreator extends LoginAnimationCreator {
        createAnimation() {
            return this.element.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(0)' }
                ],
                { duration: 300, easing: 'ease-in-out' }
            );
        }
    }

    class FocusAnimationCreator extends LoginAnimationCreator {
        createAnimation() {
            return this.element.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.02)' },
                    { transform: 'scale(1)' }
                ],
                { duration: 180, easing: 'ease-out' }
            );
        }
    }

    const animationCreators = {
        entrance: EntranceAnimationCreator,
        error: ErrorAnimationCreator,
        focus: FocusAnimationCreator
    };

    class LoginAnimationFactory {
        static create(type, element) {
            const Creator = animationCreators[type];

            if (!Creator) {
                throw new RangeError(`Animación de login desconocida: ${type}`);
            }

            // Chiquilín: Factory Method permite agregar o cambiar efectos sin
            // meter sus fotogramas dentro del controlador del formulario.
            return new Creator(element).createAnimation();
        }
    }

    // Chiquilín: Singleton asegura que el login tenga un solo controlador y
    // evita registrar repetidamente sus eventos.
    class AdminLoginAnimationController {
        static instance;

        static getInstance() {
            if (!AdminLoginAnimationController.instance) {
                AdminLoginAnimationController.instance = new AdminLoginAnimationController();
            }

            return AdminLoginAnimationController.instance;
        }

        initialize() {
            if (this.initialized) {
                return;
            }
            this.initialized = true;

            const container = document.querySelector('.login-container');
            if (!container || reducedMotion) {
                return;
            }

            LoginAnimationFactory.create('entrance', container);

            const errorMessage = container.querySelector('.error-message');
            if (errorMessage && errorMessage.textContent.trim()) {
                LoginAnimationFactory.create('error', errorMessage);
            }

            container.querySelectorAll('.input-group input').forEach(input => {
                input.addEventListener('focus', () => {
                    LoginAnimationFactory.create('focus', input.closest('.input-group'));
                });
            });
        }
    }

    const initialize = () => AdminLoginAnimationController.getInstance().initialize();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();