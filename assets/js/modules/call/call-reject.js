// assets/js/modules/call/call-reject.js
// 📏 ~30 qator
// Call Reject Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, REALTIME_EVENTS, UI_EVENTS } from '../../constants/events.js';

class CallRejectModule {
    constructor() {
        this.pending = null;
    }

    init() {
        eventBus.on(CALL_EVENTS.REJECT, this.reject.bind(this));
        eventBus.on(CALL_EVENTS.INCOMING, data => { this.pending = data; });
        eventBus.on(CALL_EVENTS.END, () => { this.pending = null; });
        console.log('✅ Call Reject moduli tayyor');
    }

    reject() {
        if (!this.pending) return;
        const { callId } = this.pending;
        eventBus.emit(REALTIME_EVENTS.UPDATE, { path: `calls/${callId}`, data: { status: 'rejected', rejectedAt: Date.now() } });
        eventBus.emit(UI_EVENTS.SOUND_PLAY, { sound: 'red-btn.mp3', loop: false });
        eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'incoming-call-modal' });
        eventBus.emit(UI_EVENTS.SOUND_STOP, {});
        this.pending = null;
    }

    destroy() {
        eventBus.off(CALL_EVENTS.REJECT, this.reject);
    }
}

export default new CallRejectModule();
