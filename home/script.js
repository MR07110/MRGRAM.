// home/script.js - Tablar logikasi (yangilangan)

(function() {
    'use strict';
    
    // ========== ELEMENTLAR ==========
    const tabsWrapper = document.querySelector('.tabs-wrapper');
    const tabs = document.querySelectorAll('.tab');
    const contentList = document.getElementById('contentList');
    
    // ========== STATE ==========
    let currentTab = 'all';
    
    // ========== SCROLL INDIKATOR ==========
    function createScrollIndicators() {
        const container = document.querySelector('.tabs-container');
        if (!container) return;
        
        // Left indicator
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'tabs-scroll-indicator left';
        leftIndicator.style.opacity = '0';
        
        // Right indicator
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'tabs-scroll-indicator';
        rightIndicator.style.opacity = '0';
        
        container.style.position = 'relative';
        container.appendChild(leftIndicator);
        container.appendChild(rightIndicator);
        
        return { leftIndicator, rightIndicator };
    }
    
    function updateScrollIndicators() {
        if (!tabsWrapper) return;
        
        const leftIndicator = document.querySelector('.tabs-scroll-indicator.left');
        const rightIndicator = document.querySelector('.tabs-scroll-indicator:not(.left)');
        
        if (!leftIndicator || !rightIndicator) return;
        
        const canScrollLeft = tabsWrapper.scrollLeft > 0;
        const canScrollRight = tabsWrapper.scrollLeft < (tabsWrapper.scrollWidth - tabsWrapper.clientWidth - 5);
        
        leftIndicator.style.opacity = canScrollLeft ? '1' : '0';
        rightIndicator.style.opacity = canScrollRight ? '1' : '0';
    }
    
    // ========== TABLAR ==========
    function switchTab(tabId) {
        currentTab = tabId;
        
        // Tab aktivligini yangilash
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle('active', isActive);
            
            // Aktiv tabni ko'rinadigan qilish
            if (isActive) {
                scrollToTab(tab);
            }
        });
        
        // Kontentni yangilash
        loadContent(tabId);
        
        // Saqlash
        localStorage.setItem('mrgram_active_tab', tabId);
    }
    
    function scrollToTab(tab) {
        if (!tabsWrapper || !tab) return;
        
        const tabRect = tab.getBoundingClientRect();
        const wrapperRect = tabsWrapper.getBoundingClientRect();
        
        // Tab to'liq ko'rinadigan qilish
        if (tabRect.left < wrapperRect.left) {
            tabsWrapper.scrollLeft -= (wrapperRect.left - tabRect.left) - 16;
        } else if (tabRect.right > wrapperRect.right) {
            tabsWrapper.scrollLeft += (tabRect.right - wrapperRect.right) + 16;
        }
        
        updateScrollIndicators();
    }
    
    // ========== KONTENT YUKLASH ==========
    function loadContent(tabId) {
        if (!contentList) return;
        
        const demoData = {
            all: [
                { type: 'chat', name: 'Demo User', message: 'Salom! Qalaysan?', time: '12:34', unread: 2, online: true },
                { type: 'chat', name: 'Fazlulloh', message: 'MRGRAM zo\'r ishlayapti!', time: 'Kecha', unread: 0, online: true },
                { type: 'group', name: 'Dasturchilar', message: 'Yangi loyiha haqida', time: '14:20', members: 156, unread: 5 },
                { type: 'channel', name: 'MR GRAM Yangiliklari', message: 'Yangi versiya chiqdi!', time: '09:15', subscribers: 1200 },
                { type: 'chat', name: 'Ali', message: 'Ko\'rishguncha!', time: 'Dushanba', unread: 0, online: false },
                { type: 'bot', name: 'MR Bot', message: 'Salom! Men yordamchi botman', time: '08:00', verified: true }
            ],
            chats: [
                { type: 'chat', name: 'Demo User', message: 'Salom! Qalaysan?', time: '12:34', unread: 2, online: true },
                { type: 'chat', name: 'Fazlulloh', message: 'MRGRAM zo\'r ishlayapti!', time: 'Kecha', unread: 0, online: true },
                { type: 'chat', name: 'Ali', message: 'Ko\'rishguncha!', time: 'Dushanba', unread: 0, online: false }
            ],
            groups: [
                { type: 'group', name: 'Dasturchilar', message: 'Yangi loyiha haqida', time: '14:20', members: 156, unread: 5 },
                { type: 'group', name: 'Geymerlar', message: 'Bugun oqshom o\'ynaymizmi?', time: 'Kecha', members: 89, unread: 0 }
            ],
            channels: [
                { type: 'channel', name: 'MR GRAM Yangiliklari', message: 'Yangi versiya chiqdi!', time: '09:15', subscribers: 1200 },
                { type: 'channel', name: 'Texnologiya', message: 'AI trendlari 2026', time: 'Kecha', subscribers: 3400 }
            ],
            bots: [
                { type: 'bot', name: 'MR Bot', message: 'Salom! Men yordamchi botman', time: '08:00', verified: true },
                { type: 'bot', name: 'Tarjimon Bot', message: 'Matn tarjima qilish uchun yuboring', time: 'Kecha', verified: true }
            ]
        };
        
        const items = demoData[tabId] || demoData.all;
        renderContent(items);
    }
    
    function renderContent(items) {
        if (!contentList) return;
        
        let html = '';
        
        items.forEach(item => {
            const avatarContent = item.type === 'group' ? '👥' : 
                                 (item.type === 'channel' ? '📢' : 
                                 (item.type === 'bot' ? '🤖' : 
                                 MRGRAM.ui.getInitials(item.name)));
            
            const avatarClass = `item-avatar ${item.type}`;
            
            const badgeHtml = item.type === 'group' 
                ? `<span class="item-badge">${item.members} a'zo</span>`
                : (item.type === 'channel' 
                    ? `<span class="item-badge">${MRGRAM.ui.formatNumber(item.subscribers)} obuna</span>`
                    : (item.type === 'bot' && item.verified 
                        ? `<span class="item-badge verified">✓</span>`
                        : ''));
            
            const statusHtml = (item.type === 'chat' || item.type === 'bot')
                ? `<span class="item-status ${item.online ? 'online' : ''}"></span>`
                : '';
            
            html += `
                <div class="list-item" data-type="${item.type}" data-name="${item.name}">
                    <div class="${avatarClass}">${avatarContent}</div>
                    <div class="item-info">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            ${badgeHtml}
                            <span class="item-time">${item.time}</span>
                        </div>
                        <div class="item-message">${item.message}</div>
                        <div class="item-meta">
                            ${statusHtml}
                            ${item.unread ? `<span class="unread-badge">${item.unread}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        contentList.innerHTML = html;
        
        // Elementlarga event qo'shish
        contentList.querySelectorAll('.list-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const name = item.dataset.name;
                MRGRAM.ui.showToast(`${name} ochildi (demo)`, 'info');
            });
        });
    }
    
    // ========== TAB QO'SHISH (DINAMIK) ==========
    function addTab(tabId, tabName) {
        if (!tabsWrapper) return;
        
        // Tab mavjudligini tekshirish
        if (document.querySelector(`.tab[data-tab="${tabId}"]`)) return;
        
        const newTab = document.createElement('button');
        newTab.className = 'tab';
        newTab.dataset.tab = tabId;
        newTab.textContent = tabName;
        
        newTab.addEventListener('click', () => switchTab(tabId));
        
        tabsWrapper.appendChild(newTab);
        
        // Tabs ro'yxatini yangilash
        window.tabs = document.querySelectorAll('.tab');
    }
    
    // ========== EVENT LISTENERS ==========
    function initEventListeners() {
        // Tab scroll
        tabsWrapper?.addEventListener('scroll', () => {
            updateScrollIndicators();
        });
        
        // Tablar
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                switchTab(tabId);
            });
        });
        
        // Window resize
        window.addEventListener('resize', MRGRAM.ui.debounce(() => {
            updateScrollIndicators();
            
            // Aktiv tabni qayta ko'rsatish
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                scrollToTab(activeTab);
            }
        }, 100));
        
        // Touch events for swipe
        let startX;
        tabsWrapper?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        tabsWrapper?.addEventListener('touchend', (e) => {
            if (!startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            // Swipe left/right
            if (Math.abs(diff) > 50) {
                const direction = diff > 0 ? 1 : -1;
                tabsWrapper.scrollLeft += direction * 150;
                updateScrollIndicators();
            }
            
            startX = null;
        });
    }
    
    // ========== SAVED TAB RESTORE ==========
    function restoreLastTab() {
        const savedTab = localStorage.getItem('mrgram_active_tab') || 'all';
        switchTab(savedTab);
    }
    
    // ========== INIT ==========
    function init() {
        createScrollIndicators();
        initEventListeners();
        restoreLastTab();
        
        // Qo'shimcha tablar qo'shish (ixtiyoriy)
        // addTab('bots', 'Botlar');
        
        // Scroll indikatorlarni yangilash
        setTimeout(updateScrollIndicators, 100);
        
        console.log('✅ Home page tabs initialized!');
    }
    
    init();
    
})();
