// assets/js/modules/chat/chat-edit.js
// 📏 ~45 qator
// Chat Edit Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CHAT_ERRORS } from '../../constants/errors.js';
import { APP_CONFIG } from '../../constants/config.js';

class ChatEditModule {
    constructor() {
        this.editing = new Map();
    }

    init() {
        eventBus.on(CHAT_EVENTS.EDIT, this.handle.bind(this));
        console.log('✅ Chat Edit moduli tayyor');
    }

    handle({ chatId, messageId, newText }) {
        if (!chatId || !messageId) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: CHAT_ERRORS.EDIT_FAILED,
                type: 'error'
            });
            return;
        }

        if (!newText || newText.trim() === '') {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: CHAT_ERRORS.MESSAGE_EMPTY,
                type: 'error'
            });
            return;
        }

        if (newText.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: CHAT_ERRORS.MESSAGE_TOO_LONG,
                type: 'error'
            });
            return;
        }

        this.performEdit(chatId, messageId, newText);
    }

    performEdit(chatId, messageId, newText) {
        const rid = `edit_${Date.now()}`;
        this.editing.set(rid, { chatId, messageId, newText });

        eventBus.emit(DATA_EVENTS.UPDATE, {
            collection: `chats/${chatId}/messages`,
            docId: messageId,
            data: {
                text: newText.trim(),
                edited: true,
                editedAt: new Date().toISOString()
            },
            requestId: rid
        });

        eventBus.once(`data:update:${rid}:success`, () => {
            this.onSuccess(rid);
        });

        eventBus.once(`data:update:${rid}:error`, (error) => {
            this.onError(rid, error);
        });
    }

    onSuccess(rid) {
        const { chatId, messageId, newText } = this.editing.get(rid);
        this.editing.delete(rid);

        eventBus.emit(CHAT_EVENTS.MESSAGE_EDITED, { chatId, messageId, newText });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: '✅ Xabar tahrirlandi',
            type: 'success'
        });
    }

    onError(rid, error) {
        this.editing.delete(rid);
        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error?.message || CHAT_ERRORS.EDIT_FAILED,
            type: 'error'
        });
    }

    destroy() {
        eventBus.off(CHAT_EVENTS.EDIT, this.handle);
        this.editing.clear();
    }
}

export default new ChatEditModule();
