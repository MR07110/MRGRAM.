// assets/js/core/ui-boss.js
// 📏 ~80 qator
// UI Boss - Interfeys boshqaruvi

import eventBus from './event-bus.js';
import { UI_EVENTS, CHAT_EVENTS, CALL_EVENTS } from '../constants/events.js';
import { DEFAULTS } from '../constants/config.js';

class UIBoss {
    constructor() {
        this.currentPage = null;
        this.modals = new Map();
        this.toasts = new Map();
        this.loaders = new Map();
        this.theme = DEFAULTS.THEME;
        this.sounds = new Map();
        this.isInitialized = false;
        
        console.log('🎨 UI BOSS yaratildi');
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🎨 UI Boss ishga tushmoqda...');
        
        this.setupEventListeners();
        this.loadSavedTheme();
        this.preloadSounds();
        
        this.isInitialized = true;
        console.log('✅ UI Boss tayyor');
        
        eventBus.emit(UI_EVENTS.READY);
    }

    setupEventListeners() {
        eventBus.on(UI_EVENTS.PAGE_OPEN, this.openPage.bind(this));
        eventBus.on(UI_EVENTS.PAGE_CLOSE, this.closePage.bind(this));
        eventBus.on(UI_EVENTS.MODAL_OPEN, this.openModal.bind(this));
        eventBus.on(UI_EVENTS.MODAL_CLOSE, this.closeModal.bind(this));
        eventBus.on(UI_EVENTS.TOAST_SHOW, this.showToast.bind(this));
        eventBus.on(UI_EVENTS.LOADER_SHOW, this.showLoader.bind(this));
        eventBus.on(UI_EVENTS.LOADER_HIDE, this.hideLoader.bind(this));
        eventBus.on(UI_EVENTS.THEME_CHANGE, this.changeTheme.bind(this));
        eventBus.on(UI_EVENTS.NEON_PULSE, this.applyNeonPulse.bind(this));
        eventBus.on(UI_EVENTS.SOUND_PLAY, this.playSound.bind(this));
        eventBus.on(UI_EVENTS.SOUND_STOP, this.stopAllSounds.bind(this));
        
        eventBus.on(CHAT_EVENTS.MESSAGE_RECEIVED, () => this.glowEffect('chat-container'));
        eventBus.on(CALL_EVENTS.INCOMING, () => this.glowEffect('app-container', 'purple'));
        
        console.log('📡 UI Boss eventlarni tinglayapti');
    }

    openPage({ id, data }) {
        const page = document.getElementById(id);
        if (!page) {
            console.error(`❌ Sahifa topilmadi: ${id}`);
            return;
        }
        
        if (this.currentPage) {
            const oldPage = document.getElementById(this.currentPage);
            if (oldPage) oldPage.style.display = 'none';
        }
        
        page.style.display = 'flex';
        this.currentPage = id;
        
        eventBus.emit(UI_EVENTS.PAGE_OPENED, { pageId: id, data });
        console.log(`📄 Sahifa ochildi: ${id}`);
    }

    closePage({ id }) {
        const page = document.getElementById(id);
        if (page) page.style.display = 'none';
        
        if (this.currentPage === id) this.currentPage = null;
        
        eventBus.emit(UI_EVENTS.PAGE_CLOSED, { pageId: id });
        console.log(`📄 Sahifa yopildi: ${id}`);
    }

    openModal({ id, data }) {
        let modal = document.getElementById(id);
        
        if (!modal) {
            modal = this.createModal(id);
        }
        
        const titleEl = modal.querySelector('.modal-title');
        const contentEl = modal.querySelector('.modal-content');
        
        if (titleEl && data?.title) titleEl.textContent = data.title;
        if (contentEl && data?.content) contentEl.innerHTML = data.content;
        
        modal.style.display = 'flex';
        this.modals.set(id, modal);
        
        eventBus.emit(UI_EVENTS.MODAL_OPENED, { modalId: id, data });
    }

    createModal(id) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-content"></div>
            </div>
        `;
        
        modal.querySelector('.modal-close').onclick = () => this.closeModal({ id });
        modal.onclick = (e) => { if (e.target === modal) this.closeModal({ id }); };
        
        document.body.appendChild(modal);
        return modal;
    }

    closeModal({ id }) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.style.display = 'none';
            this.modals.delete(id);
            eventBus.emit(UI_EVENTS.MODAL_CLOSED, { modalId: id });
        }
    }

    showToast({ msg, type = 'info', duration = 3000 }) {
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${msg}</span>
            <button class="toast-close">✕</button>
        `;
        
        toast.querySelector('.toast-close').onclick = () => this.hideToast(toastId);
        
        document.body.appendChild(toast);
        this.toasts.set(toastId, toast);
        
        setTimeout(() => this.hideToast(toastId), duration);
    }

    hideToast(toastId) {
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.remove();
            this.toasts.delete(toastId);
        }
    }

    showLoader({ id = 'global-loader', msg = 'Yuklanmoqda...' }) {
        let loader = document.getElementById(id);
        
        if (!loader) {
            loader = document.createElement('div');
            loader.id = id;
            loader.className = 'loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <span class="loader-message">${msg}</span>
                </div>
            `;
            document.body.appendChild(loader);
        }
        
        loader.style.display = 'flex';
        this.loaders.set(id, loader);
    }

    hideLoader({ id = 'global-loader' }) {
        const loader = this.loaders.get(id);
        if (loader) {
            loader.style.display = 'none';
            this.loaders.delete(id);
        }
    }

    changeTheme({ theme }) {
        const validThemes = ['dark', 'light', 'neon'];
        if (!validThemes.includes(theme)) return;
        
        document.body.classList.remove(`theme-${this.theme}`);
        document.body.classList.add(`theme-${theme}`);
        this.theme = theme;
        
        localStorage.setItem('mrgram_theme', theme);
        eventBus.emit(UI_EVENTS.THEME_CHANGED, { theme });
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('mrgram_theme') || DEFAULTS.THEME;
        this.changeTheme({ theme: saved });
    }

    applyNeonPulse({ element }) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            el.classList.add('animate-neon-pulse');
            setTimeout(() => el.classList.remove('animate-neon-pulse'), 1000);
        }
    }

    glowEffect(elementId, color = 'cyan') {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.boxShadow = `var(--glow-${color})`;
            setTimeout(() => el.style.boxShadow = '', 500);
        }
    }

    playSound({ sound, loop = false }) {
        const audio = new Audio(`/assets/sounds/${sound}`);
        audio.loop = loop;
        audio.play().catch(() => {});
        
        if (loop) this.sounds.set(sound, audio);
    }

    stopAllSounds() {
        this.sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.sounds.clear();
    }

    preloadSounds() {
        const sounds = ['notification.mp3', 'call-in.mp3', 'call-out.mp3'];
        sounds.forEach(sound => {
            new Audio(`/assets/sounds/${sound}`).load();
        });
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getCurrentTheme() {
        return this.theme;
    }

    report() {
        return {
            initialized: this.isInitialized,
            currentPage: this.currentPage,
            theme: this.theme,
            activeModals: this.modals.size,
            activeToasts: this.toasts.size,
            activeLoaders: this.loaders.size
        };
    }
}

const uiBoss = new UIBoss();

export default uiBoss;
