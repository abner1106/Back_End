// Datos de productos (los que me proporcionaste)
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
        { name: "Agua de Horchata", image: "IMAGES/BEBIDAS/HORCHATA.png", price: 25 }
    ],
    extras: [
        { name: "Alitas BBQ (12pz)", price: 180, image: "IMAGES/ALIMENTOS/ALITAS_BBQ.jpg" },
        { name: "Alitas Mango Habanero (12pz)", price: 180, image: "IMAGES/ALIMENTOS/ALITAS_MANGO.jpg" },
        { name: "Papas a la Francesa Chicas", price: 30, image: "IMAGES/ALIMENTOS/PAPAS_CHICAS.jpg" },
        { name: "Papas a la Francesa Grandes", price: 50, image: "IMAGES/ALIMENTOS/PAPAS_GRANDES.jpg" }
    ]
};

// Especialidades de pizza con recargos
const pizzaSpecialties = {
    "Pizza Mexicana": { price: 20 },
    "Pizza Hawaiana": { price: 15 },
    "Pizza Cuatro Quesos": { price: 25 },
    "Pizza Pepperoni": { price: 10 }
};

// Precios de ingredientes adicionales
const ingredientsPrices = {
    "pepperoni": 15,
    "jamon": 12,
    "champiñones": 10,
    "pimientos": 8,
    "cebolla": 8,
    "aceitunas": 10
};

// Variables globales
let currentSale = [];
const saleItemPrototype = new window.SaleItemPrototype();
let currentEmployeeId = 1; // ID del empleado (debería venir de sesión)

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    document.getElementById('category').addEventListener('change', loadProducts);
    document.getElementById('product').addEventListener('change', showProductDetails);
    document.getElementById('add-product').addEventListener('click', addProductToSale);
    document.getElementById('clear-sale').addEventListener('click', clearSale);
    document.getElementById('complete-sale').addEventListener('click', completeSale);
    
    // Eventos para métodos de pago
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentUI);
    });
    document.getElementById('cash-received').addEventListener('input', calculateChange);
    
    // Cerrar modal
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('ticket-modal').style.display = 'none';
    });
    
    // Inicializar UI
    updatePaymentUI();
});

// Cargar productos según categoría seleccionada
function loadProducts() {
    const category = document.getElementById('category').value;
    const productSelect = document.getElementById('product');
    
    // Resetear
    productSelect.innerHTML = '<option value="">Seleccione producto</option>';
    productSelect.disabled = !category;
    document.getElementById('add-product').disabled = true;
    document.getElementById('price').value = '';
    document.getElementById('product-img').src = 'IMAGES/LOGOC.jpg';
    
    // Ocultar secciones de pizza
    document.getElementById('specialty-group').style.display = 'none';
    document.getElementById('ingredient-group').style.display = 'none';
    
    if (category) {
        // Llenar select con productos de la categoría
        products[category].forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            option.dataset.price = product.price;
            option.dataset.image = product.image;
            option.dataset.maxSpecialties = product.maxSpecialties || 0;
            option.dataset.isCombo = product.isCombo || false;
            productSelect.appendChild(option);
        });
    }
}

// Mostrar detalles del producto seleccionado
function showProductDetails() {
    const productSelect = document.getElementById('product');
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    
    if (selectedOption.value) {
        // Mostrar precio e imagen
        document.getElementById('price').value = '$' + selectedOption.dataset.price;
        document.getElementById('product-img').src = selectedOption.dataset.image;
        document.getElementById('add-product').disabled = false;
        
        // Mostrar opciones especiales para pizzas
        if (document.getElementById('category').value === 'pizzas') {
            const maxSpecialties = parseInt(selectedOption.dataset.maxSpecialties) || 0;
            const isCombo = selectedOption.dataset.isCombo === 'true';
            
            document.getElementById('specialty-group').style.display = 'block';
            document.getElementById('specialties-help').textContent = 
                `Puedes seleccionar hasta ${maxSpecialties} especialidades`;
            
            // Habilitar/deshabilitar checkboxes según máximo permitido
            document.querySelectorAll('.specialty-checkbox').forEach(checkbox => {
                checkbox.disabled = maxSpecialties === 0;
            });
            
            // Mostrar ingredientes extras solo si es combo o no hay especialidades seleccionadas
            document.getElementById('ingredient-group').style.display = 'block';
            document.getElementById('ingredients-help').textContent = isCombo ? 
                'Puedes agregar ingredientes extras adicionales' : 
                'Solo disponible si no seleccionas especialidades';
        } else {
            document.getElementById('specialty-group').style.display = 'none';
            document.getElementById('ingredient-group').style.display = 'none';
        }
    }
}

// Agregar producto a la venta actual
function addProductToSale() {
    const productSelect = document.getElementById('product');
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const category = document.getElementById('category').value;
    
    // Obtener datos básicos
    let productName = selectedOption.value;
    let basePrice = parseFloat(selectedOption.dataset.price);
    let quantity = parseInt(document.getElementById('quantity').value) || 1;
    let specialPrice = parseFloat(document.getElementById('special-price').value) || basePrice;
    let specialRequests = document.getElementById('special-requests').value;
    
    // Procesar especialidades e ingredientes para pizzas
    let specialties = [];
    let ingredients = [];
    let extraCost = 0;
    
    if (category === 'pizzas') {
        // Obtener especialidades seleccionadas
        document.querySelectorAll('.specialty-checkbox:checked').forEach(checkbox => {
            specialties.push(checkbox.value);
            extraCost += parseFloat(checkbox.dataset.price) || 0;
        });
        
        // Obtener ingredientes extras (solo si es combo o no hay especialidades)
        const isCombo = selectedOption.dataset.isCombo === 'true';
        if (isCombo || specialties.length === 0) {
            document.querySelectorAll('.ingredient-checkbox:checked').forEach(checkbox => {
                ingredients.push(checkbox.value);
                extraCost += ingredientsPrices[checkbox.value] || 0;
            });
        }
        
        // Aplicar precio especial si se especificó
        if (!document.getElementById('special-price').value) {
            specialPrice = basePrice + extraCost;
        }
    }
    
    // Construir nombre para mostrar en el ticket
    let displayName = productName;
    if (specialties.length > 0) {
        displayName += ` (${specialties.join(', ')})`;
    }
    if (ingredients.length > 0) {
        displayName += ` [Extra: ${ingredients.join(', ')}]`;
    }
    if (specialRequests) {
        displayName += ` [Nota: ${specialRequests}]`;
    }
    
    // Agregar a la venta actual
    currentSale.push(saleItemPrototype.clone({
        name: displayName,
        originalName: productName,
        price: specialPrice,
        quantity: quantity,
        subtotal: specialPrice * quantity,
        category: category,
        specialties: specialties,
        ingredients: ingredients,
        specialRequests: specialRequests
    }));
    
    // Actualizar UI
    updateSalesTable();
    calculateTotal();
    
    // Resetear controles
    document.getElementById('quantity').value = '1';
    document.getElementById('special-price').value = '';
    document.getElementById('special-requests').value = '';
    document.querySelectorAll('.specialty-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.ingredient-checkbox').forEach(cb => cb.checked = false);
}

// [El resto del código permanece igual hasta la función updateSalesTable]

// Actualizar tabla de venta
function updateSalesTable() {
    const tableBody = document.getElementById('sales-table-body');
    tableBody.innerHTML = '';
    
    const telefono = document.getElementById('telefono-cliente').value.trim() || 'No especificado';
    
    currentSale.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${telefono}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.subtotal.toFixed(2)}</td>
            <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            currentSale.splice(index, 1);
            updateSalesTable();
            calculateTotal();
        });
    });
}

// [El resto del código permanece igual]

// Calcular total de la venta
function calculateTotal() {
    const total = currentSale.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
    calculateChange();
}

// Calcular cambio
function calculateChange() {
    const total = currentSale.reduce((sum, item) => sum + item.subtotal, 0);
    const cashReceived = parseFloat(document.getElementById('cash-received').value) || 0;
    const change = cashReceived - total;
    
    if (change >= 0) {
        document.getElementById('cash-change').textContent = `Cambio: $${change.toFixed(2)}`;
    } else {
        document.getElementById('cash-change').textContent = `Faltan: $${Math.abs(change).toFixed(2)}`;
    }
}

// Actualizar UI de pago
function updatePaymentUI() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const cashContainer = document.getElementById('cash-container');
    
    if (paymentMethod === 'efectivo') {
        cashContainer.style.display = 'block';
        document.getElementById('cash-received').disabled = false;
        calculateChange();
    } else {
        cashContainer.style.display = 'none';
        document.getElementById('cash-received').disabled = true;
        document.getElementById('cash-change').textContent = 'Cambio: $0.00';
    }
}

// Limpiar venta
function clearSale() {
    if (confirm('¿Estás seguro de limpiar la venta actual?')) {
        currentSale = [];
        updateSalesTable();
        calculateTotal();
        
        // Resetear formulario
        document.getElementById('category').value = '';
        document.getElementById('product').innerHTML = '<option value="">Seleccione producto</option>';
        document.getElementById('product').disabled = true;
        document.getElementById('price').value = '';
        document.getElementById('quantity').value = '1';
        document.getElementById('special-price').value = '';
        document.getElementById('special-requests').value = '';
        document.getElementById('product-img').src = 'IMAGES/LOGOC.jpg';
        document.getElementById('add-product').disabled = true;
        document.getElementById('specialty-group').style.display = 'none';
        document.getElementById('ingredient-group').style.display = 'none';
        document.querySelectorAll('.specialty-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.ingredient-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('cliente_nombre').value = '';
        document.getElementById('telefono-cliente').value = '';
        document.getElementById('direccion-cliente').value = '';
        document.querySelector('input[name="payment-method"][value="efectivo"]').checked = true;
        document.getElementById('cash-received').value = '';
        updatePaymentUI();
    }
}

// Completar venta
async function completeSale() {
    // Validate sale items
    if (!currentSale || currentSale.length === 0) {
        showAlert('error', 'Venta vacía', 'No hay productos en la venta actual');
        return;
    }
    
    // Get customer data
    const customerData = {
        name: document.getElementById('cliente_nombre').value.trim(),
        phone: document.getElementById('telefono-cliente').value.trim(),
        address: document.getElementById('direccion-cliente').value.trim()
    };
    
    // Validate customer data
    if (!customerData.name || !customerData.phone || !customerData.address) {
        showAlert('error', 'Datos incompletos', 'Por favor complete todos los campos del cliente');
        return;
    }
    
    // Get payment data
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    const totalAmount = currentSale.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Validate cash payment
    if (paymentMethod === 'efectivo') {
        const cashReceived = parseFloat(document.getElementById('cash-received').value) || 0;
        if (cashReceived < totalAmount) {
            showAlert('error', 'Fondos insuficientes', 
                `Recibido: $${cashReceived.toFixed(2)}\nTotal: $${totalAmount.toFixed(2)}`);
            return;
        }
    }
    
    // Prepare UI
    const submitBtn = document.getElementById('complete-sale');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        // Prepare sale data
        // El mismo Builder construye el pedido a domicilio y valida los datos
        // obligatorios antes de que se realice la petición HTTP.
        const saleBuilder = new window.VentaBuilder()
            .setEmpleado(currentEmployeeId)
            .setTipoVenta('domicilio')
            .setCliente(customerData.name, customerData.phone, customerData.address)
            .setTotal(totalAmount)
            .setMetodoPago(paymentMethod);

        currentSale.forEach(item => {
            saleBuilder.addProducto({
                nombre: item.originalName,
                categoria: item.category,
                cantidad: item.quantity,
                precio: item.price
            });
        });
        const saleData = saleBuilder.build();
        
        // API endpoint - usa la ruta correcta a tu script PHP
        const apiUrl = 'DOMICILIO.php';
        
        // Send request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(saleData)
        });
        
        // Verificar si la respuesta es JSON válido
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('Respuesta no válida:', responseText);
            throw new Error('La respuesta del servidor no es válida. Por favor verifica el servidor.');
        }
        
        if (!response.ok || !responseData.success) {
            throw new Error(responseData.message || 'Error al procesar la venta');
        }
        
        // Success - show ticket and clear
        showAlert('success', 'Venta completada', `ID de venta: ${responseData.data.id_venta}`);
        generateTicket(responseData.data.id_venta);
        clearSale();
        
    } catch (error) {
        console.error('Error en venta:', error);
        showAlert('error', 'Error en venta', error.message || 'Ocurrió un error desconocido');
    } finally {
        // Restore UI
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
    }
}

// Helper functions
async function parseResponse(response) {
    const text = await response.text();
    
    try {
        const data = JSON.parse(text);
        return {
            success: response.ok && data.success,
            message: data.message || response.statusText,
            data: data.data || null
        };
    } catch (e) {
        console.error('Invalid JSON response:', text);
        return {
            success: false,
            message: 'Invalid server response',
            data: null
        };
    }
}

function validateSaleData(data) {
    const required = {
        id_empleado: 'number',
        tipo_venta: ['local', 'domicilio'],
        cliente_nombre: 'string',
        telefono: 'string',
        direccion: 'string',
        total: 'number',
        metodo_pago: ['efectivo', 'tarjeta', 'transferencia'],
        productos: 'array'
    };
    
    try {
        // Check required fields
        for (const [field, type] of Object.entries(required)) {
            if (!(field in data)) return false;
            
            if (Array.isArray(type)) { // ENUM check
                if (!type.includes(data[field])) return false;
            } else if (typeof data[field] !== type) { // Type check
                return false;
            }
        }
        
        // Validate products
        if (!data.productos.every(p => 
            p.nombre && p.categoria && 
            typeof p.cantidad === 'number' && 
            typeof p.precio === 'number'
        )) {
            return false;
        }
        
        return true;
    } catch (e) {
        return false;
    }
}

function showAlert(type, title, message = '') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <h4>${title}</h4>
        ${message ? `<p>${message}</p>` : ''}
        <button class="close-alert">&times;</button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
    
    // Manual close
    alert.querySelector('.close-alert').addEventListener('click', () => {
        alert.remove();
    });
}

// Generar ticket de venta
function generateTicket(ventaId) {
    const now = new Date();
    const ticketContent = document.getElementById('ticket-content');
    const clienteNombre = document.getElementById('cliente_nombre').value.trim();
    const telefono = document.getElementById('telefono-cliente').value.trim();
    const direccion = document.getElementById('direccion-cliente').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const total = currentSale.reduce((sum, item) => sum + item.subtotal, 0);
    
    let ticketHTML = `
        <div class="ticket-header">
            <h2>Pizzería</h2>
            <p>Sistema de Pedidos por Llamada</p>
            <p>${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
            <p>Ticket #${ventaId}</p>
        </div>
        
        <div class="ticket-client">
            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${clienteNombre}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Dirección:</strong> ${direccion}</p>
        </div>
        
        <table class="ticket-items">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    currentSale.forEach(item => {
        ticketHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    ticketHTML += `
            </tbody>
        </table>
        
        <div class="ticket-total">
            <h3>Total: $${total.toFixed(2)}</h3>
            <p><strong>Método de pago:</strong> ${paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}</p>
    `;
    
    if (paymentMethod === 'efectivo') {
        const cashReceived = parseFloat(document.getElementById('cash-received').value) || 0;
        const change = cashReceived - total;
        ticketHTML += `
            <p><strong>Efectivo recibido:</strong> $${cashReceived.toFixed(2)}</p>
            <p><strong>Cambio:</strong> $${change.toFixed(2)}</p>
        `;
    }
    
    ticketHTML += `
        </div>
        <div class="ticket-footer">
            <p>¡Gracias por su preferencia!</p>
            <p>Vuelva pronto</p>
        </div>
    `;
    
    ticketContent.innerHTML = ticketHTML;
}

// Imprimir ticket
function printTicket() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ticket de Venta</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
                    .ticket-header { text-align: center; margin-bottom: 15px; }
                    .ticket-header h2 { margin: 5px 0; }
                    .ticket-client { margin-bottom: 15px; }
                    .ticket-items { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                    .ticket-items th { text-align: left; border-bottom: 1px solid #000; padding: 3px 0; }
                    .ticket-items td { padding: 3px 0; }
                    .ticket-total { text-align: right; margin-bottom: 15px; }
                    .ticket-footer { text-align: center; margin-top: 20px; }
                </style>
            </head>
            <body>
                ${document.getElementById('ticket-content').innerHTML}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}