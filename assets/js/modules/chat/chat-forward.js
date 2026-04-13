// assets/js/modules/chat/chat-forward.js
// 📏 ~55 qator
// Chat Forward Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CHAT_ERRORS } from '../../constants/errors.js';

class ChatForwardModule {
    constructor() {
        this.pending = new Map();
    }

    init() {
        eventBus.on(CHAT_EVENTS.FORWARD, this.handle.bind(this));
        console.log('✅ Chat Forward moduli tayyor');
    }

    handle({ fromChatId, messageId, toChatId }) {
        if (!fromChatId || !messageId || !toChatId) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: CHAT_ERRORS.FORWARD_FAILED,
                type: 'error'
            });
            return;
        }

        if (fromChatId === toChatId) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: '❌ Xabarni o\'ziga forward qilib bo\'lmaydi',
                type: 'error'
            });
            return;
        }

        this.fetchAndForward(fromChatId, messageId, toChatId);
    }

    fetchAndForward(fromChatId, messageId, toChatId) {
        const fetchId = `fetch_${Date.now()}`;

        eventBus.emit(DATA_EVENTS.GET, {
            collection: `chats/${fromChatId}/messages`,
            docId: messageId,
            requestId: fetchId
        });

        eventBus.once(`data:get:${fetchId}:success`, (message) => {
            if (!message) {
                eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                    msg: '❌ Xabar topilmadi',
                    type: 'error'
                });
                return;
            }
            this.forwardMessage(toChatId, message);
        });

        eventBus.once(`data:get:${fetchId}:error`, (error) => {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: error?.message || CHAT_ERRORS.FORWARD_FAILED,
                type: 'error'
            });
        });
    }

    forwardMessage(toChatId, originalMessage) {
        const rid = `fwd_${Date.now()}`;
        this.pending.set(rid, { toChatId });

        const forwardedData = {
            chatId: toChatId,
            text: originalMessage.text || null,
            type: originalMessage.type || 'text',
            mediaUrl: originalMessage.mediaUrl || null,
            fileName: originalMessage.fileName || null,
            fileSize: originalMessage.fileSize || null,
            isForwarded: true,
            originalFrom: originalMessage.from || null,
            originalTime: originalMessage.createdAt || null,
            createdAt: new Date().toISOString(),
            status: 'sent'
        };

        eventBus.emit(DATA_EVENTS.SET, {
            collection: 'messages',
            docId: `${toChatId}_${rid}`,
            data: forwardedData,
            requestId: rid
        });

        eventBus.once(`data:set:${rid}:success`, () => {
            this.onSuccess(rid);
        });

        eventBus.once(`data:set:${rid}:error`, (error) => {
            this.onError(rid, error);
        });
    }

    onSuccess(rid) {
        const { toChatId } = this.pending.get(rid);
        this.pending.delete(rid);

        eventBus.emit(CHAT_EVENTS.MESSAGE_SENT, { chatId: toChatId, isForwarded: true });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '↗️ Xabar forward qilindi',
            type: 'success'
        });
    }

    onError(rid, error) {
        this.pending.delete(rid);
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error?.message || CHAT_ERRORS.FORWARD_FAILED,
            type: 'error'
        });
    }

    destroy() {
        eventBus.off(CHAT_EVENTS.FORWARD, this.handle);
        this.pending.clear();
    }
}

export default new ChatForwardModule();
