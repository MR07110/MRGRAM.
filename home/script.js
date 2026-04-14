// home/script.js - MRGRAM Home Logic | Full Responsive

(function() {
    'use strict';
    
    // ========== ELEMENTLAR ==========
    const menuBtn = document.getElementById('menuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const tabs = document.querySelectorAll('.tab');
    const contentList = document.getElementById('contentList');
    const searchBtn = document.getElementById('searchBtn');
    const themeToggleDesktop = document.getElementById('themeToggleDesktop');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const logoutBtns = [document.getElementById('logoutBtnDesktop'), document.getElementById('logoutBtnMobile')];
    
    let currentTab = 'all';
    
    // ========== SIDEBAR ==========
    function openSidebar() {
        mobileSidebar?.classList.add('open');
        sidebarOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        mobileSidebar?.classList.remove('open');
        sidebarOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ========== TABLAR ==========
    function switchTab(tabId) {
        currentTab = tabId;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        loadContent(tabId);
        localStorage.setItem('mrgram_active_tab', tabId);
    }
    
    // ========== KONTENT ==========
    function loadContent(tabId) {
        const data = {
            all: [
                { type: 'chat', name: 'Demo User', msg: 'Salom! Qalaysan?', time: '12:34', unread: 2, online: true },
                { type: 'chat', name: 'Fazlulloh', msg: 'MRGRAM zo\'r ishlayapti!', time: 'Kecha', unread: 0, online: true },
                { type: 'group', name: 'Dasturchilar', msg: 'Yangi loyiha haqida', time: '14:20', members: 156, unread: 5 },
                { type: 'channel', name: 'MR GRAM', msg: 'Yangi versiya chiqdi!', time: '09:15', subs: 1200 },
                { type: 'bot', name: 'MR Bot', msg: 'Salom! Men yordamchi botman', time: '08:00', verified: true }
            ],
            chats: [
                { type: 'chat', name: 'Demo User', msg: 'Salom! Qalaysan?', time: '12:34', unread: 2, online: true },
                { type: 'chat', name: 'Fazlulloh', msg: 'MRGRAM zo\'r ishlayapti!', time: 'Kecha', unread: 0, online: true }
            ],
            groups: [
                { type: 'group', name: 'Dasturchilar', msg: 'Yangi loyiha haqida', time: '14:20', members: 156, unread: 5 }
            ],
            channels: [
                { type: 'channel', name: 'MR GRAM', msg: 'Yangi versiya chiqdi!', time: '09:15', subs: 1200 }
            ],
            bots: [
                { type: 'bot', name: 'MR Bot', msg: 'Salom! Men yordamchi botman', time: '08:00', verified: true }
            ]
        };
        renderContent(data[tabId] || data.all);
    }
    
    function renderContent(items) {
        if (!contentList) return;
        
        contentList.innerHTML = items.map(item => {
            const av = item.type === 'group' ? '👥' : (item.type === 'channel' ? '📢' : (item.type === 'bot' ? '🤖' : MRGRAM.ui.getInitials(item.name)));
            const badge = item.type === 'group' ? `<span class="item-badge">${item.members} a'zo</span>` 
                : (item.type === 'channel' ? `<span class="item-badge">${MRGRAM.ui.formatNumber(item.subs)}</span>` 
                : (item.verified ? '<span class="item-badge verified">✓</span>' : ''));
            const status = (item.type === 'chat' || item.type === 'bot') ? `<span class="item-status ${item.online ? 'online' : ''}"></span>` : '';
            const unread = item.unread ? `<span class="unread-badge">${item.unread}</span>` : '';
            
            return `<div class="list-item" data-name="${item.name}">
                <div class="item-avatar ${item.type}">${av}</div>
                <div class="item-info">
                    <div class="item-header">
                        <span class="item-name">${item.name}</span>${badge}
                        <span class="item-time">${item.time}</span>
                    </div>
                    <div class="item-message">${item.msg}</div>
                    <div class="item-meta">${status}${unread}</div>
                </div>
            </div>`;
        }).join('');
        
        contentList.querySelectorAll('.list-item').forEach(i => {
            i.addEventListener('click', () => MRGRAM.ui.showToast(`${i.dataset.name} ochildi (demo)`));
        });
    }
    
    // ========== USER ==========
    function loadUser() {
        const u = MRGRAM.user.get();
        if (u) {
            const n = document.getElementById('sidebarName');
            const un = document.getElementById('sidebarUsername');
            if (n) n.textContent = u.name || 'Foydalanuvchi';
            if (un) un.textContent = '@' + (u.username || 'user');
        }
    }
    
    // ========== THEME ==========
    function updateThemeText() {
        const isDark = MRGRAM.theme.get() === 'dark';
        const text = isDark ? 'Light mode' : 'Dark mode';
        if (themeToggleDesktop) themeToggleDesktop.querySelector('span').textContent = text;
        if (themeToggleMobile) themeToggleMobile.querySelector('span').textContent = text;
    }
    
    // ========== EVENT LISTENERS ==========
    menuBtn?.addEventListener('click', openSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);
    searchBtn?.addEventListener('click', () => MRGRAM.ui.showToast('🔍 Qidiruv (demo)'));
    
    tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
    
    themeToggleDesktop?.addEventListener('click', () => { MRGRAM.theme.toggle(); updateThemeText(); });
    themeToggleMobile?.addEventListener('click', () => { MRGRAM.theme.toggle(); updateThemeText(); closeSidebar(); });
    
    logoutBtns.forEach(btn => {
        btn?.addEventListener('click', () => { if (confirm('Chiqishni xohlaysizmi?')) MRGRAM.user.logout(); });
    });
    
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
    
    // ========== INIT ==========
    MRGRAM.ui.setPageTitle('Bosh sahifa');
    loadUser();
    updateThemeText();
    switchTab(localStorage.getItem('mrgram_active_tab') || 'all');
    
    console.log('✅ Home page ready!');
})();
