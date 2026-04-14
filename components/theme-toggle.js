const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', target);
    localStorage.setItem('mrgram-theme', target);
};

// Global yuklash
(function() {
    const saved = localStorage.getItem('mrgram-theme') || 'light';
    document.body.setAttribute('data-theme', saved);
})();
