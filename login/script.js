// login/script.js - FIREBASE AUTH + SUPABASE STORAGE
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
    apiKey: "AIzaSyBhzWWFFgrOH84J2RIW5o7l_8192iPtbOg",
    authDomain: "code-vibe-df610.firebaseapp.com",
    projectId: "code-vibe-df610",
    storageBucket: "code-vibe-df610.firebasestorage.app",
    messagingSenderId: "747762490655",
    appId: "1:747762490655:web:125516814620784cf3a42a",
    measurementId: "G-3QE6F8LWZ1",
    databaseURL: "https://code-vibe-df610-default-rtdb.firebaseio.com"
};

// Firebase init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========== SUPABASE CONFIG (FAQAT MEDIA UCHUN) ==========
const SUPABASE_URL = "https://mujoriozaxjojrgkkars.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11am9yaW96YXhqb2pyZ2trYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjQ1MjQsImV4cCI6MjA5MDU0MDUyNH0.IiCWIT5QU06Wd7fEgRtTkG4IoC5oxyTgRAuWxRf15Zw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const MEDIA_BUCKET = "videos";

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

// ========== USERNAME DAN EMAIL YASASH (FIREBASE UCHUN) ==========
function usernameToEmail(username) {
    const clean = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${clean}@mrgram.firebaseapp.com`;
}

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

// ========== FIREBASE LOGIN ==========
async function handleLogin(username, password) {
    try {
        setLoading(true);
        clearErrors();
        
        const email = usernameToEmail(username);
        console.log('🔐 Firebase Login:', username, '→', email);
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Session saqlash
        localStorage.setItem('mrgram_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || username,
            photoURL: user.photoURL || '../mrgram.svg'
        }));
        
        showToast('✅ Xush kelibsiz!', true);
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => { window.location.href = '../home/'; }, 500);
        
    } catch (error) {
        console.error('❌ Login xatosi:', error);
        
        let errorMsg = 'Username yoki parol noto\'g\'ri';
        if (error.code === 'auth/user-not-found') errorMsg = 'Username topilmadi';
        if (error.code === 'auth/wrong-password') errorMsg = 'Parol noto\'g\'ri';
        if (error.code === 'auth/invalid-email') errorMsg = 'Username noto\'g\'ri formatda';
        
        showToast('❌ ' + errorMsg);
        shakeInput(usernameInput);
        shakeInput(passwordInput);
        setLoading(false);
    }
}

// ========== FIREBASE REGISTER ==========
async function handleRegister(fullName, username, password, confirmPassword) {
    try {
        setLoading(true);
        clearErrors();
        
        // Validatsiya
        if (!fullName || fullName.length < 2) {
            showToast('❌ Ism kamida 2 ta harf');
            shakeInput(fullNameInput);
            setLoading(false);
            return;
        }
        
        if (!username || username.length < 3) {
            showToast('❌ Username kamida 3 ta belgi');
            shakeInput(usernameInput);
            setLoading(false);
            return;
        }
        
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            showToast('❌ Username faqat lotin harflar va raqamlar');
            shakeInput(usernameInput);
            setLoading(false);
            return;
        }
        
        if (!password || password.length < 6) {
            showToast('❌ Parol kamida 6 ta belgi');
            shakeInput(passwordInput);
            setLoading(false);
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('❌ Parollar mos kelmadi');
            shakeInput(passwordInput);
            if (confirmPasswordInput) shakeInput(confirmPasswordInput);
            setLoading(false);
            return;
        }
        
        const email = usernameToEmail(username);
        console.log('📝 Firebase Register:', username, '→', email);
        
        // Firebase da ro'yxatdan o'tish
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Profil yangilash
        await updateProfile(user, {
            displayName: fullName,
            photoURL: '../mrgram.svg'
        });
        
        // Firestore ga foydalanuvchi ma'lumotlarini saqlash
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            fullName: fullName,
            email: email,
            avatar: '../mrgram.svg',
            createdAt: new Date().toISOString(),
            mediaBucket: MEDIA_BUCKET
        });
        
        console.log('✅ Firebase ga saqlandi:', user.uid);
        
        showToast('✅ Ro\'yxatdan o\'tdingiz! Avtomatik kirasiz...', true);
        
        setTimeout(async () => {
            await handleLogin(username, password);
        }, 1500);
        
    } catch (error) {
        console.error('❌ Register xatosi:', error);
        
        let errorMsg = 'Xatolik yuz berdi';
        if (error.code === 'auth/email-already-in-use') errorMsg = 'Bu username band';
        if (error.code === 'auth/weak-password') errorMsg = 'Parol juda oddiy';
        
        showToast('❌ ' + errorMsg);
        shakeInput(usernameInput);
        setLoading(false);
    }
}

// ========== SUBMIT ==========
async function handleSubmit() {
    if (!usernameInput || !passwordInput) {
        showToast('❌ Sahifa yuklanmagan');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || username.length < 3) {
        showToast('❌ Username kamida 3 ta belgi');
        shakeInput(usernameInput);
        return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        showToast('❌ Username faqat lotin harflar va raqamlar');
        shakeInput(usernameInput);
        return;
    }
    
    if (!password) {
        showToast('❌ Parolni kiriting');
        shakeInput(passwordInput);
        return;
    }
    
    if (isLoginMode) {
        await handleLogin(username, password);
    } else {
        if (!fullNameInput) return;
        const fullName = fullNameInput.value.trim();
        let confirmPassword = '';
        if (confirmPasswordInput) confirmPassword = confirmPasswordInput.value;
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

// ========== LOGOUT (Global funksiya) ==========
window.logout = async function() {
    try {
        await signOut(auth);
        localStorage.removeItem('mrgram_user');
        window.location.href = '../login/';
    } catch (error) {
        console.error('Logout xatosi:', error);
    }
};

// ========== EVENT LISTENERS ==========
document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
document.getElementById('toggleFormLink')?.addEventListener('click', toggleForm);
document.getElementById('toggleFormLink2')?.addEventListener('click', toggleForm);
if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && submitBtn && !submitBtn.disabled) submitBtn.click();
});

// ========== BOSHLANG'ICH HOLAT ==========
if (confirmGroup) {
    confirmGroup.style.maxHeight = '0';
    confirmGroup.style.opacity = '0';
    confirmGroup.style.visibility = 'hidden';
    confirmGroup.style.overflow = 'hidden';
}

if (nameGroup) {
    nameGroup.style.maxHeight = '0';
    nameGroup.style.opacity = '0';
    nameGroup.style.visibility = 'hidden';
    nameGroup.style.overflow = 'hidden';
}

// ========== AUTH STATE TEKSHIRISH ==========
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('✅ Firebase Auth:', user.displayName || user.email);
        // Agar login sahifasida bo'lsa, home ga o'tish
        if (window.location.pathname.includes('login')) {
            window.location.href = '../home/';
        }
    } else {
        console.log('❌ Firebase Auth: Kirmagan');
    }
});

// ========== SUPABASE MEDIA FUNKSIYALARI (Global) ==========
window.uploadMedia = async function(file, folder = 'media') {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });
        
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(data.path);
        
    return { url: publicUrl, path: data.path };
};

console.log('✅ MRgram - Firebase Auth + Supabase Storage');
console.log('📦 Media Bucket:', MEDIA_BUCKET);
