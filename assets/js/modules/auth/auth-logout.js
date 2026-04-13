// assets/js/modules/auth/auth-logout.js
// 📏 ~45 qator
// Auth Logout Moduli

import eventBus from '../../core/event-bus.js';
import { AUTH_EVENTS, UI_EVENTS } from '../../constants/events.js';

class AuthLogoutModule {
    constructor() {
        this.active = false;
    }

    init() {
        eventBus.on(AUTH_EVENTS.LOGOUT, this.handle.bind(this));
        console.log('✅ Auth Logout moduli tayyor');
    }

    handle({ confirm = true } = {}) {
        if (this.active) return;

        if (confirm) {
            this.showConfirmModal();
        } else {
            this.performLogout();
        }
    }

    showConfirmModal() {
        eventBus.emit(UI_EVENTS.MODAL_OPEN, {
            id: 'logout-confirm-modal',
            data: {
                title: 'Chiqish',
                content: 'Tizimdan chiqishni xohlaysizmi?'
            }
        });

        const handler = () => {
            this.performLogout();
            eventBus.off('ui:modal:confirm', handler);
        };

        eventBus.on('ui:modal:confirm', handler);
    }

    performLogout() {
        this.active = true;
        const rid = `logout_${Date.now()}`;

        eventBus.emit(UI_EVENTS.LOADER_SHOW, {
            id: 'logout',
            msg: 'Chiqmoqda...'
        });

        eventBus.emit('auth:logout:request', {
            requestId: rid
        });

        eventBus.once(`auth:logout:${rid}:success`, () => {
            this.onSuccess();
        });

        eventBus.once(`auth:logout:${rid}:error`, (error) => {
            this.onError(error);
        });
    }

    onSuccess() {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'logout' });

        localStorage.removeItem('mrgram_user');
        localStorage.removeItem('mrgram_remember');
        sessionStorage.clear();

        eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'logout-confirm-modal' });
        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'mainApp' });
        eventBus.emit(UI_EVENTS.PAGE_OPEN, { id: 'authPage' });
        eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user: null, status: 'logout' });

        console.log('✅ Logout muvaffaqiyatli');
    }

    onError(error) {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'logout' });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '❌ Chiqishda xatolik yuz berdi!',
            type: 'error'
        });
        console.error('❌ Logout xatolik:', error);
    }

    destroy() {
        eventBus.off(AUTH_EVENTS.LOGOUT, this.handle);
    }
}

export default new AuthLogoutModule();
