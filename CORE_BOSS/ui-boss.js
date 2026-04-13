// CORE_BOSS/ui-boss.js
// 📏 ~60 qator

import eventBus from './event-bus.js';
import { UI_EVENTS, CHAT_EVENTS, CALL_EVENTS } from '../constants/events.js';

class UIBoss {
    constructor() {
        this.currentPage = null;
        this.theme = 'dark';
        this.sounds = new Map();
    }

    init() {
        this.setupListeners();
        this.preloadSounds();
        this.applyTheme();
        console.log('🎨 UI Boss tayyor');
    }

    setupListeners() {
        eventBus.on(UI_EVENTS.PAGE_OPEN, ({ id, data }) => this.openPage(id, data));
        eventBus.on(UI_EVENTS.PAGE_CLOSE, ({ id }) => this.closePage(id));
        eventBus.on(UI_EVENTS.TOAST_SHOW, ({ msg, type }) => this.showToast(msg, type));
        eventBus.on(UI_EVENTS.MODAL_OPEN, ({ id, data }) => this.openModal(id, data));
        eventBus.on(UI_EVENTS.MODAL_CLOSE, ({ id }) => this.closeModal(id));
        eventBus.on(UI_EVENTS.NEON_PULSE, ({ element }) => this.applyNeonPulse(element));
        eventBus.on(UI_EVENTS.SOUND_PLAY, ({ sound, loop }) => this.playSound(sound, loop));
        eventBus.on(UI_EVENTS.SOUND_STOP, () => this.stopAllSounds());
        eventBus.on(CHAT_EVENTS.MESSAGE_RECEIVED, () => this.glowEffect('chat-container'));
        eventBus.on(CALL_EVENTS.INCOMING, () => this.glowEffect('app-container', 'purple'));
    }

    openPage(id, data) {
        if (this.currentPage) this.closePage(this.currentPage);
        const page = document.getElementById(id);
        if (page) {
            page.style.display = 'flex';
            page.classList.add('animate-fade-in');
            this.currentPage = id;
        }
    }

    closePage(id) {
        const page = document.getElementById(id);
        if (page) page.style.display = 'none';
        if (this.currentPage === id) this.currentPage = null;
    }

    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `glass-toast toast-${type} animate-slide-up`;
        toast.innerHTML = `<span>${msg}</span>`;
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 400px;
            padding: 16px 20px; background: var(--glass-bg); backdrop-filter: var(--glass-blur);
            border-left: 4px solid var(--neon-${type === 'error' ? 'red' : 'cyan'});
            border-radius: var(--border-radius-md); z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    openModal(id, data) {
        let modal = document.getElementById(id);
        if (!modal) modal = this.createModal(id);
        modal.querySelector('.modal-title').textContent = data?.title || '';
        modal.querySelector('.modal-content').innerHTML = data?.content || '';
        modal.style.display = 'flex';
    }

    createModal(id) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'glass-modal';
        modal.style.cssText = `
            position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 9999;
        `;
        modal.innerHTML = `<div class="glass-card" style="max-width:500px; width:90%;">
            <h3 class="modal-title"></h3><div class="modal-content"></div>
            <button class="modal-close btn-icon" style="margin-top:16px;">✕</button>
        </div>`;
        modal.querySelector('.modal-close').onclick = () => this.closeModal(id);
        modal.onclick = (e) => { if (e.target === modal) this.closeModal(id); };
        document.body.appendChild(modal);
        return modal;
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    }

    applyNeonPulse(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) { el.classList.add('animate-neon-pulse'); setTimeout(() => el.classList.remove('animate-neon-pulse'), 1000); }
    }

    glowEffect(elementId, color = 'cyan') {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.boxShadow = `var(--glow-${color})`;
            setTimeout(() => el.style.boxShadow = '', 500);
        }
    }

    playSound(sound, loop = false) {
        const audio = new Audio(`/assets/sounds/${sound}`);
        audio.loop = loop;
        audio.play().catch(() => {});
        if (loop) this.sounds.set(sound, audio);
    }

    stopAllSounds() {
        this.sounds.forEach(a => { a.pause(); a.currentTime = 0; });
        this.sounds.clear();
    }

    applyTheme() {
        document.body.classList.add('theme-dark');
    }

    preloadSounds() {
        ['notification.mp3', 'call-in.mp3', 'call-out.mp3'].forEach(s => {
            new Audio(`/assets/sounds/${s}`).load();
        });
    }
}

export default new UIBoss();
