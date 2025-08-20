document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL ---
    // Se ejecuta de forma segura en todas las páginas.
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    // --- LÓGICA PARA LA PÁGINA DE CATÁLOGO ---
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMessage = document.getElementById('no-results-message'); // Se añade el selector del mensaje

    // Esta verificación asegura que el siguiente código solo se ejecute en la página del catálogo.
    if (productGrid && filterBtns.length > 0) {

        // --- FUNCIÓN PARA RENDERIZAR LOS PRODUCTOS ---
        const renderProducts = (category = 'all') => {
            productGrid.innerHTML = ''; // Limpia el grid

            const filteredProducts = productos.filter(product => {
                if (category === 'all') {
                    return true;
                }
                return product.category === category;
            });

            // ✨ MEJORA AÑADIDA: Lógica para mostrar mensaje si no hay productos
            if (filteredProducts.length === 0) {
                if (noResultsMessage) noResultsMessage.style.display = 'block';
            } else {
                if (noResultsMessage) noResultsMessage.style.display = 'none';

                // Renderiza cada producto si la lista no está vacía
                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.dataset.category = product.category;
                    const buttonClass = product.category === 'verdepower' ? 'btn-primary' : 'btn-primary';

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
            }
        };

        // --- LÓGICA DE LOS FILTROS ---
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (document.querySelector('.filter-btn.active')) {
                    document.querySelector('.filter-btn.active').classList.remove('active');
                }
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');
                renderProducts(category);
            });
        });

        // --- RENDERIZADO INICIAL ---
        renderProducts();
    }
});