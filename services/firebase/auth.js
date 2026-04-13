// services/firebase/auth.js
// 📏 ~70 qator

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updatePassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { FIREBASE_CONFIG } from '../../constants/config.js';

class FirebaseAuthService {
    constructor() { this.auth = null; this.user = null; }
    init() { if (!this.auth) { const app = initializeApp(FIREBASE_CONFIG, 'auth'); this.auth = getAuth(app); } }

    async register(email, pass, name = '', photo = '') {
        this.init(); const c = await createUserWithEmailAndPassword(this.auth, email, pass);
        if (name || photo) await updateProfile(c.user, { displayName: name, photoURL: photo });
        return this.formatUser(c.user);
    }

    async login(email, pass) { this.init(); const c = await signInWithEmailAndPassword(this.auth, email, pass); return this.formatUser(c.user); }
    async logout() { this.init(); await signOut(this.auth); this.user = null; return true; }
    async updateProfile(updates) { this.init(); if (this.auth.currentUser) await updateProfile(this.auth.currentUser, updates); }
    async updatePassword(pass) { this.init(); if (this.auth.currentUser) await updatePassword(this.auth.currentUser, pass); }

    onAuthChange(cb) {
        this.init();
        return onAuthStateChanged(this.auth, u => {
            this.user = u ? this.formatUser(u) : null;
            cb(this.user);
        });
    }

    formatUser(u) { return u ? { uid: u.uid, email: u.email, name: u.displayName, photo: u.photoURL, verified: u.emailVerified } : null; }
    getCurrentUser() { return this.user; }
    parseError(e) {
        const m = { 'auth/user-not-found': 'Foydalanuvchi topilmadi', 'auth/wrong-password': 'Noto\'g\'ri parol', 'auth/email-already-in-use': 'Email band', 'auth/weak-password': 'Parol kuchsiz', 'auth/network-request-failed': 'Internet yo\'q' };
        return new Error(m[e.code] || e.message);
    }
}

export default new FirebaseAuthService();
