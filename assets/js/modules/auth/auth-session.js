// assets/js/modules/auth/auth-session.js
// 📏 ~55 qator
// Auth Session Moduli

import eventBus from '../../core/event-bus.js';
import { AUTH_EVENTS, SYSTEM_EVENTS, UI_EVENTS, REALTIME_EVENTS } from '../../constants/events.js';

class AuthSessionModule {
    constructor() {
        this.user = null;
        this.timer = null;
    }

    init() {
        this.checkSaved();
        eventBus.on(AUTH_EVENTS.STATE_CHANGED, this.onChange.bind(this));
        eventBus.on(SYSTEM_EVENTS.READY, () => this.startCheck());
        console.log('✅ Auth Session moduli tayyor');
    }

    checkSaved() {
        const saved = localStorage.getItem('mrgram_user');
        const remember = localStorage.getItem('mrgram_remember');

        if (saved && remember === 'true') {
            try {
                this.user = JSON.parse(saved);
                eventBus.emit(AUTH_EVENTS.STATE_CHANGED, {
                    user: this.user,
                    status: 'auto-login'
                });
                console.log('🔄 Avtomatik kirish:', this.user.username);
            } catch (error) {
                console.error('❌ Saqlangan sessiyani o\'qishda xatolik:', error);
                this.clearSession();
            }
        }
    }

    onChange({ user, status }) {
        this.user = user;

        if (user) {
            eventBus.emit(REALTIME_EVENTS.SET, {
                path: `status/${user.uid}`,
                data: {
                    state: 'online',
                    lastSeen: Date.now()
                }
            });
            this.startCheck();
        } else {
            this.stopCheck();
        }

        console.log(`👤 Auth holati: ${status}`);
    }

    startCheck() {
        this.stopCheck();
        this.timer = setInterval(() => this.validate(), 5 * 60 * 1000);
    }

    stopCheck() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    validate() {
        if (!this.user) return;

        const rid = `session_${Date.now()}`;

        eventBus.emit('auth:refresh-token', { requestId: rid });

        eventBus.once(`auth:refresh-token:${rid}:error`, () => {
            this.onSessionExpired();
        });
    }

    onSessionExpired() {
        this.clearSession();

        eventBus.emit(AUTH_EVENTS.SESSION_EXPIRED);
        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'mainApp' });
        eventBus.emit(UI_EVENTS.PAGE_OPEN, { id: 'authPage' });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '⚠️ Sessiya muddati tugadi. Qaytadan kiring.',
            type: 'warning',
            duration: 5000
        });

        console.log('🔒 Sessiya tugadi');
    }

    clearSession() {
        this.user = null;
        localStorage.removeItem('mrgram_user');
        localStorage.removeItem('mrgram_remember');
        sessionStorage.clear();
        this.stopCheck();
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return this.user !== null;
    }

    destroy() {
        this.stopCheck();
        eventBus.off(AUTH_EVENTS.STATE_CHANGED, this.onChange);
    }
}

export default new AuthSessionModule();
