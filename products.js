document.addEventListener('DOMContentLoaded', function() {
    // 商品數據
    const products = [
        {
            id: 1,
            name: '衣索比亞耶加雪菲',
            price: 450,
            image: 'https://via.placeholder.com/300',
            description: '花香調，帶有茉莉花香與柑橘風味',
            category: 'light',
            roastLevel: '淺焙'
        },
        {
            id: 2,
            name: '哥倫比亞supremo',
            price: 400,
            image: 'https://via.placeholder.com/300',
            description: '均衡醇厚，具有堅果與焦糖香',
            category: 'medium',
            roastLevel: '中焙'
        },
        {
            id: 3,
            name: '瓜地馬拉安提瓜',
            price: 480,
            image: 'https://via.placeholder.com/300',
            description: '濃郁香醇，帶有巧克力味',
            category: 'dark',
            roastLevel: '深焙'
        },
        // 可以添加更多商品...
    ];

    const productsGrid = document.querySelector('.products-grid');
    const sortFilter = document.getElementById('sortFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    // 渲染商品
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'coffee-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="roast-level">${product.roastLevel}</div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">NT$ ${product.price}</p>
                <button onclick="addToCart(${product.id})">加入購物車</button>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // 初始渲染
    renderProducts(products);

    // 排序功能
    sortFilter.addEventListener('change', function() {
        let sortedProducts = [...products];
        switch(this.value) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                sortedProducts = [...products];
        }
        renderProducts(sortedProducts);
    });

    // 分類過濾
    categoryFilter.addEventListener('change', function() {
        const category = this.value;
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    });

    class ShoppingCart {
        constructor() {
            // 從 localStorage 讀取購物車數據
            const savedCart = localStorage.getItem('cartItems');
            this.items = savedCart ? JSON.parse(savedCart) : [];
            this.total = 0;
            this.init();
            this.updateCart(); // 初始化時更新購物車顯示
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
            
            // 保存到 localStorage
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            
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
            // 更新 localStorage
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            this.updateCart();
        }
    
        updateQuantity(id, change) {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    this.removeItem(id);
                } else {
                    // 更新 localStorage
                    localStorage.setItem('cartItems', JSON.stringify(this.items));
                    this.updateCart();
                }
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
    
    // 確保全局只有一個購物車實例
    if (!window.cart) {
        window.cart = new ShoppingCart();
    }
    
    // 漢堡選單功能
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.querySelector('.nav-container');
    const body = document.body;
    
    // 漢堡選單點擊事件
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
        body.classList.toggle('menu-open');
        console.log('Menu toggled:', navContainer.classList.contains('active'));
    });
    
    // 點擊選單項目時關閉選單
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // 點擊頁面其他地方時關閉選單
    document.addEventListener('click', (e) => {
        if (navContainer.classList.contains('active') && 
            !navContainer.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // 防止選單內部點擊事件冒泡
    navContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    }); 

    // 新增評價系統
    class ReviewSystem {
        constructor() {
            this.reviews = [];
        }

        // 新增評價
        addReview(productId, userId, rating, comment) {
            const review = {
                id: Date.now(),
                productId,
                userId,
                rating,
                comment,
                date: new Date(),
                likes: 0
            };
            this.reviews.push(review);
            this.updateProductRating(productId);
        }

        // 更新商品評分
        updateProductRating(productId) {
            const productReviews = this.reviews.filter(r => r.productId === productId);
            const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
            // 更新商品評分顯示
        }
    }

    // 新增搜尋功能
    class SearchSystem {
        constructor() {
            this.init();
        }

        init() {
            const searchBar = `
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="搜尋商品...">
                    <button onclick="search()"><i class="fas fa-search"></i></button>
                </div>
            `;
            
            this.addSearchEventListener();
        }

        // 搜尋功能
        search(query) {
            return products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        // 添加即時搜尋監聽器
        addSearchEventListener() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const results = this.search(query);
                this.updateSearchResults(results);
            });
        }
    }

    // 新增社群分享功能
    class SocialSharing {
        constructor() {
            this.init();
        }

        init() {
            const shareButtons = `
                <div class="social-share">
                    <button onclick="shareOnFacebook()"><i class="fab fa-facebook"></i></button>
                    <button onclick="shareOnLine()"><i class="fab fa-line"></i></button>
                    <button onclick="shareOnTwitter()"><i class="fab fa-twitter"></i></button>
                </div>
            `;
        }

        // 分享到 Facebook
        shareOnFacebook(productUrl) {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            window.open(url, '_blank');
        }
    }
}); 