(() => {
    const scriptUrl = document.currentScript?.src;

    if (!scriptUrl) {
        window.location.replace('PHP/ERRORPERMISOS.PHP');
        return;
    }

    const script = new URL(scriptUrl);
    const employeeUrl = new URL('../PHP/OBTENER_EMPLEADO.PHP', script);
    const errorUrl = new URL('../PHP/ERRORPERMISOS.PHP', script);
    let checking = false;
    let redirected = false;

    document.documentElement.classList.add('session-checking');
    const style = document.createElement('style');
    style.textContent = 'html.session-checking body { visibility: hidden; }';
    document.head.appendChild(style);

    async function checkSession() {
        if (checking || redirected) {
            return;
        }

        checking = true;

        try {
            const response = await fetch(employeeUrl, {
                credentials: 'same-origin',
                cache: 'no-store'
            });
            const employee = await response.json();

            if (!response.ok || employee.success !== true) {
                redirected = true;
                window.location.replace(errorUrl);
                return;
            }

            document.documentElement.classList.remove('session-checking');
        } catch {
            redirected = true;
            window.location.replace(errorUrl);
        } finally {
            checking = false;
        }
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.documentElement.classList.add('session-checking');
            checkSession();
        }
    });

    checkSession();
    window.setInterval(checkSession, 30000);
})();
