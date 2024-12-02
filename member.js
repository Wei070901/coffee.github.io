document.addEventListener('DOMContentLoaded', function() {
    // 獲取表單元素
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // 切換表單顯示
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // 處理登入表單提交
    loginForm.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // 這裡添加登入邏輯
        console.log('登入資料:', { email, password, rememberMe });
        
        // 模擬登入成功
        showNotification('登入成功！');
        setTimeout(() => {
            window.location.href = 'member-dashboard.html';
        }, 1500);
    });

    // 處理註冊表單提交
    registerForm.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            phone: document.getElementById('phone').value
        };

        if (validateRegisterForm(formData)) {
            // 這裡添加註冊邏輯
            console.log('註冊資料:', formData);
            
            // 模擬註冊成功
            showNotification('註冊成功！請登入');
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            }, 1500);
        }
    });

    // 表單驗證
    function validateRegisterForm(data) {
        if (data.password !== data.confirmPassword) {
            showNotification('密碼不一致', 'error');
            return false;
        }

        const phoneRegex = /^09\d{8}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('請輸入有效的手機號碼', 'error');
            return false;
        }

        return true;
    }

    // 通知功能
    function showNotification(message, type = 'success') {
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
}); 