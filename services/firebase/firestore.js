// services/firebase/firestore.js
// 📏 ~70 qator

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, onSnapshot, serverTimestamp, arrayUnion, arrayRemove, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { FIREBASE_CONFIG } from '../../constants/config.js';

class FirestoreService {
    constructor() { this.db = null; }
    init() { if (!this.db) { const app = initializeApp(FIREBASE_CONFIG, 'firestore'); this.db = getFirestore(app); } }

    async get(col, id) { this.init(); const d = await getDoc(doc(this.db, col, id)); return d.exists() ? { id: d.id, ...d.data() } : null; }
    async set(col, id, data) { this.init(); const ref = doc(this.db, col, id); await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true }); return { id, ...data }; }
    async update(col, id, data) { this.init(); await updateDoc(doc(this.db, col, id), { ...data, updatedAt: serverTimestamp() }); return { id, ...data }; }
    async delete(col, id) { this.init(); await deleteDoc(doc(this.db, col, id)); return { id, deleted: true }; }
    
    async query(col, queries = []) {
        this.init(); let q = collection(this.db, col);
        queries.forEach(({ field, operator, value }) => {
            if (field === 'orderBy') q = query(q, orderBy(operator, value || 'asc'));
            else if (field === 'limit') q = query(q, limit(operator));
            else q = query(q, where(field, operator, value));
        });
        const snap = await getDocs(q); const r = []; snap.forEach(d => r.push({ id: d.id, ...d.data() })); return r;
    }

    subscribe(col, queries, cb) {
        this.init(); let q = collection(this.db, col);
        queries.forEach(({ field, operator, value }) => { if (field === 'orderBy') q = query(q, orderBy(operator, value)); else if (field !== 'limit') q = query(q, where(field, operator, value)); });
        return onSnapshot(q, s => { const r = []; s.forEach(d => r.push({ id: d.id, ...d.data() })); cb(r); });
    }

    async arrayAdd(col, id, field, val) { this.init(); await updateDoc(doc(this.db, col, id), { [field]: arrayUnion(val) }); }
    async arrayRemove(col, id, field, val) { this.init(); await updateDoc(doc(this.db, col, id), { [field]: arrayRemove(val) }); }
    async increment(col, id, field, val = 1) { this.init(); await updateDoc(doc(this.db, col, id), { [field]: increment(val) }); }
    async getAll(col) { this.init(); const s = await getDocs(collection(this.db, col)); const r = []; s.forEach(d => r.push({ id: d.id, ...d.data() })); return r; }
}

export default new FirestoreService();
