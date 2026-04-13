// assets/js/modules/call/call-media.js
// 📏 ~55 qator
// Call Media Stream Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, SYSTEM_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CALL_ERRORS } from '../../constants/errors.js';

class CallMediaModule {
    constructor() {
        this.stream = null;
        this.video = true;
        this.audio = true;
        this.mode = 'user';
    }

    init() {
        eventBus.on(CALL_EVENTS.START, this.getMedia.bind(this));
        eventBus.on(CALL_EVENTS.END, this.stop.bind(this));
        eventBus.on(CALL_EVENTS.VIDEO_ON, () => this.toggleVideo(true));
        eventBus.on(CALL_EVENTS.VIDEO_OFF, () => this.toggleVideo(false));
        eventBus.on(CALL_EVENTS.MUTE, () => this.toggleAudio(false));
        eventBus.on(CALL_EVENTS.UNMUTE, () => this.toggleAudio(true));
        console.log('✅ Call Media moduli tayyor');
    }

    async getMedia({ isVideo }) {
        await this.stop();
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo ? { facingMode: this.mode } : false });
            this.video = isVideo;
            this.audio = true;
            eventBus.emit(CALL_EVENTS.STREAM_READY, { stream: this.stream, isVideo });
        } catch (e) {
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: isVideo ? CALL_ERRORS.CAMERA_DENIED : CALL_ERRORS.MICROPHONE_DENIED, type: 'error' });
        }
    }

    toggleVideo(enabled) { if (this.stream) { const t = this.stream.getVideoTracks()[0]; if (t) { this.video = enabled; t.enabled = enabled; } } }
    toggleAudio(enabled) { if (this.stream) { const t = this.stream.getAudioTracks()[0]; if (t) { this.audio = enabled; t.enabled = enabled; } } }

    async switchCamera() {
        if (this.stream && this.video) { this.mode = this.mode === 'user' ? 'environment' : 'user'; await this.getMedia({ isVideo: true }); }
    }

    stop() { if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; } }
    getStream() { return this.stream; }
    destroy() { this.stop(); eventBus.off(CALL_EVENTS.START, this.getMedia); }
}

export default new CallMediaModule();
