const renderHeader = (title = "MR GRAM") => {
    const headerHTML = `
    <header class="main-header glass">
        <div class="header-left">
            <img src="../mrgram.svg" alt="MR" class="logo-img">
            <h1>${title}</h1>
        </div>
        <div class="header-right">
            <button class="icon-btn theme-toggle" onclick="toggleTheme()" id="theme-btn" title="Rejimni o'zgartirish">
                <svg id="theme-icon" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"></svg>
            </button>

            <button class="icon-btn search-btn">
                <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
            </button>
        </div>
    </header>

    <style>
        .main-header { 
            position: fixed; 
            top: 0; 
            left: 0;
            width: 100%;
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 10px 20px; 
            z-index: 10000; 
            box-sizing: border-box;
            height: 60px;
        }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-img { width: 32px; height: 32px; object-fit: contain; }
        .header-left h1 { font-size: 18px; font-weight: 600; letter-spacing: -0.3px; margin: 0; }
        
        .header-right { display: flex; align-items: center; gap: 12px; }
        .icon-btn { 
            background: none; 
            border: none; 
            color: var(--text); 
            cursor: pointer; 
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
            border-radius: 12px;
        }
        .icon-btn:active { transform: scale(0.85); background: rgba(0,0,0,0.05); }
        [data-theme="dark"] .icon-btn:active { background: rgba(255,255,255,0.05); }

        /* Animatsiya uchun */
        #theme-icon { transition: transform 0.4s ease; }
    </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    updateThemeIcon();
};

const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('mrgram-theme', next);
    updateThemeIcon();
};

const updateThemeIcon = () => {
    const icon = document.getElementById('theme-icon');
    if(!icon) return;
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    // Quyosh va Oy ikonkalari (Feather Icons uslubida)
    if (isDark) {
        // Quyosh belgisi (Light mode ga o'tish uchun)
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else {
        // Oy belgisi (Dark mode ga o'tish uchun)
        icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
};

// Sahifa yuklanishi bilan theme ni tekshirish
(function() {
    const saved = localStorage.getItem('mrgram-theme') || 'light';
    document.body.setAttribute('data-theme', saved);
    // Agar header darhol chizilmasa, updateThemeIcon DOM yuklanganda ishlaydi
})();
