document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL (CORREGIDO) ---
    // Esta lógica ahora se ejecuta en todas las páginas de forma segura.
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Alterna una clase en el body para mostrar/ocultar el menú
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    // --- LÓGICA PARA LA PÁGINA DE CATÁLOGO ---
    // Estas constantes solo se definen si estamos en la página del catálogo
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Se agrega una verificación para que este código solo se ejecute si existe el grid de productos.
    if (productGrid && filterBtns.length > 0) {

        // --- FUNCIÓN PARA RENDERIZAR LOS PRODUCTOS (CON LA NUEVA LÓGICA) ---
        const renderProducts = (category = 'all') => {
            productGrid.innerHTML = ''; // Limpia el grid antes de renderizar

            const filteredProducts = productos.filter(product => {
                if (category === 'all') {
                    return true;
                }
                return product.category === category;
            });

            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                // 1. AÑADIDO: Atributo para aplicar estilos CSS específicos a la tarjeta
                productCard.dataset.category = product.category;

                // 2. AÑADIDO: Lógica para cambiar la clase del botón si es de "Verde Power"
                const buttonClass = product.category === 'verdepower' ? 'btn-verdepower' : 'btn-primary';

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <button class="btn ${buttonClass}" onclick="addToCart(${product.id})">
                            Añadir a Cotización
                        </button>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
        };

        // --- LÓGICA DE LOS FILTROS ---
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Maneja la clase 'active'
                if (document.querySelector('.filter-btn.active')) {
                    document.querySelector('.filter-btn.active').classList.remove('active');
                }
                btn.classList.add('active');

                // Renderiza los productos según la categoría seleccionada
                const category = btn.getAttribute('data-category');
                renderProducts(category);
            });
        });

        // --- RENDERIZADO INICIAL ---
        // Muestra todos los productos al cargar la página
        renderProducts();
    }
});