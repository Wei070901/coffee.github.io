document.addEventListener('DOMContentLoaded', function() {
    // 會員系統主類
    class MemberSystem {
        constructor() {
            this.currentUser = null;
            this.init();
        }

        init() {
            this.loginForm = document.getElementById('loginForm');
            this.registerForm = document.getElementById('registerForm');
            this.memberDashboard = document.getElementById('memberDashboard');
            
            // 綁定登出按鈕事件
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.logout();
                });
            }

            // 綁定切換表單的按鈕
            document.getElementById('showRegister').addEventListener('click', (e) => {
                e.preventDefault();
                this.loginForm.style.display = 'none';
                this.registerForm.style.display = 'block';
            });

            document.getElementById('showLogin').addEventListener('click', (e) => {
                e.preventDefault();
                this.registerForm.style.display = 'none';
                this.loginForm.style.display = 'block';
            });

            // 綁定忘記密碼按鈕
            document.querySelector('.forgot-password').addEventListener('click', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                if (email) {
                    // 這裡應該發送重設密碼郵件
                    this.showNotification('重設密碼郵件已發送，請檢查您的信箱');
                } else {
                    this.showNotification('請先輸入電子郵件', 'error');
                }
            });

            // 綁定登入表單提交事件
            this.loginForm.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // 綁定註冊表單提交事件
            this.registerForm.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });

            // 檢查是否已登入
            this.checkLoginStatus();

            // 綁定會員選項點擊事件
            document.querySelectorAll('.member-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    // 移除所有選項的 active 類
                    document.querySelectorAll('.member-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    
                    // 添加當前選項的 active 類
                    e.target.classList.add('active');
                    
                    // 切換內容顯示
                    const target = e.target.dataset.target;
                    this.switchContent(target);
                });
            });

            // 內容切換函數
            this.switchContent = (target) => {
                // 隱藏所有內容
                document.querySelectorAll('.dashboard-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // 顯示目標內容
                const targetContent = document.getElementById(target);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            };

            // 初始化訂單記錄
            this.orderHistory = [
                {
                    orderId: '202310010001',
                    date: '2023-10-01',
                    total: 950,
                    items: [
                        { name: '衣索比亞耶加雪菲', quantity: 1, price: 450 },
                        { name: '哥倫比亞supremo', quantity: 1, price: 500 }
                    ],
                    status: '已完成'
                },
                {
                    orderId: '202310020002',
                    date: '2023-10-02',
                    total: 480,
                    items: [
                        { name: '瓜地馬拉安提瓜', quantity: 1, price: 480 }
                    ],
                    status: '處理中'
                }
            ];

            // 顯示訂單記錄
            this.displayOrderHistory();

            this.wishlist = this.loadWishlist();
            this.displayWishlist();
        }

        displayOrderHistory() {
            const orderList = document.querySelector('.order-list');
            orderList.innerHTML = '';

            this.orderHistory.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order-item';
                orderElement.innerHTML = `
                    <h4>訂單編號: ${order.orderId}</h4>
                    <p>日期: ${order.date}</p>
                    <p>總計: NT$ ${order.total}</p>
                    <p>狀態: ${order.status}</p>
                    <button onclick="memberSystem.viewOrderDetails('${order.orderId}')">查看詳情</button>
                `;
                orderList.appendChild(orderElement);
            });
        }

        viewOrderDetails(orderId) {
            const order = this.orderHistory.find(o => o.orderId === orderId);
            if (order) {
                alert(`訂單詳情:\n\n${order.items.map(item => `${item.name} x${item.quantity} - NT$${item.price}`).join('\n')}\n\n總計: NT$${order.total}`);
            }
        }

        handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // 這裡應該發送到後端驗證
            // 模擬登入成功
            this.loginSuccess({
                name: '測試用戶',
                email: email,
                level: '一般會員',
                points: 100
            });
        }

        handleRegister() {
            const formData = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                phone: document.getElementById('phone').value
            };

            if (this.validateRegisterData(formData)) {
                // 這裡應該發送到後端註冊
                // 模擬註冊成功
                this.showNotification('註冊成功！請登入');
                this.switchToLogin();
            }
        }

        loginSuccess(userData) {
            this.currentUser = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 更新會員資訊顯示
            document.getElementById('memberName').textContent = userData.name;
            document.getElementById('memberLevel').textContent = userData.level;
            document.getElementById('memberPoints').textContent = userData.points;

            // 切換到會員中心畫面
            this.loginForm.style.display = 'none';
            this.memberDashboard.style.display = 'block';

            this.showNotification('登入成功！');
        }

        checkLoginStatus() {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                this.loginSuccess(JSON.parse(savedUser));
            }
        }

        validateRegisterData(data) {
            if (data.password !== data.confirmPassword) {
                this.showNotification('密碼不一致', 'error');
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                this.showNotification('請輸入有效的電子郵件', 'error');
                return false;
            }

            const phoneRegex = /^09\d{8}$/;
            if (!phoneRegex.test(data.phone)) {
                this.showNotification('請輸入有效的手機號碼', 'error');
                return false;
            }

            return true;
        }

        switchToLogin() {
            this.registerForm.style.display = 'none';
            this.loginForm.style.display = 'block';
        }

        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
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
            }, 3000);
        }

        logout() {
            this.currentUser = null;
            localStorage.removeItem('user');
            this.memberDashboard.style.display = 'none';
            this.loginForm.style.display = 'block';
            this.showNotification('已登出');
            
            // 重新導向到首頁或重新載入頁面
            window.location.reload();
        }

        // 加載收藏清單
        loadWishlist() {
            const savedWishlist = localStorage.getItem('wishlistItems');
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        }

        // 顯示收藏清單
        displayWishlist() {
            const wishlistGrid = document.querySelector('.wishlist-grid');
            wishlistGrid.innerHTML = '';

            this.wishlist.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'wishlist-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>NT$ ${item.price}</p>
                    <button class="remove-btn">移除</button>
                `;
                itemElement.addEventListener('click', () => {
                    window.location.href = `product-detail.html?id=${item.id}`;
                });

                // 獲取“移除”按鈕並添加事件處理程序
                const removeBtn = itemElement.querySelector('.remove-btn');
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止事件冒泡
                    this.removeFromWishlist(item.id);
                });

                wishlistGrid.appendChild(itemElement);
            });
        }

        // 從收藏清單中移除項目
        removeFromWishlist(id) {
            this.wishlist = this.wishlist.filter(item => item.id !== id);
            localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
            this.displayWishlist();
            this.showNotification('已從收藏清單移除');
        }
    }
    // 初始化會員系統
    const memberSystem = new MemberSystem();
}); 