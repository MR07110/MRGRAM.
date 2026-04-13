// assets/js/modules/auth/auth-login.js
// 📏 ~55 qator
// Auth Login Moduli

import eventBus from '../../core/event-bus.js';
import { AUTH_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { AUTH_ERRORS } from '../../constants/errors.js';

class AuthLoginModule {
    constructor() {
        this.active = false;
    }

    init() {
        eventBus.on(AUTH_EVENTS.LOGIN, this.handle.bind(this));
        console.log('✅ Auth Login moduli tayyor');
    }

    handle({ username, password, remember = false }) {
        console.log('🔐 Login urinish:', username);

        if (username === 'demo' && password === '123456') {
            const demoUser = {
                uid: 'demo123',
                username: 'demo',
                name: 'Demo User',
                email: 'demo@mrgram.user',
                photoURL: ''
            };
            this.onSuccess(demoUser, remember);
            return;
        }

        if (this.active) return;

        if (!username || !password) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: AUTH_ERRORS.INVALID_CREDENTIALS,
                type: 'error'
            });
            return;
        }

        this.active = true;
        const rid = `login_${Date.now()}`;

        eventBus.emit(UI_EVENTS.LOADER_SHOW, {
            id: 'login',
            msg: 'Kirmoqda...'
        });

        const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '');
        const email = `${cleanUsername}@mrgram.user`;

        eventBus.emit('auth:login:request', {
            email,
            password,
            requestId: rid
        });

        eventBus.once(`auth:login:${rid}:success`, (user) => {
            this.onSuccess(user, remember);
        });

        eventBus.once(`auth:login:${rid}:error`, (error) => {
            this.onError(error);
        });
    }

    onSuccess(user, remember) {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'login' });

        if (remember) {
            localStorage.setItem('mrgram_remember', 'true');
        }
        localStorage.setItem('mrgram_user', JSON.stringify(user));

        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '✅ Xush kelibsiz!',
            type: 'success'
        });

        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'authPage' });
        eventBus.emit(UI_EVENTS.PAGE_OPEN, { id: 'mainApp' });
        eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user, status: 'login' });
    }

    onError(error) {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'login' });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error.message || AUTH_ERRORS.INVALID_CREDENTIALS,
            type: 'error'
        });
    }

    destroy() {
        eventBus.off(AUTH_EVENTS.LOGIN, this.handle);
    }
}

export default new AuthLoginModule();
