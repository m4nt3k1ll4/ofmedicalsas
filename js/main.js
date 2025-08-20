document.addEventListener('DOMContentLoaded', () => {

    /*
    * CONTROLADOR DEL MENÚ DE NAVEGACIÓN MÓVIL
    * Se encarga de mostrar y ocultar el menú en dispositivos móviles
    * al hacer clic en el botón de hamburguesa.
    */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    /*
    * CONTROLADOR DE LA PÁGINA DE CATÁLOGO
    * Gestiona la renderización, el filtrado de productos por categoría y la activación
    * de filtros a través de parámetros en la URL.
    */
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMessage = document.getElementById('no-results-message');

    if (productGrid && filterBtns.length > 0) {

        const renderProducts = (category = 'all') => {
            productGrid.innerHTML = '';

            const filteredProducts = productos.filter(product => {
                if (category === 'all') return true;
                return product.category === category;
            });

            if (filteredProducts.length === 0) {
                if (noResultsMessage) noResultsMessage.style.display = 'block';
            } else {
                if (noResultsMessage) noResultsMessage.style.display = 'none';

                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.dataset.category = product.category;
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
            }
        };

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

        // Lógica para leer el parámetro de la URL y activar un filtro
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromURL = urlParams.get('category');

        if (categoryFromURL) {
            const filterToActivate = document.querySelector(`.filter-btn[data-category="${categoryFromURL}"]`);
            if (filterToActivate) {
                filterToActivate.click(); // Simula un clic para activar el filtro
            } else {
                renderProducts(); // Si la categoría no existe, muestra todos
            }
        } else {
            renderProducts(); // Renderizado inicial si no hay parámetro en la URL
        }
    }
});