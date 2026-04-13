// assets/js/modules/media/media-upload.js
// 📏 ~45 qator
// Media Upload Moduli

import eventBus from '../../core/event-bus.js';
import { MEDIA_EVENTS, STORAGE_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { UPLOAD_ERRORS } from '../../constants/errors.js';
import { APP_CONFIG } from '../../constants/config.js';

class MediaUploadModule {
    constructor() {
        this.uploads = new Map();
    }

    init() {
        eventBus.on(MEDIA_EVENTS.UPLOAD_START, this.upload.bind(this));
        console.log('✅ Media Upload moduli tayyor');
    }

    upload({ file, type, chatId }) {
        if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: UPLOAD_ERRORS.FILE_TOO_LARGE, type: 'error' });
            return;
        }
        const rid = `upload_${Date.now()}`;
        const path = this.getPath(type || this.getType(file));
        this.uploads.set(rid, { file, type, chatId });
        eventBus.emit(STORAGE_EVENTS.UPLOAD, { file, path, requestId: rid });
        eventBus.emit(UI_EVENTS.LOADER_SHOW, { id: rid, msg: `${file.name} yuklanmoqda...` });
        eventBus.once(`storage:upload:${rid}:success`, ({ url }) => {
            this.uploads.delete(rid);
            eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: rid });
            eventBus.emit(MEDIA_EVENTS.UPLOAD_COMPLETE, { url, file, type, chatId });
        });
        eventBus.once(`storage:upload:${rid}:error`, e => {
            this.uploads.delete(rid);
            eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: rid });
            eventBus.emit(MEDIA_EVENTS.UPLOAD_ERROR, { error: e, file });
        });
    }

    getPath(type) { const p = { image: 'images', video: 'videos', audio: 'audio', voice: 'voice', file: 'files' }; return p[type] || 'files'; }
    getType(file) { if (file.type.startsWith('image/')) return 'image'; if (file.type.startsWith('video/')) return 'video'; if (file.type.startsWith('audio/')) return 'audio'; return 'file'; }
    destroy() { this.uploads.clear(); eventBus.off(MEDIA_EVENTS.UPLOAD_START, this.upload); }
}

export default new MediaUploadModule();
