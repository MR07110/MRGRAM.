// assets/js/modules/voice/voice-upload.js
// 📏 ~35 qator
// Voice Upload Moduli

import eventBus from '../../core/event-bus.js';
import { VOICE_EVENTS, STORAGE_EVENTS, UI_EVENTS } from '../../constants/events.js';

class VoiceUploadModule {
    constructor() {
        this.uploading = false;
    }

    init() {
        eventBus.on(VOICE_EVENTS.RECORD_COMPLETE, this.upload.bind(this));
        console.log('✅ Voice Upload moduli tayyor');
    }

    upload({ blob, duration }) {
        if (this.uploading) return;
        this.uploading = true;
        eventBus.emit(UI_EVENTS.LOADER_SHOW, { id: 'voice-upload', msg: 'Ovoz yuklanmoqda...' });
        const rid = `voice_${Date.now()}`;
        const file = new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
        eventBus.emit(STORAGE_EVENTS.UPLOAD, { file, path: 'voice', requestId: rid });
        eventBus.once(`storage:upload:${rid}:success`, ({ url }) => {
            this.uploading = false;
            eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'voice-upload' });
            eventBus.emit(VOICE_EVENTS.RECORD_COMPLETE, { url, duration });
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ Ovoz yuklandi', type: 'success' });
        });
        eventBus.once(`storage:upload:${rid}:error`, () => {
            this.uploading = false;
            eventBus.emit(UI_EVENTS.LOADER_HIDE, { id: 'voice-upload' });
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '❌ Yuklashda xatolik', type: 'error' });
        });
    }

    destroy() { eventBus.off(VOICE_EVENTS.RECORD_COMPLETE, this.upload); }
}

export default new VoiceUploadModule();
