document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    // Función para cambiar de categoría
    function changeCategory(category) {
        // Remover clase active de todos los botones y contenidos
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));
        
        // Agregar clase active al botón seleccionado
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
        
        // Mostrar el contenido correspondiente
        document.getElementById(category).classList.add('active');
        
        // Scroll suave al inicio de la sección
        document.querySelector('.menu-container').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Event listeners para los botones de categoría
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            changeCategory(category);
        });
    });

    // Opcional: Puedes cargar una categoría específica desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && document.getElementById(categoryParam)) {
        changeCategory(categoryParam);
    }
});

// Especialidades de pizza - asegúrate de que los nombres de las imágenes coincidan con lo que tienes
const especialidadesPizza = [
    {
        name: "Pepperoni",
        image: "IMAGES/ALIMENTOS/PEPERONI.jpg",
        description: "Deliciosa base de queso mozzarella con abundantes rodajas de pepperoni crujiente."
    },
    {
        name: "Hawaiana",
        image: "IMAGES/ALIMENTOS/HAWAIANA.jpg",
        description: "Tradicional mezcla de jamón y piña sobre una capa de queso fundido."
    },
    {
        name: "Boloñesa",
        image: "IMAGES/ALIMENTOS/BOLOÑESA.jpg",
        description: "Salsa boloñesa casera con carne molida, jitomate, cebolla y especias."
    },
    {
        name: "4 Quesos",
        image: "IMAGES/ALIMENTOS/4QUESOS.jpg",
        description: "Combinación de mozzarella, gouda, parmesano y queso azul en perfecta armonía."
    },
    {
        name: "Vegetariana",
        image: "IMAGES/ALIMENTOS/VEGETARIANA.jpg",
        description: "Con champiñones, pimientos, cebolla, tomate y aceitunas negras sobre base de queso."
    },
    {
        name: "Al Pastor",
        image: "IMAGES/ALIMENTOS/PASTOR.webp",
        description: "Inspirada en el taco: carne al pastor, piña, cebolla y cilantro con salsa especial."
    }
];

// Función para cargar las especialidades
function loadEspecialidades() {
    const especialidadesContainer = document.getElementById('especialidades');
    const productGrid = especialidadesContainer.querySelector('.product-grid');
    
    // Limpiar el contenedor
    productGrid.innerHTML = '';
    
    // Agregar cada especialidad
    especialidadesPizza.forEach(especialidad => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${especialidad.image}" alt="${especialidad.name}">
            <h3>${especialidad.name}</h3>
        `;
        productGrid.appendChild(productCard);
    });
}

// Llamar a la función cuando se carga la categoría
document.querySelector('.category-btn[data-category="especialidades"]').addEventListener('click', loadEspecialidades);