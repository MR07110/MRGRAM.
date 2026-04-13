// assets/js/modules/chat/chat-send.js
// 📏 ~70 qator
// Chat Send Moduli

import eventBus from '../../core/event-bus.js';
import { CHAT_EVENTS, DATA_EVENTS, STORAGE_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CHAT_ERRORS } from '../../constants/errors.js';
import { APP_CONFIG } from '../../constants/config.js';

class ChatSendModule {
    constructor() {
        this.sending = false;
        this.pending = new Map();
    }

    init() {
        eventBus.on(CHAT_EVENTS.SEND, this.handle.bind(this));
        console.log('✅ Chat Send moduli tayyor');
    }

    async handle({ chatId, message, type = 'text', replyTo = null }) {
        if (!chatId) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                msg: '❌ Chat topilmadi',
                type: 'error'
            });
            return;
        }

        if (type === 'text') {
            if (!message || message.trim() === '') {
                eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                    msg: CHAT_ERRORS.MESSAGE_EMPTY,
                    type: 'error'
                });
                return;
            }

            if (message.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
                eventBus.emit(UI_EVENTS.TOAST_SHOW, {
                    msg: CHAT_ERRORS.MESSAGE_TOO_LONG,
                    type: 'error'
                });
                return;
            }

            await this.sendText(chatId, message, replyTo);
        } else if (message instanceof File) {
            await this.sendMedia(chatId, message, type, replyTo);
        }
    }

    async sendText(chatId, text, replyTo) {
        this.sending = true;
        const rid = `msg_${Date.now()}`;

        eventBus.emit(CHAT_EVENTS.MESSAGE_SENT, {
            id: rid,
            chatId,
            text: text.trim(),
            type: 'text',
            replyTo,
            status: 'sending',
            pending: true
        });

        eventBus.emit(DATA_EVENTS.SET, {
            collection: 'messages',
            docId: `${chatId}_${rid}`,
            data: {
                chatId,
                text: text.trim(),
                type: 'text',
                replyTo,
                createdAt: new Date().toISOString(),
                status: 'sent'
            },
            requestId: rid
        });

        eventBus.once(`data:set:${rid}:success`, (data) => {
            this.onSuccess(rid, data);
        });

        eventBus.once(`data:set:${rid}:error`, (error) => {
            this.onError(rid, error);
        });
    }

    async sendMedia(chatId, file, type, replyTo) {
        this.sending = true;
        const uploadRid = `upload_${Date.now()}`;
        const msgRid = `msg_${Date.now()}`;

        eventBus.emit(CHAT_EVENTS.MESSAGE_SENT, {
            id: msgRid,
            chatId,
            type,
            file: { name: file.name, size: file.size },
            replyTo,
            status: 'uploading',
            pending: true
        });

        const path = this.getUploadPath(type);

        eventBus.emit(STORAGE_EVENTS.UPLOAD, {
            file,
            path,
            requestId: uploadRid
        });

        eventBus.once(`storage:upload:${uploadRid}:success`, ({ url }) => {
            eventBus.emit(DATA_EVENTS.SET, {
                collection: 'messages',
                docId: `${chatId}_${msgRid}`,
                data: {
                    chatId,
                    type,
                    mediaUrl: url,
                    fileName: file.name,
                    fileSize: file.size,
                    replyTo,
                    createdAt: new Date().toISOString(),
                    status: 'sent'
                },
                requestId: msgRid
            });

            eventBus.once(`data:set:${msgRid}:success`, (data) => {
                this.onSuccess(msgRid, data);
            });

            eventBus.once(`data:set:${msgRid}:error`, (error) => {
                this.onError(msgRid, error);
            });
        });

        eventBus.once(`storage:upload:${uploadRid}:error`, (error) => {
            this.onError(msgRid, error);
        });
    }

    getUploadPath(type) {
        const paths = {
            image: 'images',
            video: 'videos',
            voice: 'voice',
            audio: 'audio',
            file: 'files'
        };
        return paths[type] || 'files';
    }

    onSuccess(requestId, data) {
        this.sending = false;
        this.pending.delete(requestId);

        eventBus.emit(CHAT_EVENTS.MESSAGE_SENT, {
            id: requestId,
            status: 'sent',
            data
        });

        console.log('✅ Xabar yuborildi:', requestId);
    }

    onError(requestId, error) {
        this.sending = false;
        this.pending.delete(requestId);

        eventBus.emit(CHAT_EVENTS.MESSAGE_SENT, {
            id: requestId,
            status: 'error',
            error: error.message
        });

        eventBus.emit(UI_EVENTS.TOAST_SHOW, {
            msg: error.message || CHAT_ERRORS.SEND_FAILED,
            type: 'error'
        });

        console.error('❌ Xabar yuborish xatoligi:', error);
    }

    destroy() {
        eventBus.off(CHAT_EVENTS.SEND, this.handle);
        this.pending.clear();
    }
}

export default new ChatSendModule();
