// assets/js/modules/auth/auth-register.js
// 📏 ~65 qator
// Auth Register Moduli

import eventBus from '../../core/event-bus.js';
import { AUTH_EVENTS, UI_EVENTS, STORAGE_EVENTS } from '../../constants/events.js';
import { AUTH_ERRORS } from '../../constants/errors.js';

class AuthRegisterModule {
    constructor() {
        this.active = false;
    }

    init() {
        eventBus.on(AUTH_EVENTS.REGISTER, this.handle.bind(this));
        console.log('✅ Auth Register moduli tayyor');
    }

    handle({ username, password, confirm, name, avatar }) {
        console.log('📝 Register urinish:', { username, name });

        if (this.active) return;

        if (!username || username.length < 3) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: '❌ Username kamida 3 ta belgi!',
                type: 'error'
            });
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: '❌ Username faqat harf, raqam va _ bo\'lishi kerak!',
                type: 'error'
            });
            return;
        }

        if (!password || password.length < 6) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: AUTH_ERRORS.WEAK_PASSWORD,
                type: 'error'
            });
            return;
        }

        if (password !== confirm) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: AUTH_ERRORS.PASSWORDS_NOT_MATCH,
                type: 'error'
            });
            return;
        }

        this.active = true;

        const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '');
        const email = `${cleanUsername}@mrgram.user`;
        const rid = `reg_${Date.now()}`;

        eventBus.emit(UI_EVENTS.LOADER_SHOW, {
            id: 'reg',
            msg: 'Ro\'yxatdan o\'tmoqda...'
        });

        if (avatar) {
            this.uploadAvatarThenRegister(email, password, cleanUsername, name, avatar, rid);
        } else {
            this.doRegister(email, password, cleanUsername, name, null, rid);
        }
    }

    uploadAvatarThenRegister(email, password, username, name, avatar, rid) {
        const uploadId = `av_${Date.now()}`;

        eventBus.emit(STORAGE_EVENTS.UPLOAD, {
            file: avatar,
            path: 'avatars',
            requestId: uploadId
        });

        eventBus.once(`storage:upload:${uploadId}:success`, ({ url }) => {
            this.doRegister(email, password, username, name, url, rid);
        });

        eventBus.once(`storage:upload:${uploadId}:error`, () => {
            this.doRegister(email, password, username, name, null, rid);
        });
    }

    doRegister(email, password, username, name, photoURL, rid) {
        const userData = {
            username: username,
            name: name || username,
            photoURL: photoURL || '',
            createdAt: new Date().toISOString()
        };

        eventBus.emit('auth:register:request', {
            email,
            password,
            userData,
            requestId: rid
        });

        eventBus.once(`auth:register:${rid}:success`, (user) => {
            this.onSuccess(user);
        });

        eventBus.once(`auth:register:${rid}:error`, (error) => {
            this.onError(error);
        });
    }

    onSuccess(user) {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'reg' });

        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '✅ Ro\'yxatdan o\'tdingiz!',
            type: 'success'
        });

        localStorage.setItem('mrgram_user', JSON.stringify(user));

        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'authPage' });
        eventBus.emit(UI_EVENTS.PAGE_OPEN, { id: 'mainApp' });
        eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user, status: 'register' });
    }

    onError(error) {
        this.active = false;
        eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'reg' });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error.message || AUTH_ERRORS.INVALID_CREDENTIALS,
            type: 'error'
        });
    }

    destroy() {
        eventBus.off(AUTH_EVENTS.REGISTER, this.handle);
    }
}

export default new AuthRegisterModule();
