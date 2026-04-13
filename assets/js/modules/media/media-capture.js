// assets/js/modules/media/media-capture.js
// 📏 ~40 qator
// Media Capture Moduli

import eventBus from '../../core/event-bus.js';
import { MEDIA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class MediaCaptureModule {
    constructor() {
        this.stream = null;
    }

    init() {
        eventBus.on(MEDIA_EVENTS.CAPTURE, this.capture.bind(this));
        console.log('✅ Media Capture moduli tayyor');
    }

    async capture({ type = 'photo' }) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: type === 'video' });
            eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'camera-modal', data: { title: type === 'photo' ? '📸 Rasm' : '🎥 Video', content: `<video id="camera-preview" autoplay playsinline style="width:100%;"></video><button id="capture-btn">${type==='photo'?'📸':'⏺️'}</button>` } });
            setTimeout(() => {
                document.getElementById('camera-preview').srcObject = this.stream;
                document.getElementById('capture-btn')?.addEventListener('click', () => type === 'photo' ? this.takePhoto() : null);
            }, 100);
        } catch { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '❌ Kameraga ruxsat berilmadi', type: 'error' }); }
    }

    takePhoto() {
        const v = document.getElementById('camera-preview'); if (!v) return;
        const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        c.toBlob(b => { const f = new File([b], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' }); eventBus.emit(MEDIA_EVENTS.UPLOAD_START, { file: f, type: 'image' }); this.stop(); eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'camera-modal' }); }, 'image/jpeg');
    }

    stop() { if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; } }
    destroy() { this.stop(); eventBus.off(MEDIA_EVENTS.CAPTURE, this.capture); }
}

export default new MediaCaptureModule();
