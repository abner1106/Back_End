const products = {
    pizzas: [
        { name: "Pizza Grande 2x1", price: 280, image: "IMAGES/ALIMENTOS/GRANDE.PNG", maxSpecialties: 4, isCombo: true },
        { name: "Pizza Mediana 2x1", price: 210, image: "IMAGES/ALIMENTOS/MEDIANA.PNG", maxSpecialties: 4, isCombo: true },
        { name: "Pizza Familiar 2x1", price: 390, image: "IMAGES/ALIMENTOS/FAMILIAR.PNG", maxSpecialties: 4, isCombo: true },
        { name: "Pizza Chica 2x1", price: 180, image: "IMAGES/ALIMENTOS/CHICO.PNG", maxSpecialties: 4, isCombo: true },
        { name: "Pizza Grande Sola", price: 140, image: "IMAGES/ALIMENTOS/GRANDE.PNG", maxSpecialties: 2 },
        { name: "Pizza Chica Sola", price: 100, image: "IMAGES/ALIMENTOS/CHICO.PNG", maxSpecialties: 1 },
        { name: "Pizza Mediana Sola", price: 120, image: "IMAGES/ALIMENTOS/MEDIANA.PNG", maxSpecialties: 2 },
        { name: "Pizza Familiar Sola", price: 120, image: "IMAGES/ALIMENTOS/FAMILIAR.PNG", maxSpecialties: 2 },
        { name: "Pizza Cuadrada", price: 350, image: "IMAGES/ALIMENTOS/CUADRADA.PNG", maxSpecialties: 4 }
    ],
    hamburguesas: [
        { name: "Hamburguesa Hawaiana", price: 90, image: "IMAGES/ALIMENTOS/HAWAIANA.AVIF" },
        { name: "Hamburguesa Doble Carne", price: 100, image: "IMAGES/ALIMENTOS/DOBLE.jpg" },
        { name: "Hamburguesa Sencilla", price: 70, image: "IMAGES/ALIMENTOS/SENCILLA.jpg" },
        { name: "Hamburguesa de Lujo", price: 120, image: "IMAGES/ALIMENTOS/LUJO.jpg" },
        { name: "Hamburguesa de Pollo", price: 120, image: "IMAGES/ALIMENTOS/POLLO.jpg" },
        { name: "Hamburguesa de Suprema", price: 120, image: "IMAGES/ALIMENTOS/SUPREMA.jpg" }
    ],

    DinoDrinks: [
        { name: "Extincion", image: "IMAGES/BEBIDAS/Xtincion.png", price: 140 },
        { name: "Tequila Rex", image: "IMAGES/BEBIDAS/TEQUILA_REX.png", price: 140 },
        { name: "Branquio sandia", image: "IMAGES/BEBIDAS/BRANQUIO_SANDIA.png", price: 140 },
        { name: "Ponche Saurio", image: "IMAGES/BEBIDAS/PONCHE_SAURIO.png", price: 140 },
        { name: "Azulito Saurio", image: "IMAGES/BEBIDAS/AZULITO_SAURIO.png", price: 130 }
    ],


    bebidas: [
        { name: "Coca-Cola 1.5L", image: "IMAGES/BEBIDAS/COCALATA.png", price: 28 },
        { name: "Coca-Cola 600ml", image: "IMAGES/BEBIDAS/COCA600.png", price: 20 },
        { name: "Fanta Naranja 600ml", image: "IMAGES/BEBIDAS/FANTA600.png", price: 20 },
        { name: "Frapé de Oreo", image: "IMAGES/BEBIDAS/FRAPEOREO.png", price: 38 },
        { name: "Smuttis Caramel", image: "IMAGES/BEBIDAS/CARAMEL.png", price: 36 },
        { name: "Chocomilk", image: "IMAGES/BEBIDAS/CHOCOMILK.png", price: 22 },
        { name: "Coca-Cola 3L", image: "IMAGES/BEBIDAS/COCA.png", price: 38 },
        { name: "Limonada Mineral", image: "IMAGES/BEBIDAS/LIMONADAMINERAL.png", price: 30 },
        { name: "Agua Natural (Botella)", image: "IMAGES/BEBIDAS/BOTELLAAGUA.png", price: 16 },
        { name: "Sidral Mundet 600ml", image: "IMAGES/BEBIDAS/SIDRAL.png", price: 20 },
        { name: "Agua de Jamaica", image: "IMAGES/BEBIDAS/JAMAICA.png", price: 25 },
        { name: "Agua de Horchata", image: "IMAGES/BEBIDAS/HORCHATA.png", price: 25 },
        { name: "Frape Cafe", image: "IMAGES/BEBIDAS/FRAPE_CAFE.png", price: 38 },
        { name: "Frape Mazapan", image: "IMAGES/BEBIDAS/FRAPE_MAZAPAN.png", price: 38 },
        { name: "Frape Fresa", image: "IMAGES/BEBIDAS/FRAPE_FRESA.png", price: 38 },
        { name: "Mezcalina Jamaica", image: "IMAGES/BEBIDAS/MEZCALINA_JAMAICA.png", price: 36 },
        { name: "Mezcalina Maracuya", image: "IMAGES/BEBIDAS/MEZCALINA_MARACUYA.png", price: 36 },
        { name: "Afogato", image: "IMAGES/BEBIDAS/AFOGATO.png", price: 30 },
        { name: "Licuado Platano", image: "IMAGES/BEBIDAS/LICUADO_PLATANO.png", price: 28 },
        { name: "Cafe Negro", image: "IMAGES/BEBIDAS/CAFE_NEGRO.png", price: 20 },
        { name: "Mezcalina Mango", image: "IMAGES/BEBIDAS/MEZCALINA_MANGO.png", price: 36 }
    ],

    azulitos: [
        { name: "pati azululito", image: "IMAGES/BEBIDAS/PATI_AZULITO.PNG", PRICE: 80 },
        { name: "Sky azulito", price: 110, image: "IMAGES/BEBIDAS/SKY_AZULITO.PNG" },
        { name: "Azulito frost", image: "IMAGES/BEBIDAS/AZULITO_FROST.png", price: 120 },
        { name: "Azulito Saurio", image: "IMAGES/BEBIDAS/AZULITO_SAURIO.png", price: 130 },
        { name: "Azulito Smash", image: "IMAGES/BEBIDAS/AZULITO_SMASH.png", price: 130 }
    ],


    extras: [
        { name: "Alitas BBQ (12pz)", price: 180, image: "img/alitas-bbq.jpg" },
        { name: "Alitas Mango Habanero (12pz)", price: 180, image: "img/alitas-mango.jpg" },
        { name: "Papas a la Francesa Chicas", price: 30, image: "img/papas-chicas.jpg" },
        { name: "Papas a la Francesa Grandes", price: 50, image: "img/papas-grandes.jpg" }
    ]
};

const pizzaSpecialties = {
    "Pizza Mexicana": { ingredients: ["chorizo", "frijoles", "jalapeños", "cebolla", "jitomate"], extraPrice: 20 },
    "Pizza Hawaiana": { ingredients: ["jamon", "piña"], extraPrice: 15 },
    "Pizza Cuatro Quesos": { ingredients: ["queso1", "queso2", "queso3", "queso4"], extraPrice: 25 },
    "Pizza Pepperoni": { ingredients: ["pepperoni"], extraPrice: 10 },
    "Pizza Vegetariana": { ingredients: ["champiñones", "pimientos", "cebolla", "aceitunas"], extraPrice: 18 },
    "Pizza Carnes": { ingredients: ["pepperoni", "jamon", "carne", "tocino"], extraPrice: 22 }
};

// Precios de ingredientes adicionales
const ingredients = {
    pepperoni: 15,
    jamon: 12,
    champiñones: 10,
    pimientos: 8,
    cebolla: 8,
    aceitunas: 10,
    piña: 12,
    carne: 18,
    tocino: 15,
    chorizo: 15,
    frijoles: 10,
    jalapeños: 8,
    jitomate: 8,
    queso1: 10,
    queso2: 10,
    queso3: 10,
    queso4: 10
};

// Variables globales
let currentSale = [];
let tipoPagoSeleccionado = 'efectivo'; // Valor por defecto
const saleItemPrototype = new window.SaleItemPrototype();

// Elementos del DOM
const categorySelect = document.getElementById('category');
const productSelect = document.getElementById('product');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const specialPriceInput = document.getElementById('special-price');
const specialRequestsInput = document.getElementById('special-requests');
const addProductBtn = document.getElementById('add-product');
const salesTableBody = document.getElementById('sales-table-body');
const totalAmount = document.getElementById('total-amount');
const clearSaleBtn = document.getElementById('clear-sale');
const completeSaleBtn = document.getElementById('complete-sale');
const productImg = document.getElementById('product-img');
const modal = document.getElementById('ticket-modal');
const closeBtn = document.querySelector('.close');
const printBtn = document.getElementById('print-ticket');
const ticketContent = document.getElementById('ticket-content');
const ingredientGroup = document.getElementById('ingredient-group');
const ingredientsSelect = document.getElementById('ingredients');
const ingredientsHelp = document.getElementById('ingredients-help');
const specialtyGroup = document.getElementById('specialty-group');
const specialtiesHelp = document.getElementById('specialties-help');
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
const cashContainer = document.getElementById('cash-container');
const cashReceivedInput = document.getElementById('cash-received');
const cashChangeDisplay = document.getElementById('cash-change');

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
categorySelect.addEventListener('change', loadProducts);
productSelect.addEventListener('change', showProductDetails);
addProductBtn.addEventListener('click', addProductToSale);
clearSaleBtn.addEventListener('click', clearSale);
completeSaleBtn.addEventListener('click', completeSale);
closeBtn.addEventListener('click', () => modal.style.display = 'none');
printBtn.addEventListener('click', printTicket);
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', updatePaymentMethod);
});
cashReceivedInput.addEventListener('input', calculateChange);

// Funciones principales
function initApp() {
    loadCategories();
    addProductBtn.disabled = true;
    updatePaymentMethod();
}

function loadCategories() {
    // Ya están cargadas en el HTML
}

function loadProducts() {
    const category = categorySelect.value;
    productSelect.disabled = !category;
    ingredientGroup.style.display = 'none';
    specialtyGroup.style.display = 'none';

    productSelect.innerHTML = '<option value="">Seleccione producto</option>';

    if (category) {
        products[category].forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            option.dataset.price = product.price;
            option.dataset.image = product.image || 'IMAGES/MICHE.JPG';

            if (product.isCombo) {
                option.dataset.isCombo = true;
            }

            if (product.maxSpecialties) {
                option.dataset.maxSpecialties = product.maxSpecialties;
            }

            productSelect.appendChild(option);
        });
    }

    priceInput.value = '';
    productImg.src = 'IMAGES/MICHE.JPG';
    addProductBtn.disabled = true;
}

function showProductDetails() {
    const selectedOption = productSelect.options[productSelect.selectedIndex];

    if (selectedOption.value) {
        priceInput.value = '$' + selectedOption.dataset.price;
        productImg.src = selectedOption.dataset.image;
        addProductBtn.disabled = false;

        if (categorySelect.value === 'pizzas') {
            specialtyGroup.style.display = 'block';
            ingredientGroup.style.display = 'block';

            document.querySelectorAll('.specialty-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            document.querySelectorAll('.ingredient-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            const maxSpecialties = parseInt(selectedOption.dataset.maxSpecialties) || 0;
            specialtiesHelp.textContent = maxSpecialties > 0 ?
                `Seleccione hasta ${maxSpecialties} especialidades` :
                'No se permiten especialidades';

            document.querySelectorAll('.specialty-checkbox').forEach(checkbox => {
                checkbox.disabled = maxSpecialties === 0;
            });

            ingredientsHelp.textContent = selectedOption.dataset.isCombo ?
                'Puede agregar ingredientes extras adicionales' :
                'Solo disponible si no selecciona especialidades';
        } else {
            specialtyGroup.style.display = 'none';
            ingredientGroup.style.display = 'none';
        }
    } else {
        priceInput.value = '';
        productImg.src = 'IMAGES/MICHE.JPG';
        addProductBtn.disabled = true;
        specialtyGroup.style.display = 'none';
        ingredientGroup.style.display = 'none';
    }
}

function addProductToSale() {
    const productName = productSelect.value;
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    let price = parseFloat(selectedOption.dataset.price) || 0;
    const quantity = parseInt(quantityInput.value) || 1;
    const specialRequests = specialRequestsInput.value;
    let specialPrice = parseFloat(specialPriceInput.value) || price;

    let specialtiesText = '';
    let selectedIngredients = [];
    let extraCost = 0;
    let displayName = productName;

    if (categorySelect.value === 'pizzas') {
        const selectedSpecialties = Array.from(document.querySelectorAll('.specialty-checkbox:checked'))
            .map(checkbox => checkbox.value);

        const maxSpecialties = parseInt(selectedOption.dataset.maxSpecialties) || 0;
        if (selectedSpecialties.length > maxSpecialties) {
            alert(`Esta pizza permite máximo ${maxSpecialties} especialidades`);
            return;
        }

        selectedSpecialties.forEach(specialty => {
            const specialtyData = pizzaSpecialties[specialty];
            if (specialtyData) {
                selectedIngredients = [...selectedIngredients, ...specialtyData.ingredients];
                const checkbox = document.querySelector(`.specialty-checkbox[value="${specialty}"]`);
                extraCost += parseFloat(checkbox.dataset.price) || 0;
            }
        });

        if (selectedOption.dataset.isCombo || selectedSpecialties.length === 0) {
            const extraIngredients = Array.from(document.querySelectorAll('.ingredient-checkbox:checked'))
                .map(checkbox => checkbox.value);

            extraIngredients.forEach(ing => {
                const checkbox = document.querySelector(`.ingredient-checkbox[value="${ing}"]`);
                extraCost += parseFloat(checkbox.dataset.price) || 0;
                selectedIngredients.push(ing);
            });

            if (extraIngredients.length > 0) {
                specialtiesText += selectedSpecialties.length > 0 ? ', ' : ' (';
                specialtiesText += `Extra: ${extraIngredients.join(', ')}`;
            }
        }

        if (selectedSpecialties.length > 0) {
            specialtiesText = ` (${selectedSpecialties.join(', ')}${specialtiesText})`;
        } else if (specialtiesText) {
            specialtiesText = ` (${specialtiesText})`;
        }

        price += extraCost;
        specialPrice = parseFloat(specialPriceInput.value) || price;
    }

    const subtotal = specialPrice * quantity;

    if (specialtiesText) {
        displayName += specialtiesText;
    }

    if (specialRequests) {
        displayName += ` [${specialRequests}]`;
    }

    currentSale.push(saleItemPrototype.clone({
        name: displayName,
        price: specialPrice,
        quantity: quantity,
        subtotal: subtotal,
        originalName: productName,
        ingredients: selectedIngredients,
        specialRequests: specialRequests
    }));

    updateSalesTable();
    calculateTotal();

    // === CÓDIGO AGREGADO PARA LIMPIAR CAMPOS Y MOSTRAR NOTIFICACIÓN ===
    specialPriceInput.value = '';
    quantityInput.value = '1';
    specialRequestsInput.value = '';

    // Limpiar checkboxes
    document.querySelectorAll('.specialty-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll('.ingredient-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    // === NUEVO: RESETEAR A ESTADO INICIAL ===
    categorySelect.value = '';
    productSelect.innerHTML = '<option value="">Seleccione producto</option>';
    productSelect.disabled = true;
    priceInput.value = '';
    productImg.src = 'IMAGES/MICHE.JPG';
    addProductBtn.disabled = true;
    ingredientGroup.style.display = 'none';
    specialtyGroup.style.display = 'none';

    // Mostrar notificación de producto agregado
    showNotification('Producto agregado correctamente');
    // === FIN DEL CÓDIGO AGREGADO ===
}

// Función para mostrar notificaciones temporales
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Remover después de 2 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

function updateSalesTable() {
    salesTableBody.innerHTML = '';

    currentSale.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>$${product.subtotal.toFixed(2)}</td>
            <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
        `;

        salesTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            currentSale.splice(index, 1);
            updateSalesTable();
            calculateTotal();
        });
    });
}

function calculateTotal() {
    const total = currentSale.reduce((sum, product) => sum + product.subtotal, 0);
    totalAmount.textContent = '$' + total.toFixed(2);
    calculateChange();
}

function clearSale() {
    if (confirm('¿Está seguro que desea limpiar la venta actual?')) {
        currentSale = [];
        updateSalesTable();
        calculateTotal();

        categorySelect.value = '';
        productSelect.innerHTML = '<option value="">Seleccione producto</option>';
        productSelect.disabled = true;
        priceInput.value = '';
        quantityInput.value = '1';
        specialPriceInput.value = '';
        specialRequestsInput.value = '';
        productImg.src = 'IMAGES/MICHE.PNG';
        addProductBtn.disabled = true;
        ingredientGroup.style.display = 'none';
        specialtyGroup.style.display = 'none';

        document.querySelectorAll('.specialty-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        document.querySelectorAll('.ingredient-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        document.querySelector('input[name="payment-method"][value="efectivo"]').checked = true;
        cashReceivedInput.value = '';
        updatePaymentMethod();
    }
}

async function completeSale() {
    if (currentSale.length === 0) {
        alert('No hay productos en la venta');
        return;
    }

    const paymentMethodRadio = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodRadio) {
        alert('Debe seleccionar un método de pago');
        return;
    }

    const paymentMethod = paymentMethodRadio.value;
    const total = currentSale.reduce((sum, product) => sum + product.subtotal, 0);

    if (paymentMethod === 'efectivo') {
        const cashReceived = parseFloat(cashReceivedInput.value) || 0;
        if (cashReceived < total) {
            alert(`El efectivo recibido ($${cashReceived.toFixed(2)}) es menor al total ($${total.toFixed(2)})`);
            return;
        }
    }

    completeSaleBtn.disabled = true;
    completeSaleBtn.textContent = "Procesando...";

    try {
        // El Builder valida y ensambla el formato que espera GUARDAR_VENTAS.php.
        const ventaBuilder = new window.VentaBuilder()
            .setEmpleado(2) // Debería ser dinámico (usuario logueado)
            .setCliente(
                document.getElementById('cliente_nombre')?.value || 'Cliente no identificado',
                document.getElementById('telefono-cliente')?.value || null,
                document.getElementById('direccion-cliente')?.value || null
            )
            .setTotal(total)
            .setMetodoPago(paymentMethod);

        currentSale.forEach(producto => {
            ventaBuilder.addProducto({
                nombre: producto.originalName,
                cantidad: producto.quantity,
                precio: producto.price,
                especialidades: producto.ingredients.join(', ') || null,
                observaciones: producto.specialRequests || null
            });
        });
        const ventaData = ventaBuilder.build();

        const response = await fetch('./PHP/GUARDAR_VENTAS.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData)
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al guardar la venta');
        }

        generateTicket(paymentMethod);
        modal.style.display = 'block';
        clearSale();
        alert(`Venta #${data.id_venta} registrada con éxito!`);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error al procesar venta: ${error.message}`);
    } finally {
        completeSaleBtn.disabled = false;
        completeSaleBtn.textContent = "Realizar Venta";
    }
}

function generateTicket(paymentMethod) {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const total = currentSale.reduce((sum, product) => sum + product.subtotal, 0);
    let paymentInfo = '';

    if (paymentMethod === 'efectivo') {
        const cashReceived = parseFloat(cashReceivedInput.value) || 0;
        const change = cashReceived - total;
        paymentInfo = `
            <p><strong>Método de pago:</strong> Efectivo</p>
            <p><strong>Efectivo recibido:</strong> $${cashReceived.toFixed(2)}</p>
            <p><strong>Cambio:</strong> $${change.toFixed(2)}</p>
        `;
    } else {
        paymentInfo = `<p><strong>Método de pago:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>`;
    }

    let ticketHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h2 style="margin: 5px 0;">Miches y Pizzeria</h2>
            <p style="margin: 5px 0;">Sistema de Ventas</p>
            <p style="margin: 5px 0;">${dateStr} ${timeStr}</p>
        </div>
        <table style="width: 100%; margin-bottom: 15px;">
            <thead>
                <tr>
                    <th style="text-align: left; border-bottom: 1px solid #000;">Producto</th>
                    <th style="text-align: left; border-bottom: 1px solid #000;">Cant.</th>
                    <th style="text-align: left; border-bottom: 1px solid #000;">Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    currentSale.forEach(product => {
        ticketHTML += `
            <tr>
                <td style="padding: 5px 0;">${product.name}</td>
                <td style="padding: 5px 0;">${product.quantity}</td>
                <td style="padding: 5px 0;">$${product.subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    ticketHTML += `
            </tbody>
        </table>
        <div style="margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px;">
            <p style="font-weight: bold; margin: 5px 0;">Total: $${total.toFixed(2)}</p>
            ${paymentInfo}
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <p style="margin: 5px 0;">¡Gracias por su compra!</p>
            <p style="margin: 5px 0;">Vuelva pronto</p>
        </div>
    `;

    ticketContent.innerHTML = ticketHTML;
}

function printTicket() {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><head><title>Ticket de Venta</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { text-align: left; border-bottom: 1px solid #000; padding: 5px 0; }
        td { padding: 5px 0; }
        .total { font-weight: bold; }
        .center { text-align: center; }
        .top-border { border-top: 1px dashed #000; padding-top: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(ticketContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function updatePaymentMethod() {
    const metodo = document.querySelector('input[name="payment-method"]:checked');
    if (!metodo) return;

    tipoPagoSeleccionado = metodo.value;

    cashReceivedInput.disabled = tipoPagoSeleccionado !== 'efectivo';
    cashContainer.style.display = tipoPagoSeleccionado === 'efectivo' ? 'block' : 'none';

    if (tipoPagoSeleccionado === 'efectivo') {
        calculateChange();
    }
}

function calculateChange() {
    if (currentSale.length === 0) return;

    const total = currentSale.reduce((sum, product) => sum + product.subtotal, 0);
    const cashReceived = parseFloat(cashReceivedInput.value) || 0;
    const change = cashReceived - total;

    if (change >= 0) {
        cashChangeDisplay.textContent = `Cambio: $${change.toFixed(2)}`;
    } else {
        cashChangeDisplay.textContent = `Faltan: $${Math.abs(change).toFixed(2)}`;
    }
}

// fuenciones para mostrar la venta de manera emergente abuelo

// Insertar estilos solo una vez
if (!document.getElementById('sale-popup-styles')) {
    const styles = document.createElement('style');
    styles.id = 'sale-popup-styles';
    styles.textContent = `
        @keyframes popupFadeIn {
            from { opacity: 0; transform: translate(-50%, -60%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes popupFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .sale-popup-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(3px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            animation: popupFadeIn 0.3s ease;
        }

        .sale-popup {
            background: #fff;
            padding: 25px 30px;
            border-radius: 15px;
            text-align: center;
            width: 320px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.25);
            animation: popupFadeIn 0.4s ease;
        }

        .sale-popup h3 {
            margin: 0 0 10px;
            font-size: 22px;
            font-weight: bold;
            color: #2e7d32;
        }

        .sale-popup .icon {
            font-size: 55px;
            margin-bottom: 5px;
            color: #4CAF50;
        }

        .sale-popup button {
            margin-top: 15px;
            padding: 10px 18px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            transition: 0.2s;
        }

        .sale-popup button:hover {
            background: #43a047;
        }
    `;
    document.head.appendChild(styles);
}

function showSalePopup(idVenta, total) {
    // Crear overlay
    const overlay = document.createElement("div");
    overlay.className = "sale-popup-overlay";

    // Crear ventana
    const popup = document.createElement("div");
    popup.className = "sale-popup";

    popup.innerHTML = `
        <div class="icon">✔️</div>
        <h3>Venta Registrada</h3>
        <p style="margin: 8px 0;"><strong>ID Venta:</strong> ${idVenta}</p>
        <p style="margin: 8px 0;"><strong>Total:</strong> $${total.toFixed(2)}</p>

        <button id="close-sale-popup">Cerrar</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Cerrar manual
    popup.querySelector("#close-sale-popup").onclick = () => closePopup();
    overlay.onclick = (e) => {
        if (e.target === overlay) closePopup();
    };

    // Auto-cerrar en 3.5 sec
    setTimeout(() => closePopup(), 3500);

    function closePopup() {
        overlay.style.animation = "popupFadeOut 0.3s forwards";
        popup.style.animation = "popupFadeOut 0.3s forwards";

        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
        }, 300);
    }
}
