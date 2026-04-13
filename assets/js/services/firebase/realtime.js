// assets/js/services/firebase/realtime.js
// 📏 ~45 qator
// Firebase Realtime Service

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, update, remove, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { FIREBASE_CONFIG } from '../../constants/config.js';

class FirebaseRealtimeService {
    constructor() { this.db = null; this.listeners = new Map(); }
    init() { if (!this.db) { const app = initializeApp(FIREBASE_CONFIG, 'realtime'); this.db = getDatabase(app); } }

    async set(path, data) { this.init(); await set(ref(this.db, path), { ...data, updatedAt: serverTimestamp() }); return data; }
    async get(path) { this.init(); const s = await get(ref(this.db, path)); return s.exists() ? s.val() : null; }
    async update(path, data) { this.init(); await update(ref(this.db, path), data); return data; }
    async delete(path) { this.init(); await remove(ref(this.db, path)); return true; }

    subscribe(path, cb) {
        this.init(); const id = `${path}_${Date.now()}`;
        const unsub = onValue(ref(this.db, path), s => cb(s.val()));
        this.listeners.set(id, { path, unsub }); return id;
    }

    unsubscribe(id) { const l = this.listeners.get(id); if (l) { l.unsub(); this.listeners.delete(id); return true; } return false; }
    unsubscribeAll() { this.listeners.forEach(l => l.unsub()); this.listeners.clear(); }
    async setUserStatus(uid, status) { return this.set(`status/${uid}`, { state: status, lastSeen: serverTimestamp() }); }
}

export default new FirebaseRealtimeService();
