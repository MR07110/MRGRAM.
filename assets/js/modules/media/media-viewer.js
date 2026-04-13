// assets/js/modules/media/media-viewer.js
// 📏 ~35 qator
// Media Viewer Moduli

import eventBus from '../../core/event-bus.js';
import { MEDIA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class MediaViewerModule {
    constructor() {
        this.history = [];
        this.index = -1;
    }

    init() {
        eventBus.on(MEDIA_EVENTS.VIEW, this.view.bind(this));
        console.log('✅ Media Viewer moduli tayyor');
    }

    view({ url, type, all = [], start = 0 }) {
        if (all.length) { this.history = all; this.index = start; this.showCurrent(); }
        else { this.showSingle(url, type); }
    }

    showCurrent() {
        const m = this.history[this.index];
        if (!m) return;
        const content = m.type === 'image' ? `<img src="${m.url}" style="max-width:100%; border-radius:16px;" />` : `<video src="${m.url}" controls style="max-width:100%;"></video>`;
        const ctrls = `<div style="display:flex; justify-content:space-between; margin-top:16px;"><button ${this.index>0?'':'disabled'} id="viewer-prev">⬅️</button><span>${this.index+1}/${this.history.length}</span><button ${this.index<this.history.length-1?'':'disabled'} id="viewer-next">➡️</button></div>`;
        eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'media-viewer-modal', data: { title: m.name || 'Media', content: content + ctrls } });
        setTimeout(() => {
            document.getElementById('viewer-prev')?.addEventListener('click', () => { this.index--; this.showCurrent(); });
            document.getElementById('viewer-next')?.addEventListener('click', () => { this.index++; this.showCurrent(); });
        }, 100);
    }

    showSingle(url, type) { eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'media-viewer-modal', data: { title: 'Media', content: type==='image'?`<img src="${url}" style="max-width:100%;">`:`<video src="${url}" controls>` } }); }
    destroy() { eventBus.off(MEDIA_EVENTS.VIEW, this.view); }
}

export default new MediaViewerModule();
