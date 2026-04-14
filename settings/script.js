document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderHeader === 'function') {
        renderHeader("MR DASHBOARD");
    }
});

// Keshni tozalash funksiyasi (Pentium RAM-ni tejash uchun)
async function clearAppCache() {
    if (confirm("Brauzer keshini tozalab, RAMni bo'shatamizmi?")) {
        const names = await caches.keys();
        for (let name of names) {
            await caches.delete(name);
        }
        localStorage.clear(); // Hamma narsani tozalash
        alert("Tizim optimallashdi! Sahifa qayta yuklanadi.");
        window.location.reload();
    }
}
