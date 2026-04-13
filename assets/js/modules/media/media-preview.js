// assets/js/modules/media/media-preview.js
// 📏 ~40 qator
// Media Preview Moduli

import eventBus from '../../core/event-bus.js';
import { MEDIA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class MediaPreviewModule {
    constructor() {
        this.current = null;
    }

    init() {
        eventBus.on(MEDIA_EVENTS.PREVIEW, this.preview.bind(this));
        console.log('✅ Media Preview moduli tayyor');
    }

    preview({ url, type, name, size }) {
        this.current = { url, type, name, size };
        const formatted = this.format(size || 0);
        const content = type === 'image' ? `<img src="${url}" style="max-width:100%; border-radius:16px;" />` :
                       type === 'video' ? `<video src="${url}" controls style="max-width:100%; border-radius:16px;"></video>` :
                       `<audio src="${url}" controls style="width:100%;"></audio><p>${formatted}</p>`;
        eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'media-preview-modal', data: { title: name || type, content } });
    }

    format(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b/1024).toFixed(1) + ' KB'; return (b/1048576).toFixed(1) + ' MB'; }
    destroy() { eventBus.off(MEDIA_EVENTS.PREVIEW, this.preview); }
}

export default new MediaPreviewModule();
