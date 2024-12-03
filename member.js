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
    }

    // 初始化會員系統
    const memberSystem = new MemberSystem();
}); 