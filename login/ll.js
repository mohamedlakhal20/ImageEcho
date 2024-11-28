const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// تبديل الواجهة بين تسجيل الدخول والتسجيل
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// تخزين معلومات المستخدم عند التسجيل
document.querySelector('.sign-up button').addEventListener('click', (e) => {
    e.preventDefault(); // منع السلوك الافتراضي

    const name = document.querySelector('.sign-up input[placeholder="Name"]').value;
    const email = document.querySelector('.sign-up input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-up input[placeholder="Password"]').value;

    if (name && email && password) {
        // تخزين البيانات في Local Storage
        localStorage.setItem('user', JSON.stringify({ name, email, password }));
        alert('Registration successful! You can now log in.');
        container.classList.remove("active"); // العودة إلى صفحة تسجيل الدخول
    } else {
        alert('Please fill in all fields to register.');
    }
});

// التحقق من صحة تسجيل الدخول
document.querySelector('.sign-in button').addEventListener('click', (e) => {
    e.preventDefault(); // منع السلوك الافتراضي

    const email = document.querySelector('.sign-in input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

    const savedUser = JSON.parse(localStorage.getItem('user')); // استرجاع البيانات المخزنة

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        alert(`Welcome back, ${savedUser.name}!`);
        window.location.href = "../contente/content.html"; // الانتقال إلى الرابط
    } else {
        alert('Invalid email or password. Please try again.');
    }
});


