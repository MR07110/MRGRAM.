// assets/js/modules/chat/chat-typing.js
// 📏 ~45 qator
// Chat Typing Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, UI_EVENTS, REALTIME_EVENTS } from '../../constants/events.js';
import { APP_CONFIG } from '../../constants/config.js';

class ChatTypingModule {
    constructor() {
        this.user = null;
        this.activeChat = null;
        this.timeouts = new Map();
    }

    init() {
        eventBus.on('auth:state-changed', ({ user }) => this.user = user);
        eventBus.on(UI_EVENTS.PAGE_OPENED, ({ pageId, data }) => {
            if (pageId === 'chatView') this.activeChat = data?.chatId;
        });
        eventBus.on(UI_EVENTS.PAGE_CLOSED, ({ pageId }) => {
            if (pageId === 'chatView') this.activeChat = null;
        });
        eventBus.on(CHAT_EVENTS.TYPING_START, this.start.bind(this));
        eventBus.on(CHAT_EVENTS.TYPING_STOP, this.stop.bind(this));
        console.log('✅ Chat Typing moduli tayyor');
    }

    start({ chatId }) {
        if (!this.user || !chatId || this.activeChat !== chatId) return;
        const key = `${chatId}_${this.user.uid}`;
        if (this.timeouts.has(key)) clearTimeout(this.timeouts.get(key));
        this.send(chatId, true);
        this.timeouts.set(key, setTimeout(() => this.stop({ chatId }), APP_CONFIG.TYPING_TIMEOUT));
    }

    stop({ chatId }) {
        if (!this.user || !chatId) return;
        const key = `${chatId}_${this.user.uid}`;
        if (this.timeouts.has(key)) { clearTimeout(this.timeouts.get(key)); this.timeouts.delete(key); }
        this.send(chatId, false);
    }

    send(chatId, typing) {
        eventBus.emit(REALTIME_EVENTS.SET, {
            path: `typing/${chatId}/${this.user.uid}`,
            data: { userId: this.user.uid, name: this.user.name, typing, time: Date.now() }
        });
    }

    destroy() {
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts.clear();
        eventBus.off(CHAT_EVENTS.TYPING_START, this.start);
        eventBus.off(CHAT_EVENTS.TYPING_STOP, this.stop);
    }
}

export default new ChatTypingModule();
