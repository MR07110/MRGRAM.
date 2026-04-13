// CORE_BOSS/module-loader.js
// 📏 ~60 qator

import eventBus from './event-bus.js';
import { MODULE_EVENTS } from '../constants/events.js';

class ModuleLoader {
    constructor() { this.loaded = new Map(); }

    async loadModule(name) {
        if (this.loaded.has(name)) return this.loaded.get(name);
        const loaders = {
            authLogin: () => import('./modules/auth/auth-login.js'),
            authRegister: () => import('./modules/auth/auth-register.js'),
            authLogout: () => import('./modules/auth/auth-logout.js'),
            authSession: () => import('./modules/auth/auth-session.js'),
            chatSend: () => import('./modules/chat/chat-send-message.js'),
            chatReceive: () => import('./modules/chat/chat-receive-message.js'),
            chatDelete: () => import('./modules/chat/chat-delete-message.js'),
            chatEdit: () => import('./modules/chat/chat-edit-message.js'),
            chatForward: () => import('./modules/chat/chat-forward-message.js'),
            chatTyping: () => import('./modules/chat/chat-typing-indicator.js'),
            chatRead: () => import('./modules/chat/chat-read-receipt.js'),
            callDialer: () => import('./modules/call/call-dialer.js'),
            callWebRTC: () => import('./modules/call/call-webrtc-connection.js'),
            callMedia: () => import('./modules/call/call-media-stream.js'),
            callUI: () => import('./modules/call/call-ui-handler.js'),
            callAccept: () => import('./modules/call/call-accept.js'),
            callReject: () => import('./modules/call/call-reject.js'),
            callEnd: () => import('./modules/call/call-end.js'),
            voiceRecorder: () => import('./modules/voice/voice-recorder.js'),
        };
        try {
            const m = await loaders[name]();
            if (m.default?.init) m.default.init();
            this.loaded.set(name, m.default);
            eventBus.emit(MODULE_EVENTS.REGISTERED, { name });
            return m.default;
        } catch (e) {
            eventBus.emit(MODULE_EVENTS.ERROR, { name, error: e });
            return null;
        }
    }

    async loadAll() {
        const names = ['authLogin', 'authRegister', 'authLogout', 'authSession', 'chatSend', 'chatReceive', 'chatDelete', 'chatEdit', 'chatForward', 'chatTyping', 'chatRead', 'callDialer', 'callWebRTC', 'callMedia', 'callUI', 'callAccept', 'callReject', 'callEnd', 'voiceRecorder'];
        return Promise.all(names.map(n => this.loadModule(n)));
    }

    report() { return { loaded: this.loaded.size, modules: [...this.loaded.keys()] }; }
}

export default new ModuleLoader();
