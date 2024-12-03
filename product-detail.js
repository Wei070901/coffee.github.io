document.addEventListener('DOMContentLoaded', function() {
    // 商品數據
    const products = {
        1: {
            id: 1,
            name: '衣索比亞耶加雪菲',
            price: 450,
            image: 'https://via.placeholder.com/300',
            images: [
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600'
            ],
            description: '花香調，帶有茉莉花香與柑橘風味',
            category: 'light',
            roastLevel: '淺焙',
            features: [
                '產地：衣索比亞耶加雪菲產區',
                '海拔：1,800-2,200公尺',
                '處理法：水洗處理',
                '風味：茉莉花香、柑橘、蜂蜜'
            ],
            brewingGuide: [
                '建議沖煮比例：1:15',
                '水溫：88-92°C',
                '研磨度：中細研磨',
                '適合沖煮方式：手沖、濾掛'
            ]
        },
        2: {
            id: 2,
            name: '哥倫比亞supremo',
            price: 400,
            image: 'https://via.placeholder.com/300',
            images: [
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600'
            ],
            description: '均衡醇厚，具有堅果與焦糖香',
            category: 'medium',
            roastLevel: '中焙',
            features: [
                '產地：哥倫比亞 supremo 等級',
                '海拔：1,500-2,000公尺',
                '處理法：水洗處理',
                '風味：堅果、焦糖、可可'
            ],
            brewingGuide: [
                '建議沖煮比例：1:16',
                '水溫：90-94°C',
                '研磨度：中度研磨',
                '適合沖煮方式：手沖、義式濃縮'
            ]
        },
        3: {
            id: 3,
            name: '瓜地馬拉安提瓜',
            price: 480,
            image: 'https://via.placeholder.com/300',
            images: [
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600',
                'https://via.placeholder.com/600'
            ],
            description: '濃郁香醇，帶有巧克力味',
            category: 'dark',
            roastLevel: '深焙',
            features: [
                '產地：瓜地馬拉安提瓜產區',
                '海拔：1,500-1,700公尺',
                '處理法：水洗處理',
                '風味：巧克力、焦糖、柑橘'
            ],
            brewingGuide: [
                '建議沖煮比例：1:15',
                '水溫：92-96°C',
                '研磨度：中粗研磨',
                '適合沖煮方式：手沖、法壓'
            ]
        }
    };

    // 獲取URL參數中的商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products[productId];

    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    // 更新頁面標題
    document.title = `${product.name} - 咖啡香`;

    // 更新商品資訊
    document.getElementById('mainImage').src = product.images[0];
    document.getElementById('productName').textContent = product.name;
    document.getElementById('roastLevel').textContent = product.roastLevel;
    document.getElementById('productId').textContent = product.id;
    document.getElementById('productPrice').textContent = `NT$ ${product.price}`;
    document.getElementById('productDescription').textContent = product.description;

    // 渲染商品特色
    const featuresContainer = document.getElementById('productFeatures');
    product.features.forEach(feature => {
        const featureElement = document.createElement('p');
        featureElement.textContent = feature;
        featuresContainer.appendChild(featureElement);
    });

    // 渲染沖煮建議
    const brewingGuideContainer = document.getElementById('brewingGuide');
    product.brewingGuide.forEach(guide => {
        const guideElement = document.createElement('p');
        guideElement.textContent = guide;
        brewingGuideContainer.appendChild(guideElement);
    });

    // 渲染縮圖
    const thumbnailsContainer = document.getElementById('imageThumbnails');
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${product.name} 圖片 ${index + 1}`;
        thumbnail.addEventListener('click', () => {
            document.getElementById('mainImage').src = image;
        });
        thumbnailsContainer.appendChild(thumbnail);
    });

    // 數量選擇器功能
    const quantityInput = document.getElementById('quantity');
    document.querySelector('.minus').addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    document.querySelector('.plus').addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    // 加入購物車功能
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const cartItem = {
            ...product,  // 複製所有商品資訊
            quantity: quantity  // 使用選擇的數量
        };

        // 使用全局購物車實例
        if (window.cart) {
            window.cart.addItem(cartItem);
            
            // 添加飛入動畫元素
            const button = document.getElementById('addToCartBtn');
            const buttonRect = button.getBoundingClientRect();
            const flyingItem = document.createElement('div');
            flyingItem.className = 'flying-item';
            flyingItem.innerHTML = '<i class="fas fa-coffee"></i>';
            flyingItem.style.left = `${buttonRect.left}px`;
            flyingItem.style.top = `${buttonRect.top}px`;
            document.body.appendChild(flyingItem);

            // 移除飛入動畫元素
            setTimeout(() => {
                flyingItem.remove();
            }, 800);

            // 顯示通知
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = '商品已加入購物車！';
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
    });

    // 渲染相關商品
    const relatedProductsContainer = document.getElementById('relatedProducts');
    Object.values(products)
        .filter(p => p.id !== product.id)
        .forEach(relatedProduct => {
            const productCard = document.createElement('div');
            productCard.className = 'coffee-card';
            // 添加點擊事件
            productCard.addEventListener('click', (e) => {
                // 如果點擊的是按鈕,不進行跳轉
                if (e.target.tagName !== 'BUTTON') {
                    window.location.href = `product-detail.html?id=${relatedProduct.id}`;
                }
            });
            
            productCard.innerHTML = `
                <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
                <div class="roast-level">${relatedProduct.roastLevel}</div>
                <h3>${relatedProduct.name}</h3>
                <p>${relatedProduct.description}</p>
                <p class="price">NT$ ${relatedProduct.price}</p>
                <button onclick="cart.addItem(${JSON.stringify(relatedProduct).replace(/"/g, '&quot;')})">加入購物車</button>
            `;
            relatedProductsContainer.appendChild(productCard);
        });
}); 