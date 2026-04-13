// assets/js/services/firebase/auth.js
// 📏 ~50 qator
// Firebase Auth Service

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { FIREBASE_CONFIG } from '../../constants/config.js';

class FirebaseAuthService {
    constructor() { this.auth = null; this.user = null; }
    init() { if (!this.auth) { const app = initializeApp(FIREBASE_CONFIG, 'auth'); this.auth = getAuth(app); } }

    async register(email, pass, userData) {
        this.init();
        const c = await createUserWithEmailAndPassword(this.auth, email, pass);
        const name = userData.name || userData.username || email.split('@')[0];
        await updateProfile(c.user, { displayName: name, photoURL: userData.photoURL || '' });
        return { uid: c.user.uid, email: c.user.email, displayName: name, username: userData.username, photoURL: userData.photoURL };
    }

    async login(email, pass) {
        this.init();
        const c = await signInWithEmailAndPassword(this.auth, email, pass);
        return { uid: c.user.uid, email: c.user.email, displayName: c.user.displayName, photoURL: c.user.photoURL };
    }

    async logout() { this.init(); await signOut(this.auth); this.user = null; return true; }
    getCurrentUser() { return this.user; }

    parseError(e) {
        const m = { 'auth/user-not-found': 'Foydalanuvchi topilmadi', 'auth/wrong-password': 'Noto\'g\'ri parol', 'auth/email-already-in-use': 'Email band', 'auth/weak-password': 'Parol kuchsiz', 'auth/invalid-email': 'Noto\'g\'ri email', 'auth/network-request-failed': 'Internet yo\'q' };
        return new Error(m[e.code] || e.message);
    }
}

export default new FirebaseAuthService();
