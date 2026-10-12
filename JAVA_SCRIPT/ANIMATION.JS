document.addEventListener("DOMContentLoaded", () => {

    const cervezin = document.getElementById("cervezin");
    const balon = document.getElementById("balon");

    // Chiquilín: Object Pool guarda partículas terminadas para reutilizarlas
    // en el siguiente clic y reducir la creación constante de nodos del DOM.
    class ConfettiPool {
        constructor(maxRetained = 30) {
            this.maxRetained = maxRetained;
            this.available = [];
            this.active = new Set();
        }

        acquire() {
            const particle = this.available.pop() || document.createElement("div");
            this.active.add(particle);
            return particle;
        }

        release(particle) {
            if (!this.active.delete(particle)) {
                return;
            }

            particle.remove();
            particle.className = "";
            particle.removeAttribute("style");

            if (this.available.length < this.maxRetained) {
                this.available.push(particle);
            }
        }
    }

    const confettiPool = new ConfettiPool();

    /* ===========================
       ANIMACIONES AUTOMÁTICAS
    ============================*/
    const animacionesAuto = [
        () => {
            cervezin.style.transition = "transform 1s ease-in-out";
            cervezin.style.transform = "rotate(360deg)";
            setTimeout(() => cervezin.style.transform = "rotate(0deg)", 1000);
        },
        () => {
            cervezin.style.transition = "transform 0.5s ease-in-out";
            cervezin.style.transform = "scale(1.5)";
            setTimeout(() => cervezin.style.transform = "scale(1)", 500);
        },
        () => {
            cervezin.style.transition = "transform 0.6s ease";
            cervezin.style.transform = "translateY(-20px)";
            setTimeout(() => cervezin.style.transform = "translateY(0)", 600);
        }
    ];

    setInterval(() => {
        const anim = animacionesAuto[Math.floor(Math.random() * animacionesAuto.length)];
        anim();
    }, 3000);


    /* ===========================
       ANIMACIONES DE HOVER
    ============================*/
    const animacionesHover = [
        () => {
            cervezin.style.transition = "transform 0.8s ease";
            cervezin.style.transform = "rotateY(180deg)";
            setTimeout(() => cervezin.style.transform = "rotateY(0deg)", 800);
        },
        () => {
            cervezin.style.transition = "transform 0.1s";
            let i = 0;
            const shake = setInterval(() => {
                cervezin.style.transform = `translateX(${i % 2 === 0 ? 5 : -5}px)`;
                i++;
                if (i > 10) {
                    clearInterval(shake);
                    cervezin.style.transform = "translateX(0)";
                }
            }, 50);
        },
        () => {
            cervezin.style.transition = "transform 0.8s ease";
            cervezin.style.transform = "translateY(-40px)";
            setTimeout(() => cervezin.style.transform = "translateY(0)", 800);
        }
    ];

    cervezin.addEventListener("mouseenter", () => {
        const anim = animacionesHover[Math.floor(Math.random() * animacionesHover.length)];
        anim();
    });


   
    /* ===========================
   ANIMACIÓN MUNDIALISTA
===========================*/
    function dominadaMundial() {
        // Baja el balón
        balon.style.opacity = "1";
        balon.style.transition = "transform 1s ease-out, opacity 8s";
        balon.style.transform = "translateY(80px)";

        setTimeout(() => {
            balon.style.transition = "transform 0.4s ease-in-out";
            balon.style.transform = "translateY(40px)";

            setTimeout(() => {
                balon.style.transform = "translateY(60px)";

                // Cervezin brinca
                cervezin.style.transition = "transform 0.3s ease";
                cervezin.style.transform = "translateY(-20px)";

                setTimeout(() => cervezin.style.transform = "translateY(0)", 10000);

                // Quitar balón después de 8 segundos
                setTimeout(() => {
                    balon.style.opacity = "0";
                    balon.style.transform = "translateY(0)";
                }, 8000); // <-- aquí el cambio
            }, 400);
        }, 1000);
    }

    // Animación automática cada 10 segundos
    setInterval(dominadaMundial, 10000);


    /* ===========================
       CONFETI (AL DAR CLIC)
    ============================*/
    function tirarConfeti() {
        for (let i = 0; i < 30; i++) {
            const confeti = confettiPool.acquire();
            confeti.classList.add("confeti");

            confeti.style.left = Math.random() * 100 + "%";
            confeti.style.backgroundColor =
                ["#ff0", "#f00", "#0f0", "#0ff", "#f0f", "#ff8800"][Math.floor(Math.random() * 6)];

            document.body.appendChild(confeti);

            // Devuelve el nodo al pool cuando termina la animación CSS (2 s).
            setTimeout(() => confettiPool.release(confeti), 2200);
        }
    }


    /* ===========================
       CLICK EN EL LOGO = DOMINADA + CONFETI
    ============================*/
    cervezin.addEventListener("click", () => {
        dominadaMundial();   // primera acción
        tirarConfeti();      // fiesta mundialista 🎉
    });

});
