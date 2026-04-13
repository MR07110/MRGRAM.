// assets/js/utils/helpers.js
// 📏 ~35 qator
// Yordamchi funksiyalar

export function showToast(msg) {
    let toast = document.getElementById('customToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'customToast';
        toast.style.cssText = 'position:fixed; bottom:100px; left:20px; right:20px; background:#1c1c1e; color:white; text-align:center; padding:14px; border-radius:30px; z-index:10000; backdrop-filter:blur(20px); border:1px solid var(--accent); transition:0.3s; opacity:0;';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 2000);
}

export function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

export function getAvatarColor(username) {
    if (!username) return 'hsl(200, 65%, 35%)';
    let hash = 0;
    for (let i = 0; i < username.length; i++) hash = ((hash << 5) - hash) + username.charCodeAt(i);
    return `hsl(${Math.abs(hash % 360)}, 65%, 35%)`;
}

export function getInitial(name) { return name ? name.charAt(0).toUpperCase() : '?'; }

export function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

export function throttle(fn, limit) {
    let inThrottle;
    return (...args) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } };
}

export default { showToast, escapeHtml, getAvatarColor, getInitial, debounce, throttle };
