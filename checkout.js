document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;
    let customerData = {};

    // 初始化訂單資料
    initializeOrderData();

    // 下一步按鈕事件
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        });
    });

    // 上一步按鈕事件
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    // 確認訂購按鈕事件
    document.querySelector('.submit-order').addEventListener('click', submitOrder);

    // 添加付款方式的點擊事件處理
    document.querySelectorAll('.payment-method input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // 移除所有付款方式的選中狀態
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('selected');
            });
            // 添加當前選中的付款方式狀態
            this.closest('.payment-method').classList.add('selected');
        });
    });

    function goToStep(step) {
        // 隱藏當前步驟的內容
        const currentContent = document.querySelector(`#step${currentStep}`);
        if (currentContent) {
            currentContent.classList.remove('active');
        }

        // 更新步驟指示器
        steps.forEach((s, index) => {
            if (index + 1 < step) {
                s.classList.add('completed');
                s.classList.remove('active');
            } else if (index + 1 === step) {
                s.classList.add('active');
                s.classList.remove('completed');
            } else {
                s.classList.remove('completed', 'active');
            }
        });

        // 顯示新步驟的內容
        const nextContent = document.querySelector(`#step${step}`);
        if (nextContent) {
            nextContent.classList.add('active');
            currentStep = step;
            
            // 如果是第三步，更新確認資訊
            if (step === 3) {
                updateConfirmationInfo();
            }
        }

        // 平滑滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateCurrentStep() {
        if (currentStep === 1) {
            // 驗證個人資料
            const required = ['name', 'phone', 'email', 'address'];
            let valid = true;
            required.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                    input.style.borderColor = '#ff4444';
                } else {
                    input.classList.remove('error');
                    input.style.borderColor = '#ddd';
                }
            });
            if (valid) {
                customerData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value
                };
            }
            return valid;
        }
        if (currentStep === 2) {
            // 驗證付款方式
            const paymentMethod = document.querySelector('input[name="payment"]:checked');
            if (!paymentMethod) {
                alert('請選擇付款方式');
                return false;
            }
            customerData.payment = paymentMethod.value;
            // 添加視覺反饋
            document.querySelectorAll('.payment-method').forEach(method => {
                if (method.querySelector('input[type="radio"]').checked) {
                    method.classList.add('selected');
                } else {
                    method.classList.remove('selected');
                }
            });
            return true;
        }
        return true;
    }

    function initializeOrderData() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const orderItems = document.getElementById('orderItems');
        const sidebarOrderItems = document.getElementById('sidebarOrderItems');
        const subtotalElement = document.getElementById('subtotal');
        const sidebarSubtotalElement = document.getElementById('sidebarSubtotal');
        const totalElement = document.getElementById('total');
        const sidebarTotalElement = document.getElementById('sidebarTotal');
        const shippingFee = 60;
        let subtotal = 0;

        // 清空現有內容
        orderItems.innerHTML = '';
        sidebarOrderItems.innerHTML = '';

        // 顯示訂單項目
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
            
            // 側邊欄訂單項目
            const sidebarItemElement = document.createElement('div');
            sidebarItemElement.className = 'order-item';
            sidebarItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <div class="order-item-price">
                        <span>NT$ ${item.price}</span>
                        <span>× ${item.quantity}</span>
                    </div>
                </div>
            `;
            sidebarOrderItems.appendChild(sidebarItemElement);

            // 確認頁面的訂單項目
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p class="order-item-price">NT$ ${item.price}</p>
                    <p>數量: ${item.quantity}</p>
                </div>
                <div class="order-item-total">
                    NT$ ${item.price * item.quantity}
                </div>
            `;
            orderItems.appendChild(itemElement);
        });

        // 更新所有金額顯示
        subtotalElement.textContent = `NT$ ${subtotal}`;
        sidebarSubtotalElement.textContent = `NT$ ${subtotal}`;
        totalElement.textContent = `NT$ ${subtotal + shippingFee}`;
        sidebarTotalElement.textContent = `NT$ ${subtotal + shippingFee}`;
    }

    function updateConfirmationInfo() {
        const confirmationInfo = document.getElementById('confirmationInfo');
        let paymentMethod;
        switch(customerData.payment) {
            case 'credit':
                paymentMethod = '信用卡';
                break;
            case 'transfer':
                paymentMethod = '銀行轉帳';
                break;
            case 'cod':
                paymentMethod = '貨到付款';
                break;
            default:
                paymentMethod = '未選擇';
        }
        
        confirmationInfo.innerHTML = `
            <p><strong>姓名：</strong>${customerData.name}</p>
            <p><strong>電話：</strong>${customerData.phone}</p>
            <p><strong>信箱：</strong>${customerData.email}</p>
            <p><strong>地址：</strong>${customerData.address}</p>
            <p><strong>付款方式：</strong>${paymentMethod}</p>
        `;
    }

    function submitOrder() {
        const orderNumber = generateOrderNumber();
        alert(`訂購成功！您的訂單編號是：${orderNumber}`);
        localStorage.removeItem('cartItems');
        window.location.href = 'index.html';
    }

    function generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${year}${month}${day}${random}`;
    }

    function validateForm() {
        // 電話格式驗證
        function validatePhone(phone) {
            const phoneRegex = /^09\d{8}$/;
            return phoneRegex.test(phone);
        }

        // Email格式驗證
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        if (!validatePhone(phone)) {
            showError('phone', '請輸入正確的手機號碼格式');
            return false;
        }

        if (!validateEmail(email)) {
            showError('email', '請輸入正確的電子郵件格式');
            return false;
        }

        return true;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        field.classList.add('error');
        field.parentNode.appendChild(errorDiv);
    }
}); 