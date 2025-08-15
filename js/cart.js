document.addEventListener('DOMContentLoaded', () => {
    // Carga el carrito desde localStorage o lo inicializa como un array vacío
    let cart = JSON.parse(localStorage.getItem('ofmedical_cart')) || [];

    // --- FUNCIONES DEL CARRITO ---

    const saveCart = () => {
        localStorage.setItem('ofmedical_cart', JSON.stringify(cart));
    };

    const updateCartCounter = () => {
        const cartCounter = document.getElementById('cart-counter');
        // Suma las cantidades de todos los productos en el carrito
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems;
        }
    };

    const addToCart = (productId) => {
        const productToAdd = productos.find(p => p.id === productId);
        const itemInCart = cart.find(item => item.id === productId);

        if (itemInCart) {
            // Si el item ya está, aumenta la cantidad
            itemInCart.quantity++;
        } else {
            // Si no está, lo añade con cantidad 1
            cart.push({ ...productToAdd, quantity: 1 });
        }
        
        saveCart();
        updateCartCounter();
        alert(`"${productToAdd.name}" ha sido añadido a tu cotización.`);
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartPage(); // Re-renderiza la página del carrito
        updateCartCounter();
    };

    const updateQuantity = (productId, change) => {
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            itemInCart.quantity += change;
            if (itemInCart.quantity <= 0) {
                // Si la cantidad llega a 0 o menos, elimina el producto
                removeFromCart(productId);
            } else {
                saveCart();
                renderCartPage();
                updateCartCounter();
            }
        }
    };

    const checkoutToWhatsApp = () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        let message = "Hola, estoy interesado en cotizar los siguientes productos:\n\n";
        cart.forEach(item => {
            message += `*Producto:* ${item.name}\n`;
            message += `*Cantidad:* ${item.quantity}\n\n`;
        });
        
        message += "Quedo atento a su pronta respuesta. ¡Gracias!";

        const phoneNumber = "573001234567"; // ¡IMPORTANTE! Reemplazar con el número del cliente
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    };

    // --- LÓGICA ESPECIAL PARA LA PÁGINA DEL CARRITO ---

    const renderCartPage = () => {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSummaryContainer = document.getElementById('cart-summary-container');
        const totalItemsSpan = document.getElementById('total-items');

        // Si no estamos en la página del carrito, no hagas nada.
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            cartSummaryContainer.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            cartSummaryContainer.style.display = 'block';
            
            cartItemsContainer.innerHTML = ''; // Limpia el contenedor
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="quantity-adjuster">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            totalItemsSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    };

    // Para poder llamar a las funciones desde el HTML (onclick)
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;

    // --- INICIALIZACIÓN ---
    updateCartCounter();
    renderCartPage();

    // Event listener para el botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutToWhatsApp);
    }
});