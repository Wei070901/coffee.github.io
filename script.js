class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        // 初始化購物車
        this.cartIcon = document.getElementById('cartIcon');
        this.cartModal = document.getElementById('cartModal');
        this.closeCart = document.getElementById('closeCart');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.querySelector('.cart-count');
        this.checkoutBtn = document.getElementById('checkoutBtn');

        // 綁定事件
        this.cartIcon.addEventListener('click', () => this.openCart());
        this.closeCart.addEventListener('click', () => this.closeCartModal());
        this.checkoutBtn.addEventListener('click', () => this.checkout());

        // 綁定所有加入購物車按鈕
        document.querySelectorAll('.coffee-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.coffee-card');
                const product = {
                    id: Date.now(), // 臨時ID
                    name: card.querySelector('h3').textContent,
                    price: parseInt(card.querySelector('.price').textContent.replace('NT$ ', '')),
                    image: card.querySelector('img').src,
                    quantity: 1
                };
                this.addItem(product);
            });
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(product);
        }
        
        // 添加購物車圖標彈跳動畫
        this.cartIcon.classList.add('bounce');
        setTimeout(() => {
            this.cartIcon.classList.remove('bounce');
        }, 500);

        // 創建飛入動畫元素
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = '<i class="fas fa-coffee"></i>';
        
        // 設置初始位置（按鈕位置）
        const buttonRect = event.target.getBoundingClientRect();
        flyingItem.style.left = `${buttonRect.left}px`;
        flyingItem.style.top = `${buttonRect.top}px`;
        
        document.body.appendChild(flyingItem);

        // 移除飛入動畫元素
        setTimeout(() => {
            flyingItem.remove();
        }, 800);

        this.updateCart();
        this.showNotification('商品已加入購物車！');
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
    }

    updateQuantity(id, change) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
            }
            this.updateCart();
        }
    }

    updateCart() {
        this.cartItems.innerHTML = '';
        this.total = 0;

        this.items.forEach(item => {
            this.total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">NT$ ${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem(${item.id})">&times;</button>
            `;
            this.cartItems.appendChild(itemElement);
        });

        this.cartTotal.textContent = `NT$ ${this.total}`;
        this.cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    openCart() {
        this.cartModal.classList.add('active');
    }

    closeCartModal() {
        this.cartModal.classList.remove('active');
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('購物車是空的！');
            return;
        }
        // 將購物車資料存儲到 localStorage
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        // 跳轉到結帳頁面
        window.location.href = 'checkout.html';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// 初始化購物車
const cart = new ShoppingCart(); 