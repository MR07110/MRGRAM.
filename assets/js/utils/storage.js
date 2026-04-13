// assets/js/utils/storage.js
// 📏 ~30 qator
// LocalStorage yordamchilari

export function set(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch { return false; }
}

export function get(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
}

export function remove(key) { localStorage.removeItem(key); }

export function clear() { localStorage.clear(); }

export function setSession(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
}

export function getSession(key, defaultValue = null) {
    try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; }
    catch { return defaultValue; }
}

export default { set, get, remove, clear, setSession, getSession };
