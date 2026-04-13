// assets/js/modules/call/call-accept.js
// 📏 ~35 qator
// Call Accept Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, REALTIME_EVENTS, UI_EVENTS } from '../../constants/events.js';

class CallAcceptModule {
    constructor() {
        this.pending = null;
    }

    init() {
        eventBus.on(CALL_EVENTS.ACCEPT, this.accept.bind(this));
        eventBus.on(CALL_EVENTS.INCOMING, data => { this.pending = data; });
        eventBus.on(CALL_EVENTS.END, () => { this.pending = null; });
        console.log('✅ Call Accept moduli tayyor');
    }

    accept() {
        if (!this.pending) return;
        const { callId, callerId, isVideo } = this.pending;
        eventBus.emit(REALTIME_EVENTS.UPDATE, { path: `calls/${callId}`, data: { status: 'accepted', acceptedAt: Date.now() } });
        eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'incoming-call-modal' });
        eventBus.emit(UI_EVENTS.SOUND_STOP, {});
        eventBus.emit(CALL_EVENTS.START, { targetId: callerId, isVideo });
        eventBus.emit(CALL_EVENTS.CONNECTED, { targetId: callerId, isVideo });
        this.pending = null;
    }

    destroy() {
        eventBus.off(CALL_EVENTS.ACCEPT, this.accept);
    }
}

export default new CallAcceptModule();
