// assets/js/modules/voice/voice-record.js
// 📏 ~50 qator
// Voice Record Moduli

import eventBus from '../../core/event-bus.js';
import { VOICE_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { VOICE_ERRORS } from '../../constants/errors.js';
import { APP_CONFIG } from '../../constants/config.js';

class VoiceRecordModule {
    constructor() {
        this.recorder = null;
        this.chunks = [];
        this.startTime = null;
        this.active = false;
    }

    init() {
        eventBus.on(VOICE_EVENTS.RECORD_START, this.start.bind(this));
        eventBus.on(VOICE_EVENTS.RECORD_STOP, this.stop.bind(this));
        eventBus.on(VOICE_EVENTS.RECORD_CANCEL, this.cancel.bind(this));
        console.log('✅ Voice Record moduli tayyor');
    }

    async start() {
        if (this.active) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new MediaRecorder(stream);
            this.chunks = [];
            this.recorder.ondataavailable = e => { if (e.data.size) this.chunks.push(e.data); };
            this.recorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: 'audio/webm' });
                const duration = (Date.now() - this.startTime) / 1000;
                stream.getTracks().forEach(t => t.stop());
                if (duration <= APP_CONFIG.MAX_VOICE_DURATION) eventBus.emit(VOICE_EVENTS.RECORD_COMPLETE, { blob, duration, size: blob.size });
            };
            this.recorder.start();
            this.active = true;
            this.startTime = Date.now();
            eventBus.emit(VOICE_EVENTS.RECORD_START);
        } catch {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VOICE_ERRORS.RECORDER_DENIED, type: 'error' });
        }
    }

    stop() { if (this.active && this.recorder) { this.recorder.stop(); this.active = false; } }
    cancel() { if (this.active && this.recorder) { this.chunks = []; this.recorder.stop(); this.active = false; eventBus.emit(VOICE_EVENTS.RECORD_CANCEL); } }
    destroy() { this.cancel(); }
}

export default new VoiceRecordModule();
