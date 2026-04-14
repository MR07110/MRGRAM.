(function() {
    'use strict';

    const state = { activeChat: null, theme: 'dark' };
    const appContainer = document.getElementById('appContainer');
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('resizer');
    const chatList = document.getElementById('chatList');
    const chatTitle = document.getElementById('chatTitle');
    const chatSubtitle = document.getElementById('chatSubtitle');
    const backBtn = document.getElementById('backBtn');
    const fabBtn = document.getElementById('fabBtn');
    const menuBtn = document.getElementById('menuBtn');
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerOverlay = document.getElementById('burgerOverlay');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messagesContainer');

    const demoChats = [
        { name: 'Fazlulloh', msg: 'MRgram zo\'r ishlayapti!', time: '12:34', unread: 2, online: true },
        { name: 'Dasturchilar', msg: 'Yangi loyiha haqida', time: '14:20', unread: 5 },
        { name: 'MRgram Yangiliklari', msg: 'Yangi versiya chiqdi!', time: '09:15' },
        { name: 'Ali', msg: 'Ko\'rishguncha!', time: 'Kecha' },
        { name: 'Bot', msg: 'Salom! Men yordamchi botman', time: '08:00' }
    ];

    // ========== RESIZER ==========
    let isResizing = false, startX, startWidth;

    if (resizer) {
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;
            resizer.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        let newWidth = startWidth + (e.clientX - startX);
        newWidth = Math.max(280, Math.min(500, newWidth));
        sidebar.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            if (resizer) resizer.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });

    // ========== TOAST ==========
    function showToast(msg, dur = 2000) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), dur);
    }

    // ========== BURGER MENU ==========
    function openBurgerMenu() {
        if (burgerMenu) burgerMenu.classList.add('show');
        if (burgerOverlay) burgerOverlay.classList.add('show');
    }

    function closeBurgerMenu() {
        if (burgerMenu) burgerMenu.classList.remove('show');
        if (burgerOverlay) burgerOverlay.classList.remove('show');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                if (mobileMenu) mobileMenu.classList.add('show');
                if (mobileOverlay) mobileOverlay.classList.add('show');
            } else {
                openBurgerMenu();
            }
        });
    }

    if (burgerOverlay) burgerOverlay.addEventListener('click', closeBurgerMenu);
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
        });
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            const sunIcon = document.querySelector('.sun-icon');
            const moonIcon = document.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = state.theme === 'dark' ? 'block' : 'none';
            if (moonIcon) moonIcon.style.display = state.theme === 'light' ? 'block' : 'none';
            showToast(`${state.theme === 'dark' ? 'Tungi' : 'Kunduzgi'} rejim`);
        });
    }

    // ========== RENDER CHATS ==========
    function renderChats() {
        if (!chatList) return;
        chatList.innerHTML = demoChats.map((c, i) => `
            <div class="chat-item" data-name="${c.name}" data-avatar-color="${i}">
                <div class="chat-avatar-list">${c.name[0]}</div>
                <div class="chat-content">
                    <div class="chat-row"><span class="chat-name">${c.name}</span><span class="chat-time">${c.time}</span></div>
                    <div class="chat-last-msg">${c.msg}</div>
                    <div class="chat-meta">
                        ${c.online ? '<span class="chat-status"></span>' : ''}
                        ${c.unread ? `<span class="chat-unread">${c.unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.chat-item').forEach(el => {
            el.addEventListener('click', () => openChat(el.dataset.name));
        });
    }

    function openChat(name) {
        state.activeChat = name;
        if (chatTitle) chatTitle.textContent = name;
        if (chatSubtitle) chatSubtitle.textContent = 'oxirgi ko\'rish yaqinda';
        
        document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
        const active = Array.from(document.querySelectorAll('.chat-item')).find(c => c.dataset.name === name);
        if (active) active.classList.add('active');

        if (window.innerWidth <= 768) {
            if (appContainer) appContainer.classList.add('mobile-chat-active');
        }

        if (messagesContainer) {
            messagesContainer.innerHTML = `<div class="message-placeholder"><span>${name} bilan suhbat</span></div>`;
        }
        showToast(`${name} ochildi`);
        closeBurgerMenu();
    }

    function closeChat() {
        if (window.innerWidth <= 768) {
            if (appContainer) appContainer.classList.remove('mobile-chat-active');
        }
        state.activeChat = null;
    }

    function sendMessage() {
        const text = messageInput ? messageInput.value.trim() : '';
        if (!text) return;
        if (!state.activeChat) { showToast('Avval chat tanlang'); return; }
        const msg = document.createElement('div');
        msg.className = 'message-out';
        msg.textContent = text;
        if (messagesContainer) {
            messagesContainer.appendChild(msg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        if (messageInput) messageInput.value = '';
    }

    // ========== EVENT LISTENERS ==========
    if (backBtn) backBtn.addEventListener('click', closeChat);
    if (fabBtn) fabBtn.addEventListener('click', () => showToast('Yangi xabar'));
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (messageInput) {
        messageInput.addEventListener('keypress', e => { 
            if (e.key === 'Enter') sendMessage(); 
        });
    }

    // Menu item click
    document.querySelectorAll('.burger-item, .menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href !== '#' && !href.includes('logout')) {
                e.preventDefault();
                showToast(`${item.querySelector('span')?.textContent || 'Menyu'} ochilmoqda...`);
                setTimeout(() => { window.location.href = href; }, 500);
            }
            closeBurgerMenu();
            if (mobileMenu) mobileMenu.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
        });
    });

    // Logout
    const logout = () => { 
        if (confirm('Chiqish?')) { 
            localStorage.clear(); 
            location.href = '../'; 
        } 
    };
    
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (mobileMenu) mobileMenu.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            logout();
        });
    }

    // Tablar
    document.querySelectorAll('.desktop-tab, .tab').forEach(t => {
        t.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.desktop-tab, .tab').forEach(tb => tb.classList.remove('active'));
            this.classList.add('active');
            showToast(`${this.textContent} filtri`);
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (appContainer) appContainer.classList.remove('mobile-chat-active');
            if (mobileMenu) mobileMenu.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
        }
    });

    // ESC tugmasi
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBurgerMenu();
            if (mobileMenu) mobileMenu.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
        }
    });

    renderChats();
})();
