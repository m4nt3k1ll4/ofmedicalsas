document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // --- FUNCIÓN PARA RENDERIZAR LOS PRODUCTOS ---
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
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
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
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');

            // Renderiza los productos según la categoría seleccionada
            const category = btn.getAttribute('data-category');
            renderProducts(category);
        });
    });

    // --- RENDERIZADO INICIAL ---
    // Muestra todos los productos al cargar la página
    renderProducts();
});

// --- LÓGICA PARA EL MENÚ MÓVIL ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Alterna una clase en el body para mostrar/ocultar el menú
            document.body.classList.toggle('mobile-menu-open');
        });
    }
});