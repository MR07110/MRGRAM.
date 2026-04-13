// assets/js/modules/chat/chat-read.js
// 📏 ~50 qator
// Chat Read Receipt Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class ChatReadModule {
    constructor() {
        this.user = null;
        this.activeChat = null;
        this.observer = null;
        this.read = new Set();
    }

    init() {
        eventBus.on('auth:state-changed', ({ user }) => this.user = user);
        eventBus.on(UI_EVENTS.PAGE_OPENED, ({ pageId, data }) => {
            if (pageId === 'chatView') { this.activeChat = data?.chatId; setTimeout(() => this.observe(), 500); }
        });
        eventBus.on(UI_EVENTS.PAGE_CLOSED, ({ pageId }) => {
            if (pageId === 'chatView') { this.activeChat = null; if (this.observer) this.observer.disconnect(); }
        });
        eventBus.on(CHAT_EVENTS.READ, ({ chatId, messageId }) => this.mark(chatId, messageId));
        console.log('✅ Chat Read moduli tayyor');
    }

    observe() {
        if (this.observer) this.observer.disconnect();
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const mid = entry.target.dataset.msgId;
                    if (mid && !this.read.has(mid)) { this.read.add(mid); this.mark(this.activeChat, mid); }
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.msg.them:not([data-read])').forEach(m => this.observer.observe(m));
    }

    mark(chatId, messageId) {
        if (!this.user || !chatId || !messageId) return;
        const rid = `read_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.UPDATE, {
            collection: `chats/${chatId}/messages`,
            docId: messageId,
            data: { [`readBy.${this.user.uid}`]: true, readAt: new Date().toISOString() },
            requestId: rid
        });
        eventBus.once(`data:update:${rid}:success`, () => {
            document.querySelector(`[data-msg-id="${messageId}"]`)?.setAttribute('data-read', 'true');
            eventBus.emit(CHAT_EVENTS.MESSAGE_READ, { chatId, messageId, readBy: this.user.uid });
        });
    }

    destroy() {
        if (this.observer) this.observer.disconnect();
        eventBus.off(CHAT_EVENTS.READ, this.mark);
    }
}

export default new ChatReadModule();
