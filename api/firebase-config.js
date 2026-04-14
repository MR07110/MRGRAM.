// api/firebase-config.js
// MRgram Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase konfiguratsiyasi
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

// Firebase ni ishga tushirish
const app = initializeApp(firebaseConfig);

// Xizmatlarni export qilish
export const db = getFirestore(app);           // Firestore (matnli xabarlar)
export const rtdb = getDatabase(app);          // Realtime Database
export const auth = getAuth(app);              // Authentication
export const storage = getStorage(app);        // Storage (agar kerak bo'lsa)
export const analytics = getAnalytics(app);    // Analytics

// Default export
export default app;

// ========== YORDAMCHI FUNKSIYALAR ==========

// Firestore ga xabar saqlash
export async function saveMessageToFirestore(chatId, message) {
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    
    try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const docRef = await addDoc(messagesRef, {
            ...message,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, error: null };
    } catch (error) {
        console.error('Firestore saqlash xatosi:', error);
        return { id: null, error };
    }
}

// Realtime Database ga xabar saqlash (real-time uchun)
export async function saveMessageToRealtime(chatId, message) {
    const { ref, push, set, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    
    try {
        const messagesRef = ref(rtdb, `messages/${chatId}`);
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, {
            ...message,
            timestamp: Date.now()
        });
        return { id: newMessageRef.key, error: null };
    } catch (error) {
        console.error('Realtime saqlash xatosi:', error);
        return { id: null, error };
    }
}

// Xabarni tinglash (real-time)
export function subscribeToMessages(chatId, callback) {
    const { ref, onValue, query, orderByChild, limitToLast } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    
    const messagesRef = ref(rtdb, `messages/${chatId}`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(100));
    
    return onValue(messagesQuery, (snapshot) => {
        const messages = [];
        snapshot.forEach((child) => {
            messages.push({
                id: child.key,
                ...child.val()
            });
        });
        callback(messages);
    });
}

// Chat ma'lumotlarini olish
export async function getChatInfo(chatId) {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    
    try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        
        if (chatSnap.exists()) {
            return { data: { id: chatSnap.id, ...chatSnap.data() }, error: null };
        } else {
            return { data: null, error: 'Chat topilmadi' };
        }
    } catch (error) {
        console.error('Chat olish xatosi:', error);
        return { data: null, error };
    }
}

// Foydalanuvchi ma'lumotlarini saqlash
export async function saveUserProfile(userId, profile) {
    const { doc, setDoc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, profile, { merge: true });
        return { error: null };
    } catch (error) {
        console.error('Profil saqlash xatosi:', error);
        return { error };
    }
}

// Online status
export function setUserOnlineStatus(userId, isOnline) {
    const { ref, set, onDisconnect } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    
    const statusRef = ref(rtdb, `presence/${userId}`);
    const connectedRef = ref(rtdb, '.info/connected');
    
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({
                online: false,
                lastSeen: Date.now()
            });
            set(statusRef, {
                online: true,
                lastSeen: Date.now()
            });
        }
    });
}

// Typing indicator
export function setTypingStatus(chatId, userId, isTyping) {
    const { ref, set } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    
    const typingRef = ref(rtdb, `typing/${chatId}/${userId}`);
    
    if (isTyping) {
        set(typingRef, {
            typing: true,
            timestamp: Date.now()
        });
    } else {
        set(typingRef, null);
    }
}

console.log('✅ Firebase config yuklandi');
