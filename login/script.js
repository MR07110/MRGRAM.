// login/script.js - TO'LIQ TUZATILGAN (PAROL TASDIQLASH ISHLAYDI)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ========== SUPABASE CONFIG ==========
const SUPABASE_URL = "https://mujoriozaxjojrgkkars.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11am9yaW96YXhqb2pyZ2trYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjQ1MjQsImV4cCI6MjA5MDU0MDUyNH0.IiCWIT5QU06Wd7fEgRtTkG4IoC5oxyTgRAuWxRf15Zw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== STATE ==========
let isLoginMode = true;

// ========== DOM ELEMENTS ==========
const nameGroup = document.getElementById('name-group');
const confirmGroup = document.getElementById('confirm-group');
const btnText = document.getElementById('btn-text');
const spinner = document.getElementById('spinner');
const submitBtn = document.getElementById('submit-btn');
const fullNameInput = document.getElementById('fullName');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorToast = document.getElementById('errorToast');
const togglePasswordBtn = document.getElementById('togglePassword');

const titleLogin = document.getElementById('title-login');
const titleSignup = document.getElementById('title-signup');
const subLogin = document.getElementById('sub-login');
const subSignup = document.getElementById('sub-signup');
const footerLogin = document.getElementById('footer-login');
const footerSignup = document.getElementById('footer-signup');

// ========== DEBUG: ELEMENTLARNI TEKSHIRISH ==========
console.log('📋 Elementlar tekshiruvi:');
console.log('  - nameGroup:', !!nameGroup);
console.log('  - confirmGroup:', !!confirmGroup);
console.log('  - fullNameInput:', !!fullNameInput);
console.log('  - usernameInput:', !!usernameInput);
console.log('  - passwordInput:', !!passwordInput);
console.log('  - confirmPasswordInput:', !!confirmPasswordInput);
console.log('  - submitBtn:', !!submitBtn);

// ========== TOAST ==========
function showToast(message, isSuccess = false) {
    if (!errorToast) return;
    errorToast.textContent = message;
    errorToast.classList.add('show');
    errorToast.classList.toggle('success', isSuccess);
    setTimeout(() => errorToast.classList.remove('show'), 4000);
}

// ========== LOADING ==========
function setLoading(isLoading) {
    if (!submitBtn || !spinner || !btnText) return;
    submitBtn.disabled = isLoading;
    spinner.style.display = isLoading ? 'block' : 'none';
    btnText.style.opacity = isLoading ? '0' : '1';
}

// ========== SHAKE ==========
function shakeInput(input) {
    if (!input) return;
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 500);
}

function clearErrors() {
    document.querySelectorAll('.custom-input').forEach(i => i.classList.remove('error'));
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    const body = document.body;
    const overlay = document.getElementById('theme-overlay');
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (overlay) overlay.style.backgroundColor = (next === 'dark') ? '#1c1c1c' : '#24A1DE';
    body.classList.add('reveal-active');
    setTimeout(() => body.setAttribute('data-theme', next), 400);
    setTimeout(() => body.classList.remove('reveal-active'), 850);
}

// ========== FORM TOGGLE ==========
function toggleForm() {
    isLoginMode = !isLoginMode;
    
    if (!isLoginMode) {
        // REGISTER MODE
        if (nameGroup) {
            nameGroup.classList.add('active');
            nameGroup.style.maxHeight = '100px';
            nameGroup.style.opacity = '1';
            nameGroup.style.visibility = 'visible';
        }
        if (confirmGroup) {
            confirmGroup.classList.add('active');
            confirmGroup.style.maxHeight = '100px';
            confirmGroup.style.opacity = '1';
            confirmGroup.style.visibility = 'visible';
        }
        if (titleLogin) titleLogin.className = 'state-text hidden-up';
        if (titleSignup) titleSignup.className = 'state-text visible-center';
        if (subLogin) subLogin.className = 'state-text hidden-up';
        if (subSignup) subSignup.className = 'state-text visible-center';
        if (footerLogin) footerLogin.className = 'state-text hidden-up';
        if (footerSignup) footerSignup.className = 'state-text visible-center';
        if (btnText) btnText.textContent = "RO'YXATDAN O'TISH";
    } else {
        // LOGIN MODE
        if (nameGroup) {
            nameGroup.classList.remove('active');
            nameGroup.style.maxHeight = '0';
            nameGroup.style.opacity = '0';
            nameGroup.style.visibility = 'hidden';
        }
        if (confirmGroup) {
            confirmGroup.classList.remove('active');
            confirmGroup.style.maxHeight = '0';
            confirmGroup.style.opacity = '0';
            confirmGroup.style.visibility = 'hidden';
        }
        if (titleLogin) titleLogin.className = 'state-text visible-center';
        if (titleSignup) titleSignup.className = 'state-text hidden-up';
        if (subLogin) subLogin.className = 'state-text visible-center';
        if (subSignup) subSignup.className = 'state-text hidden-up';
        if (footerLogin) footerLogin.className = 'state-text visible-center';
        if (footerSignup) footerSignup.className = 'state-text hidden-down';
        if (btnText) btnText.textContent = "KIRISH";
    }
    
    clearErrors();
}

// ========== USERNAME DAN EMAIL YASASH ==========
function usernameToEmail(username) {
    const clean = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${clean}@mrgram.user`;
}

// ========== LOGIN ==========
async function handleLogin(username, password) {
    try {
        setLoading(true);
        clearErrors();
        
        const email = usernameToEmail(username);
        console.log('🔐 Login:', username, '→', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        localStorage.setItem('mrgram_session', JSON.stringify(data.session));
        localStorage.setItem('mrgram_user', JSON.stringify(data.user));
        
        showToast('✅ Xush kelibsiz!', true);
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => { window.location.href = '../home/'; }, 500);
    } catch (error) {
        console.error('❌ Login xatosi:', error);
        showToast('❌ Username yoki parol noto\'g\'ri');
        shakeInput(usernameInput);
        shakeInput(passwordInput);
        setLoading(false);
    }
}

// ========== REGISTER (TO'LIQ TUZATILGAN) ==========
async function handleRegister(fullName, username, password, confirmPassword) {
    console.log('📝 Register funksiyasi chaqirildi');
    console.log('  - Ism:', fullName);
    console.log('  - Username:', username);
    console.log('  - Parol:', password);
    console.log('  - Tasdiqlash:', confirmPassword);
    
    try {
        setLoading(true);
        clearErrors();
        
        // 1. Ism tekshirish
        if (!fullName || fullName.length < 2) {
            showToast('❌ Ism kamida 2 ta harfdan iborat bo\'lishi kerak');
            shakeInput(fullNameInput);
            setLoading(false);
            return;
        }
        
        // 2. Username tekshirish
        if (!username || username.length < 3) {
            showToast('❌ Username kamida 3 ta belgidan iborat bo\'lishi kerak');
            shakeInput(usernameInput);
            setLoading(false);
            return;
        }
        
        // 3. Parol tekshirish
        if (!password || password.length < 6) {
            showToast('❌ Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            shakeInput(passwordInput);
            setLoading(false);
            return;
        }
        
        // 4. Parol tasdiqlash tekshirish
        if (!confirmPassword) {
            showToast('❌ Parolni tasdiqlang');
            if (confirmPasswordInput) shakeInput(confirmPasswordInput);
            setLoading(false);
            return;
        }
        
        // 5. Parollar mosligini tekshirish
        if (password !== confirmPassword) {
            console.log('❌ Parollar mos emas:', password, '!==', confirmPassword);
            showToast('❌ Parollar mos kelmadi. Qayta urinib ko\'ring.');
            shakeInput(passwordInput);
            if (confirmPasswordInput) shakeInput(confirmPasswordInput);
            setLoading(false);
            return;
        }
        
        // 6. Email yasash va ro'yxatdan o'tish
        const email = usernameToEmail(username);
        console.log('📧 Email generatsiya qilindi:', email);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
                data: { 
                    full_name: fullName, 
                    username: username,
                    avatar_url: '../mrgram.svg'
                } 
            }
        });
        
        if (error) {
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                showToast('❌ Bu username band. Boshqa username tanlang.');
            } else if (error.message.includes('password')) {
                showToast('❌ Parol juda oddiy. Kuchliroq parol kiriting.');
            } else {
                showToast('❌ Xatolik: ' + error.message);
            }
            shakeInput(usernameInput);
            setLoading(false);
            return;
        }
        
        // 7. Users jadvaliga qo'shish
        if (data.user) {
            const { error: insertError } = await supabase.from('users').insert([{
                id: data.user.id,
                username: username,
                full_name: fullName,
                email: email,
                avatar_url: '../mrgram.svg',
                created_at: new Date().toISOString()
            }]);
            
            if (insertError) {
                console.warn('⚠️ Users jadvaliga qo\'shishda xatolik:', insertError);
            }
        }
        
        showToast('✅ Ro\'yxatdan o\'tdingiz! Endi kirish qilishingiz mumkin.', true);
        
        // Login formga qaytish
        setTimeout(() => { 
            toggleForm(); 
            if (usernameInput) usernameInput.value = username;
            if (passwordInput) passwordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';
        }, 1500);
        
        setLoading(false);
        
    } catch (error) {
        console.error('❌ Register xatosi:', error);
        showToast('❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
        setLoading(false);
    }
}

// ========== SUBMIT ==========
async function handleSubmit() {
    console.log('🖱️ Submit tugmasi bosildi');
    console.log('  - isLoginMode:', isLoginMode);
    
    // Elementlar mavjudligini tekshirish
    if (!usernameInput || !passwordInput) {
        console.error('❌ Input elementlari topilmadi!');
        showToast('❌ Sahifa to\'liq yuklanmagan. Sahifani yangilang.');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    console.log('  - Username kiritildi:', username);
    console.log('  - Parol kiritildi:', password ? '***' : '(bo\'sh)');
    
    // Username tekshirish
    if (!username || username.length < 3) {
        showToast('❌ Username kamida 3 ta belgidan iborat bo\'lishi kerak');
        shakeInput(usernameInput);
        return;
    }
    
    // Parol tekshirish
    if (!password) {
        showToast('❌ Parolni kiriting');
        shakeInput(passwordInput);
        return;
    }
    
    if (isLoginMode) {
        // LOGIN
        await handleLogin(username, password);
    } else {
        // REGISTER
        if (!fullNameInput) {
            showToast('❌ Ism maydoni topilmadi');
            return;
        }
        
        const fullName = fullNameInput.value.trim();
        
        // CONFIRM PASSWORD - MUHIM QISM
        let confirmPassword = '';
        if (confirmPasswordInput) {
            confirmPassword = confirmPasswordInput.value;
            console.log('  - Tasdiqlash paroli kiritildi:', confirmPassword ? '***' : '(bo\'sh)');
        } else {
            console.error('❌ confirmPasswordInput topilmadi!');
            showToast('❌ Parol tasdiqlash maydoni topilmadi');
            return;
        }
        
        await handleRegister(fullName, username, password, confirmPassword);
    }
}

// ========== PASSWORD TOGGLE ==========
let passwordVisible = false;
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        passwordVisible = !passwordVisible;
        if (passwordInput) passwordInput.type = passwordVisible ? 'text' : 'password';
        if (confirmPasswordInput) confirmPasswordInput.type = passwordVisible ? 'text' : 'password';
        togglePasswordBtn.classList.toggle('show-password', passwordVisible);
    });
}

// ========== EVENT LISTENERS ==========
const themeBtn = document.getElementById('themeBtn');
const toggleFormLink = document.getElementById('toggleFormLink');
const toggleFormLink2 = document.getElementById('toggleFormLink2');

if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
if (toggleFormLink) toggleFormLink.addEventListener('click', toggleForm);
if (toggleFormLink2) toggleFormLink2.addEventListener('click', toggleForm);
if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

// Enter tugmasi
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && submitBtn && !submitBtn.disabled) {
        submitBtn.click();
    }
});

// ========== BOSHLANG'ICH HOLAT ==========
if (confirmGroup) {
    confirmGroup.style.maxHeight = '0';
    confirmGroup.style.opacity = '0';
    confirmGroup.style.transform = 'scaleY(0.8) translateY(-10px)';
    confirmGroup.style.marginBottom = '0';
    confirmGroup.style.visibility = 'hidden';
    confirmGroup.style.overflow = 'hidden';
}

if (nameGroup) {
    nameGroup.style.maxHeight = '0';
    nameGroup.style.opacity = '0';
    nameGroup.style.visibility = 'hidden';
    nameGroup.style.overflow = 'hidden';
}

// ========== SESSION TEKSHIRISH ==========
(async function checkSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log('✅ Session mavjud, home ga yo\'naltirilmoqda...');
            window.location.href = '../home/';
        }
    } catch (error) {
        console.error('❌ Session tekshirish xatosi:', error);
    }
})();

console.log('✅ MRgram Login - Tayyor!');
