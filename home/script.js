// home/script.js - TO'LIQ VERSIYA
// Barcha media funksiyalar bilan

import MediaUploader from '../modules/media-upload.js';
import VoiceRecorder from '../modules/voice-recorder.js';
import VoiceCall from '../modules/voice-call.js';
import VideoCall from '../modules/video-call.js';
import Camera from '../modules/camera.js';

(function() {
    'use strict';

    const state = { 
        activeChat: null, 
        theme: 'dark',
        currentUser: {
            id: 'user123',
            name: 'Fazlulloh',
            phone: '+998 90 123 45 67',
            avatar: '../mrgram.svg'
        }
    };
    
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
    const attachBtn = document.getElementById('attachBtn');
    const callBtn = document.getElementById('callBtn');
    const emojiBtn = document.getElementById('emojiBtn');

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
            showToast(`${state.theme === 'dark' ? '🌙 Tungi' : '☀️ Kunduzgi'} rejim`);
        });
    }

    // ========== MEDIA PICKER ==========
    function showMediaPicker() {
        const overlay = document.createElement('div');
        overlay.className = 'media-picker-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 400;
            display: flex;
            align-items: flex-end;
        `;
        
        const menu = document.createElement('div');
        menu.className = 'media-picker-menu';
        menu.style.cssText = `
            width: 100%;
            background: #1c1c1c;
            border-radius: 20px 20px 0 0;
            padding: 20px;
            animation: slideUp 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        const items = [
            { icon: '📷', label: 'Kamera', action: openCamera },
            { icon: '🖼️', label: 'Rasm', action: pickImage },
            { icon: '🎥', label: 'Video', action: pickVideo },
            { icon: '🎤', label: 'Ovozli xabar', action: recordVoice },
            { icon: '📁', label: 'Fayl', action: pickFile },
            { icon: '📍', label: 'Lokatsiya', action: sendLocation },
            { icon: '👤', label: 'Kontakt', action: shareContact },
            { icon: '🎵', label: 'Musiqa', action: pickMusic }
        ];
        
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        `;
        
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.innerHTML = `
                <div style="font-size: 32px; margin-bottom: 5px;">${item.icon}</div>
                <div style="font-size: 12px; color: #aaa;">${item.label}</div>
            `;
            btn.style.cssText = `
                background: #2a2a2a;
                border: none;
                color: white;
                cursor: pointer;
                padding: 12px 8px;
                border-radius: 12px;
                transition: background 0.2s;
            `;
            btn.onmouseover = () => btn.style.background = '#3a3a3a';
            btn.onmouseout = () => btn.style.background = '#2a2a2a';
            btn.onclick = () => {
                overlay.remove();
                item.action();
            };
            grid.appendChild(btn);
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Bekor qilish';
        cancelBtn.style.cssText = `
            width: 100%;
            padding: 15px;
            background: #2a2a2a;
            border: none;
            color: #e74c3c;
            font-size: 16px;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
        `;
        cancelBtn.onclick = () => overlay.remove();
        
        menu.appendChild(grid);
        menu.appendChild(cancelBtn);
        overlay.appendChild(menu);
        
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
        
        document.body.appendChild(overlay);
    }

    // ========== MEDIA FUNCTIONS ==========
    async function openCamera() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        try {
            showToast('📷 Kamera ochilmoqda...');
            const photo = await Camera.capturePhoto();
            
            if (photo) {
                showToast('📤 Rasm yuklanmoqda...');
                await MediaUploader.sendImage(state.activeChat, state.currentUser, photo);
                showToast('✅ Rasm yuborildi');
            }
        } catch (error) {
            console.log('Kamera bekor qilindi');
        }
    }

    async function pickImage() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        try {
            showToast('📤 Rasm yuklanmoqda...');
            await MediaUploader.sendImage(state.activeChat, state.currentUser);
            showToast('✅ Rasm yuborildi');
        } catch (error) {
            console.log('Rasm tanlash bekor qilindi');
        }
    }

    async function pickVideo() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        try {
            showToast('📤 Video yuklanmoqda...');
            await MediaUploader.sendVideo(state.activeChat, state.currentUser);
            showToast('✅ Video yuborildi');
        } catch (error) {
            console.log('Video tanlash bekor qilindi');
        }
    }

    async function recordVoice() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        await VoiceRecorder.sendVoiceMessage(state.activeChat, state.currentUser);
    }

    async function pickFile() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        try {
            showToast('📤 Fayl yuklanmoqda...');
            await MediaUploader.sendAudio(state.activeChat, state.currentUser);
            showToast('✅ Fayl yuborildi');
        } catch (error) {
            console.log('Fayl tanlash bekor qilindi');
        }
    }

    function sendLocation() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        if (!navigator.geolocation) {
            showToast('❌ Geolokatsiya qo\'llab-quvvatlanmaydi');
            return;
        }
        
        showToast('📍 Lokatsiya olinmoqda...');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationMsg = `📍 Lokatsiya: https://maps.google.com/?q=${latitude},${longitude}`;
                
                const msg = document.createElement('div');
                msg.className = 'message-out';
                msg.innerHTML = `
                    📍 Lokatsiya yuborildi<br>
                    <small style="opacity:0.7;">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</small>
                `;
                messagesContainer.appendChild(msg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                showToast('✅ Lokatsiya yuborildi');
            },
            (error) => {
                showToast('❌ Lokatsiya olishda xatolik');
            }
        );
    }

    function shareContact() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        const msg = document.createElement('div');
        msg.className = 'message-out';
        msg.innerHTML = `
            👤 Kontakt: ${state.currentUser.name}<br>
            <small style="opacity:0.7;">${state.currentUser.phone}</small>
        `;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        showToast('✅ Kontakt yuborildi');
    }

    function pickMusic() {
        showToast('🎵 Musiqa qidirish...');
        // Telegram bot orqali musiqa qidirish
    }

    // ========== CALL FUNCTIONS ==========
    function startVoiceCall() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        VoiceCall.startCall(state.activeChat, false);
    }

    function startVideoCall() {
        if (!state.activeChat) {
            showToast('Avval chat tanlang');
            return;
        }
        
        VideoCall.startCall(state.activeChat, false);
    }

    function showCallOptions() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 400;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            background: #1c1c1c;
            border-radius: 20px;
            padding: 20px;
            width: 280px;
        `;
        
        const options = [
            { icon: '📞', label: 'Ovozli qo\'ng\'iroq', action: startVoiceCall },
            { icon: '📹', label: 'Video qo\'ng\'iroq', action: startVideoCall }
        ];
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `
                <span style="font-size: 24px; margin-right: 15px;">${opt.icon}</span>
                <span>${opt.label}</span>
            `;
            btn.style.cssText = `
                width: 100%;
                padding: 15px;
                background: #2a2a2a;
                border: none;
                color: white;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                border-radius: 12px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            `;
            btn.onclick = () => {
                overlay.remove();
                opt.action();
            };
            menu.appendChild(btn);
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Bekor qilish';
        cancelBtn.style.cssText = `
            width: 100%;
            padding: 15px;
            background: transparent;
            border: 1px solid #444;
            color: #aaa;
            font-size: 16px;
            border-radius: 12px;
            cursor: pointer;
        `;
        cancelBtn.onclick = () => overlay.remove();
        menu.appendChild(cancelBtn);
        
        overlay.appendChild(menu);
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
        
        document.body.appendChild(overlay);
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
    
    // Attach tugmasi
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            if (!state.activeChat) {
                showToast('Avval chat tanlang');
                return;
            }
            showMediaPicker();
        });
    }
    
    // Call tugmasi
    if (callBtn) {
        callBtn.addEventListener('click', () => {
            if (!state.activeChat) {
                showToast('Avval chat tanlang');
                return;
            }
            showCallOptions();
        });
    }
    
    // Emoji tugmasi
    if (emojiBtn) {
        emojiBtn.addEventListener('click', () => {
            showToast('😊 Emoji tez orada...');
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
    
    console.log('✅ MRgram yuklandi - Barcha media funksiyalar tayyor!');
})();
