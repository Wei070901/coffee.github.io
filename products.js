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
}); 