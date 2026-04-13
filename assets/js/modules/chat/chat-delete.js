// assets/js/modules/chat/chat-delete.js
// 📏 ~50 qator
// Chat Delete Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CHAT_ERRORS } from '../../constants/errors.js';

class ChatDeleteModule {
    constructor() {
        this.pending = new Map();
    }

    init() {
        eventBus.on(CHAT_EVENTS.DELETE, this.handle.bind(this));
        console.log('✅ Chat Delete moduli tayyor');
    }

    handle({ chatId, messageId, forEveryone = false }) {
        if (!chatId || !messageId) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: CHAT_ERRORS.DELETE_FAILED,
                type: 'error'
            });
            return;
        }

        if (forEveryone) {
            this.deleteForEveryone(chatId, messageId);
        } else {
            this.deleteForMe(chatId, messageId);
        }
    }

    deleteForMe(chatId, messageId) {
        const rid = `del_me_${Date.now()}`;
        this.pending.set(rid, { chatId, messageId });

        eventBus.emit(DATA_EVENTS.UPDATE, {
            collection: `chats/${chatId}/messages`,
            docId: messageId,
            data: { deletedForMe: true },
            requestId: rid
        });

        this.setupListeners(rid);
    }

    deleteForEveryone(chatId, messageId) {
        const rid = `del_all_${Date.now()}`;
        this.pending.set(rid, { chatId, messageId });

        eventBus.emit(DATA_EVENTS.UPDATE, {
            collection: `chats/${chatId}/messages`,
            docId: messageId,
            data: {
                deletedForEveryone: true,
                text: null,
                mediaUrl: null,
                deletedAt: new Date().toISOString()
            },
            requestId: rid
        });

        this.setupListeners(rid);
    }

    setupListeners(rid) {
        eventBus.once(`data:update:${rid}:success`, () => {
            this.onSuccess(rid);
        });

        eventBus.once(`data:update:${rid}:error`, (error) => {
            this.onError(rid, error);
        });
    }

    onSuccess(rid) {
        const { chatId, messageId } = this.pending.get(rid);
        this.pending.delete(rid);

        eventBus.emit(CHAT_EVENTS.MESSAGE_DELETED, { chatId, messageId });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '✅ Xabar o\'chirildi',
            type: 'success'
        });

        console.log('✅ Xabar o\'chirildi:', messageId);
    }

    onError(rid, error) {
        this.pending.delete(rid);

        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error?.message || CHAT_ERRORS.DELETE_FAILED,
            type: 'error'
        });

        console.error('❌ Xabar o\'chirish xatoligi:', error);
    }

    destroy() {
        eventBus.off(CHAT_EVENTS.DELETE, this.handle);
        this.pending.clear();
    }
}

export default new ChatDeleteModule();
