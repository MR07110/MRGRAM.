// assets/js/utils/format.js
// 📏 ~35 qator
// Formatlash funksiyalari

export function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
}

export function formatDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Kecha';
    return d.toLocaleDateString('uz', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatNumber(num) { return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || '0'; }
export function truncate(str, len = 50) { return str?.length > len ? str.substring(0, len) + '...' : str; }

export default { formatTime, formatFileSize, formatDate, formatNumber, truncate };
