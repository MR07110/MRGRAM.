// assets/js/modules/chat/chat-receive.js
// 📏 ~65 qator
// Chat Receive Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, UI_EVENTS, REALTIME_EVENTS } from '../../constants/events.js';
import { APP_CONFIG } from '../../constants/config.js';

class ChatReceiveModule {
    constructor() {
        this.activeChats = new Map();
        this.messageCache = new Map();
    }

    init() {
        eventBus.on(UI_EVENTS.PAGE_OPENED, this.onPageOpened.bind(this));
        eventBus.on(UI_EVENTS.PAGE_CLOSED, this.onPageClosed.bind(this));
        eventBus.on(CHAT_EVENTS.RECEIVE, this.onNewMessage.bind(this));
        console.log('✅ Chat Receive moduli tayyor');
    }

    onPageOpened({ pageId, data }) {
        if (pageId !== 'chatView' || !data?.chatId) return;

        const { chatId } = data;

        if (this.activeChats.has(chatId)) return;

        this.activeChats.set(chatId, { chatId, openedAt: Date.now() });
        this.loadMessages(chatId);
        this.subscribeToMessages(chatId);

        console.log(`📨 Chat tinglanmoqda: ${chatId}`);
    }

    onPageClosed({ pageId }) {
        if (pageId !== 'chatView') return;

        this.activeChats.forEach((_, chatId) => {
            this.unsubscribeFromMessages(chatId);
        });

        this.activeChats.clear();
        console.log('📨 Chat tinglash to\'xtatildi');
    }

    loadMessages(chatId) {
        const rid = `load_${chatId}_${Date.now()}`;

        eventBus.emit(DATA_EVENTS.QUERY, {
            collection: 'messages',
            queries: [
                { field: 'chatId', operator: '==', value: chatId },
                { field: 'orderBy', operator: 'createdAt', value: 'asc' },
                { field: 'limit', operator: 50 }
            ],
            requestId: rid
        });

        eventBus.once(`data:query:${rid}:success`, (messages) => {
            this.messageCache.set(chatId, messages);

            eventBus.emit(CHAT_EVENTS.MESSAGE_RECEIVED, {
                chatId,
                messages,
                isInitial: true
            });

            console.log(`📨 ${messages.length} ta xabar yuklandi: ${chatId}`);
        });

        eventBus.once(`data:query:${rid}:error`, (error) => {
            console.error(`❌ Xabarlarni yuklashda xatolik: ${chatId}`, error);
        });
    }

    subscribeToMessages(chatId) {
        const subId = `chat_${chatId}`;

        eventBus.emit(REALTIME_EVENTS.SUBSCRIBE, {
            channel: `messages/${chatId}`,
            event: 'new-message',
            requestId: subId
        });

        eventBus.once(`realtime:subscribe:${subId}:success`, ({ subId: id }) => {
            const chat = this.activeChats.get(chatId);
            if (chat) chat.subscriptionId = id;
        });
    }

    unsubscribeFromMessages(chatId) {
        const chat = this.activeChats.get(chatId);
        if (chat?.subscriptionId) {
            eventBus.emit(REALTIME_EVENTS.UNSUBSCRIBE, {
                subId: chat.subscriptionId,
                requestId: `unsub_${chatId}`
            });
        }
    }

    onNewMessage({ chatId, message }) {
        if (!chatId || !message) return;

        if (this.activeChats.has(chatId)) {
            const cached = this.messageCache.get(chatId) || [];
            cached.push(message);
            this.messageCache.set(chatId, cached);

            eventBus.emit(CHAT_EVENTS.MESSAGE_RECEIVED, {
                chatId,
                messages: [message],
                isInitial: false
            });

            this.showNotification(chatId, message);
            this.playNotificationSound();
        }

        console.log(`📨 Yangi xabar: ${chatId}`);
    }

    showNotification(chatId, message) {
        const sender = message.from || 'Noma\'lum';
        const text = message.type === 'text' ? message.text : `📎 ${message.type} xabar`;

        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: `${sender}: ${text.substring(0, 50)}`,
            type: 'info',
            duration: 3000
        });
    }

    playNotificationSound() {
        eventBus.emit(UI_EVENTS.SOUND_PLAY, {
            sound: 'notification.mp3',
            loop: false
        });
    }

    getCachedMessages(chatId) {
        return this.messageCache.get(chatId) || [];
    }

    clearCache(chatId = null) {
        if (chatId) {
            this.messageCache.delete(chatId);
        } else {
            this.messageCache.clear();
        }
    }

    destroy() {
        this.activeChats.forEach((_, chatId) => {
            this.unsubscribeFromMessages(chatId);
        });
        this.activeChats.clear();
        this.messageCache.clear();

        eventBus.off(UI_EVENTS.PAGE_OPENED, this.onPageOpened);
        eventBus.off(UI_EVENTS.PAGE_CLOSED, this.onPageClosed);
        eventBus.off(CHAT_EVENTS.RECEIVE, this.onNewMessage);
    }
}

export default new ChatReceiveModule();
