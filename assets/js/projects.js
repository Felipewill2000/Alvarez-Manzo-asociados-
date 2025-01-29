document.addEventListener('DOMContentLoaded', function() {
    // Crear el icono del carrito
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = `
        <i class="bi bi-cart"></i>
        <span class="cart-count">0</span>
    `;
    document.body.appendChild(cartIcon);

    // Crear el modal del carrito
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-header">
                <h3>Carrito de Compras</h3>
                <button class="close-cart">Cerrar</button>
            </div>
            <div class="cart-items">
                <!-- Los items del carrito se agregarán aquí dinámicamente -->
            </div>
            <div class="cart-total">
                <h4>Total: $0.00</h4>
                <button class="checkout-btn">Proceder al pago</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartModal);

    // Inicializar carrito desde localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

    // Actualizar contador inicial
    updateCartCount();
    updateCartDisplay();

    // Agregar event listeners a todos los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });

            // Mostrar mensaje de confirmación
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = '¡Producto agregado al carrito!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        });
    });

    // Función para agregar al carrito
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Obtener la URL de la imagen del producto
            const productElement = document.querySelector(`[data-id="${product.id}"]`).closest('.portfolio-wrap');
            const imageUrl = productElement.querySelector('img').src;
            cartItems.push({
                ...product,
                imageUrl: imageUrl
            });
        }
        
        cartCount++;
        
        // Actualizar localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartCount', cartCount);
        
        updateCartCount();
        updateCartDisplay();
    }

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cartCount;
    }

    // Función para actualizar el display del carrito
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = '';
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-thumbnail">
                        <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Precio: $${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" max="99" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Agregar event listeners para los controles de cantidad
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                if (item) {
                    if (this.classList.contains('plus') && item.quantity < 99) {
                        item.quantity++;
                        cartCount++;
                    } else if (this.classList.contains('minus') && item.quantity > 1) {
                        item.quantity--;
                        cartCount--;
                    }
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    localStorage.setItem('cartCount', cartCount);
                    updateCartCount();
                    updateCartDisplay();
                }
            });
        });

        // Manejar cambios directos en el input de cantidad
        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                if (item) {
                    const newQuantity = parseInt(this.value) || 1;
                    const validQuantity = Math.min(Math.max(newQuantity, 1), 99);
                    const difference = validQuantity - item.quantity;
                    
                    item.quantity = validQuantity;
                    cartCount += difference;
                    
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    localStorage.setItem('cartCount', cartCount);
                    updateCartCount();
                    updateCartDisplay();
                }
            });
        });

        updateTotal();
    }

    // Función para actualizar el total
    function updateTotal() {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.querySelector('.cart-total h4').textContent = `Total: $${total.toFixed(2)}`;
    }

    // Manejadores de eventos del carrito
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    const closeCart = document.querySelector('.close-cart');
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        
        // Manejar eliminación de items
        if (e.target.classList.contains('remove-item')) {
            const itemId = e.target.dataset.id;
            removeFromCart(itemId);
        }
    });

    // Función para remover items del carrito
    function removeFromCart(itemId) {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cartCount -= cartItems[itemIndex].quantity;
            cartItems.splice(itemIndex, 1);
            
            // Actualizar localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('cartCount', cartCount);
            
            updateCartCount();
            updateCartDisplay();
        }
    }

    // Botón de checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cartItems.length > 0) {
            alert('¡Gracias por tu compra!');
            // Limpiar carrito
            cartItems = [];
            cartCount = 0;
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            updateCartCount();
            updateCartDisplay();
        } else {
            alert('Tu carrito está vacío');
        }
    });
});
