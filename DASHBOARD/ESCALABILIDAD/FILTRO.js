// Datos de productos
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
    bebidas: [
        { name: "Coca-Cola 1.5L", price: 28, image: "IMAGES/BEBIDAS/COCALATA.png" },
        { name: "Coca-Cola 600ml", price: 20, image: "IMAGES/BEBIDAS/COCA600.png" },
        { name: "Fanta Naranja 600ml", price: 20, image: "IMAGES/BEBIDAS/FANTA600.png" },
        { name: "Frapé de Oreo", price: 38, image: "IMAGES/BEBIDAS/FRAPEOREO.png" },
        { name: "Smuttis Caramel", price: 36, image: "IMAGES/BEBIDAS/CARAMEL.png" },
        { name: "Chocomilk", price: 22, image: "IMAGES/BEBIDAS/CHOCOMILK.png" },
        { name: "Coca-Cola 3L", price: 38, image: "IMAGES/BEBIDAS/COCA.png" },
        { name: "Limonada Mineral", price: 30, image: "IMAGES/BEBIDAS/LIMONADAMINERAL.png" },
        { name: "Agua Natural (Botella)", price: 16, image: "IMAGES/BEBIDAS/BOTELLAAGUA.png" },
        { name: "Sidral Mundet 600ml", price: 20, image: "IMAGES/BEBIDAS/SIDRAL.png" },
        { name: "Agua de Jamaica", price: 25, image: "IMAGES/BEBIDAS/JAMAICA.png" },
        { name: "Agua de Horchata", price: 25, image: "IMAGES/BEBIDAS/HORCHATA.png" }
    ],
    cafes: [
        { name: "Frape Cafe", price: 38, image: "IMAGES/BEBIDAS/FRAPE_CAFE.png" },
        { name: "Cafe Negro", price: 20, image: "IMAGES/BEBIDAS/CAFE_NEGRO.png" },
        { name: "Afogato", price: 30, image: "IMAGES/BEBIDAS/AFOGATO.png" }
    ],
    frapes: [
        { name: "Frape Mazapan", price: 38, image: "IMAGES/BEBIDAS/FRAPE_MAZAPAN.png" },
        { name: "Frape Fresa", price: 38, image: "IMAGES/BEBIDAS/FRAPE_FRESA.png" },
        { name: "Licuado Platano", price: 28, image: "IMAGES/BEBIDAS/LICUADO_PLATANO.png" }
    ],
    mezcales: [
        { name: "Mezcalina Jamaica", price: 36, image: "IMAGES/BEBIDAS/MEZCALINA_JAMAICA.png" },
        { name: "Mezcalina Maracuya", price: 36, image: "IMAGES/BEBIDAS/MEZCALINA_MARACUYA.png" },
        { name: "Mezcalina Mango", price: 36, image: "IMAGES/BEBIDAS/MEZCALINA_MANGO.png" }
    ],
    micheladas: [
        { name: "Michelada Clásica", price: 55, image: "img/michelada.jpg" },
        { name: "Michelada Cubana", price: 65, image: "img/michelada-cubana.jpg" }
    ],
    postres: [
        { name: "Pastel de Chocolate", price: 45, image: "img/pastel-chocolate.jpg" },
        { name: "Flan Napolitano", price: 35, image: "img/flan.jpg" }
    ],
    extras: [
        { name: "Alitas BBQ (12pz)", price: 180, image: "img/alitas-bbq.jpg" },
        { name: "Alitas Mango Habanero (12pz)", price: 180, image: "img/alitas-mango.jpg" },
        { name: "Papas a la Francesa Chicas", price: 30, image: "img/papas-chicas.jpg" },
        { name: "Papas a la Francesa Grandes", price: 50, image: "img/papas-grandes.jpg" }
    ]
};

// Especialidades e ingredientes para pizzas
const pizzaSpecialties = {
    "Pizza Mexicana": { ingredients: ["chorizo", "frijoles", "jalapeños", "cebolla", "jitomate"], extraPrice: 20 },
    "Pizza Hawaiana": { ingredients: ["jamon", "piña"], extraPrice: 15 },
    "Pizza Cuatro Quesos": { ingredients: ["queso1", "queso2", "queso3", "queso4"], extraPrice: 25 },
    "Pizza Pepperoni": { ingredients: ["pepperoni"], extraPrice: 10 },
    "Pizza Vegetariana": { ingredients: ["champiñones", "pimientos", "cebolla", "aceitunas"], extraPrice: 18 },
    "Pizza Carnes": { ingredients: ["pepperoni", "jamon", "carne", "tocino"], extraPrice: 22 }
};

const ingredients = {
    pepperoni: { name: "Pepperoni", price: 15 },
    jamon: { name: "Jamón", price: 12 },
    champiñones: { name: "Champiñones", price: 10 },
    pimientos: { name: "Pimientos", price: 8 },
    cebolla: { name: "Cebolla", price: 8 },
    aceitunas: { name: "Aceitunas", price: 10 },
    piña: { name: "Piña", price: 12 },
    carne: { name: "Carne", price: 18 },
    tocino: { name: "Tocino", price: 15 },
    chorizo: { name: "Chorizo", price: 15 },
    frijoles: { name: "Frijoles", price: 10 },
    jalapeños: { name: "Jalapeños", price: 8 },
    jitomate: { name: "Jitomate", price: 8 },
    queso1: { name: "Queso Mozzarella", price: 10 },
    queso2: { name: "Queso Cheddar", price: 10 },
    queso3: { name: "Queso Parmesano", price: 10 },
    queso4: { name: "Queso Gouda", price: 10 }
};

// Variables globales
let currentSale = [];
let currentCategory = 'pizzas';
let currentProduct = null;
let currentSpecialties = [];
let currentIngredients = [];
let currentNotes = '';

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const productsContainer = document.getElementById('products-container');
    const saleItems = document.getElementById('sale-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const cashReceivedInput = document.getElementById('cash-received');
    const cashChangeElement = document.getElementById('cash-change');
    const cashSection = document.getElementById('cash-section');
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cancelSaleBtn = document.getElementById('cancel-sale');
    const completeSaleBtn = document.getElementById('complete-sale');
    const productModal = document.getElementById('product-modal');
    const ticketModal = document.getElementById('ticket-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const printBtn = document.getElementById('print-ticket');
    const ticketContent = document.getElementById('ticket-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const currentTimeElement = document.getElementById('current-time');
    const productNotes = document.getElementById('product-notes');
    const specialPriceInput = document.getElementById('special-price');
    const confirmProductBtn = document.getElementById('confirm-product');
    const cancelProductBtn = document.getElementById('cancel-product');
    const modalProductImage = document.getElementById('modal-product-image');
    const productModalTitle = document.getElementById('product-modal-title');
    const specialtiesContainer = document.getElementById('specialties-container');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const pizzaOptions = document.getElementById('pizza-options');

    // Event Listeners
    paymentOptions.forEach(option => {
        option.addEventListener('change', updatePaymentMethod);
    });
    cashReceivedInput.addEventListener('input', calculateChange);
    cancelSaleBtn.addEventListener('click', clearSale);
    completeSaleBtn.addEventListener('click', completeSale);
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            productModal.style.display = 'none';
            ticketModal.style.display = 'none';
        });
    });
    printBtn.addEventListener('click', printTicket);
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            loadProducts(currentCategory);
        });
    });
    confirmProductBtn.addEventListener('click', confirmProduct);
    cancelProductBtn.addEventListener('click', () => productModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.style.display = 'none';
        if (e.target === ticketModal) ticketModal.style.display = 'none';
    });

    // Funciones principales
    function initApp() {
        loadProducts(currentCategory);
        updateClock();
        setInterval(updateClock, 1000);
    }

    function updateClock() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString();
    }

    function loadProducts(category) {
        productsContainer.innerHTML = '';
        
        if (products[category]) {
            products[category].forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                    </div>
                `;
                
                productCard.addEventListener('click', () => selectProduct(product));
                productsContainer.appendChild(productCard);
            });
        }
    }

    function selectProduct(product) {
        currentProduct = product;
        currentSpecialties = [];
        currentIngredients = [];
        currentNotes = '';
        productNotes.value = '';
        specialPriceInput.value = '';
        
        productModalTitle.textContent = `Personalizar ${product.name}`;
        modalProductImage.src = product.image;
        modalProductImage.alt = product.name;
        
        // Mostrar opciones especiales para pizzas
        if (currentCategory === 'pizzas') {
            pizzaOptions.style.display = 'block';
            loadSpecialties();
            loadIngredients();
        } else {
            pizzaOptions.style.display = 'none';
        }
        
        productModal.style.display = 'flex';
    }

    function loadSpecialties() {
        specialtiesContainer.innerHTML = '';
        
        if (!currentProduct || !currentProduct.maxSpecialties) return;
        
        const maxSpecialties = currentProduct.maxSpecialties;
        
        Object.keys(pizzaSpecialties).forEach(specialty => {
            const specialtyItem = document.createElement('div');
            specialtyItem.className = 'specialty-item';
            specialtyItem.innerHTML = `
                <input type="checkbox" id="specialty-${specialty}" value="${specialty}" 
                       data-price="${pizzaSpecialties[specialty].extraPrice}">
                <div class="specialty-info">
                    <div class="specialty-name">${specialty} (+$${pizzaSpecialties[specialty].extraPrice})</div>
                    <div class="specialty-ingredients">${pizzaSpecialties[specialty].ingredients.join(', ')}</div>
                </div>
            `;
            
            const checkbox = specialtyItem.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (currentSpecialties.length >= maxSpecialties) {
                        e.target.checked = false;
                        alert(`Esta pizza permite máximo ${maxSpecialties} especialidades`);
                        return;
                    }
                    currentSpecialties.push({
                        name: specialty,
                        price: parseFloat(e.target.dataset.price),
                        ingredients: pizzaSpecialties[specialty].ingredients
                    });
                } else {
                    currentSpecialties = currentSpecialties.filter(s => s.name !== specialty);
                }
                
                updateIngredientsAvailability();
            });
            
            specialtiesContainer.appendChild(specialtyItem);
        });
    }

    function loadIngredients() {
        ingredientsContainer.innerHTML = '';
        
        Object.keys(ingredients).forEach(key => {
            const ingredient = ingredients[key];
            const ingredientItem = document.createElement('div');
            ingredientItem.className = 'ingredient-item';
            ingredientItem.innerHTML = `
                <input type="checkbox" id="ingredient-${key}" value="${key}" 
                       data-price="${ingredient.price}" ${currentSpecialties.length > 0 ? 'disabled' : ''}>
                <div class="ingredient-info">
                    <div class="ingredient-name">${ingredient.name} (+$${ingredient.price})</div>
                </div>
            `;
            
            const checkbox = ingredientItem.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    currentIngredients.push({
                        name: ingredient.name,
                        price: parseFloat(e.target.dataset.price)
                    });
                } else {
                    currentIngredients = currentIngredients.filter(i => i.name !== ingredient.name);
                }
            });
            
            ingredientsContainer.appendChild(ingredientItem);
        });
    }

    function updateIngredientsAvailability() {
        const ingredientCheckboxes = ingredientsContainer.querySelectorAll('input[type="checkbox"]');
        
        if (currentSpecialties.length > 0) {
            ingredientCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            currentIngredients = [];
        } else {
            ingredientCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    }

    function confirmProduct() {
        if (!currentProduct) return;
        
        currentNotes = productNotes.value.trim();
        const specialPrice = parseFloat(specialPriceInput.value) || currentProduct.price;
        
        // Calcular precio total con extras
        let price = specialPrice;
        let details = [];
        
        // Agregar especialidades
        currentSpecialties.forEach(specialty => {
            price += specialty.price;
            details.push(specialty.name);
        });
        
        // Agregar ingredientes extras (solo si no hay especialidades)
        if (currentSpecialties.length === 0) {
            currentIngredients.forEach(ingredient => {
                price += ingredient.price;
                details.push(`Extra ${ingredient.name}`);
            });
        }
        
        // Verificar si el producto ya está en la venta
        const existingItemIndex = currentSale.findIndex(item => 
            item.originalName === currentProduct.name && 
            JSON.stringify(item.details) === JSON.stringify(details) &&
            item.notes === currentNotes
        );
        
        if (existingItemIndex >= 0) {
            currentSale[existingItemIndex].quantity += 1;
            currentSale[existingItemIndex].total = currentSale[existingItemIndex].price * currentSale[existingItemIndex].quantity;
        } else {
            currentSale.push({
                name: currentProduct.name + (details.length > 0 ? ` (${details.join(', ')})` : ''),
                originalName: currentProduct.name,
                price: price,
                quantity: 1,
                total: price,
                details: details,
                notes: currentNotes,
                image: currentProduct.image
            });
        }
        
        updateSaleDisplay();
        productModal.style.display = 'none';
    }

    function updateSaleDisplay() {
        saleItems.innerHTML = '';
        
        if (currentSale.length === 0) {
            saleItems.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Agrega productos a la venta</p>
                    </td>
                </tr>
            `;
        } else {
            currentSale.forEach((item, index) => {
                const saleItem = document.createElement('tr');
                saleItem.innerHTML = `
                    <td>
                        ${item.name}
                        ${item.notes ? `<br><small>Nota: ${item.notes}</small>` : ''}
                    </td>
                    <td>
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        ${item.quantity}
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                    <td><button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button></td>
                `;
                
                saleItems.appendChild(saleItem);
            });
            
            // Agregar event listeners a los botones de cantidad y eliminar
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.closest('button').dataset.index;
                    const isPlus = e.target.classList.contains('plus');
                    updateQuantity(index, isPlus ? 1 : -1);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.closest('button').dataset.index;
                    currentSale.splice(index, 1);
                    updateSaleDisplay();
                });
            });
        }
        
        calculateTotals();
    }

    function updateQuantity(index, change) {
        const newQuantity = currentSale[index].quantity + change;
        
        if (newQuantity <= 0) {
            currentSale.splice(index, 1);
        } else {
            currentSale[index].quantity = newQuantity;
            currentSale[index].total = currentSale[index].price * newQuantity;
        }
        
        updateSaleDisplay();
    }

    function calculateTotals() {
        const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
        const tax = 0; // Sin IVA según tu requerimiento
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        calculateChange();
    }

    function updatePaymentMethod() {
        const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
        
        if (selectedMethod === 'efectivo') {
            cashSection.style.display = 'flex';
            cashReceivedInput.value = '';
            cashChangeElement.textContent = 'Cambio: $0.00';
        } else {
            cashSection.style.display = 'none';
        }
    }

    function calculateChange() {
        const total = parseFloat(totalElement.textContent.replace('$', '')) || 0;
        const cashReceived = parseFloat(cashReceivedInput.value) || 0;
        const change = cashReceived - total;
        
        if (change >= 0) {
            cashChangeElement.textContent = `Cambio: $${change.toFixed(2)}`;
        } else {
            cashChangeElement.textContent = `Faltan: $${Math.abs(change).toFixed(2)}`;
        }
    }

    function clearSale() {
        if (currentSale.length === 0 || confirm('¿Estás seguro de cancelar esta venta?')) {
            currentSale = [];
            updateSaleDisplay();
            document.getElementById('client-name').value = '';
            document.getElementById('client-phone').value = '';
            document.getElementById('client-address').value = '';
            document.querySelector('input[name="payment"][value="efectivo"]').checked = true;
            updatePaymentMethod();
        }
    }

    async function completeSale() {
        if (currentSale.length === 0) {
            alert('No hay productos en la venta');
            return;
        }
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const clientName = document.getElementById('client-name').value || 'Cliente no identificado';
        const clientPhone = document.getElementById('client-phone').value || 'Sin teléfono';
        const clientAddress = document.getElementById('client-address').value || '';
        const total = parseFloat(totalElement.textContent.replace('$', ''));
        
        if (paymentMethod === 'efectivo') {
            const cashReceived = parseFloat(cashReceivedInput.value) || 0;
            
            if (cashReceived < total) {
                alert(`El efectivo recibido ($${cashReceived.toFixed(2)}) es menor al total ($${total.toFixed(2)})`);
                return;
            }
        }
        
        completeSaleBtn.disabled = true;
        completeSaleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        try {
            // Simular envío a la base de datos
            await saveSaleToDatabase({
                clientName,
                clientPhone,
                clientAddress,
                paymentMethod,
                total,
                items: currentSale,
                cashReceived: paymentMethod === 'efectivo' ? parseFloat(cashReceivedInput.value) : 0
            });
            
            generateTicket(clientName, clientPhone, clientAddress, paymentMethod);
            ticketModal.style.display = 'flex';
            clearSale();
        } catch (error) {
            console.error('Error al guardar la venta:', error);
            alert('Error al guardar la venta: ' + error.message);
        } finally {
            completeSaleBtn.disabled = false;
            completeSaleBtn.innerHTML = '<i class="fas fa-check"></i> Registrar Venta';
        }
    }

    async function saveSaleToDatabase(saleData) {
        // Simulación de guardado en base de datos
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Venta guardada en BD:', saleData);
                resolve({ success: true, id: Math.floor(Math.random() * 10000) });
            }, 1000);
        });
    }

    function generateTicket(clientName, clientPhone, clientAddress, paymentMethod) {
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();
        const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal; // Sin IVA
        
        let paymentInfo = '';
        if (paymentMethod === 'efectivo') {
            const cashReceived = parseFloat(cashReceivedInput.value) || 0;
            const change = cashReceived - total;
            paymentInfo = `
                <p><strong>Efectivo recibido:</strong> $${cashReceived.toFixed(2)}</p>
                <p><strong>Cambio:</strong> $${change.toFixed(2)}</p>
            `;
        }
        
        let itemsHTML = '';
        currentSale.forEach(item => {
            itemsHTML += `
                <tr>
                    <td>${item.quantity} x ${item.name}</td>
                    <td>$${item.total.toFixed(2)}</td>
                </tr>
                ${item.notes ? `<tr><td colspan="2"><small>Nota: ${item.notes}</small></td></tr>` : ''}
            `;
        });
        
        ticketContent.innerHTML = `
            <div class="ticket-header">
                <h2>Pizzería</h2>
                <p>Sistema de Ventas</p>
                <p>${dateStr} ${timeStr}</p>
            </div>
            
            <div class="ticket-client-info">
                <p><strong>Cliente:</strong> ${clientName}</p>
                <p><strong>Teléfono:</strong> ${clientPhone}</p>
                ${clientAddress ? `<p><strong>Dirección:</strong> ${clientAddress}</p>` : ''}
            </div>
            
            <table class="ticket-items">
                ${itemsHTML}
            </table>
            
            <div class="ticket-totals">
                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
            
            <div class="ticket-payment">
                <p><strong>Método de pago:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
                ${paymentInfo}
            </div>
            
            <div class="ticket-footer">
                <p>¡Gracias por su compra!</p>
            </div>
        `;
    }

    function printTicket() {
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write('<html><head><title>Ticket de Venta</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 15px; font-size: 14px; }
            h2 { font-size: 18px; margin: 5px 0; }
            p { margin: 3px 0; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 3px 0; }
            .ticket-header { text-align: center; margin-bottom: 10px; }
            .ticket-footer { text-align: center; margin-top: 10px; }
            .ticket-totals { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
            .ticket-payment { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
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

    // Iniciar la aplicación
    initApp();
});