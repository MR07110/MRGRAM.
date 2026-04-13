// assets/js/modules/call/call-end.js
// 📏 ~40 qator
// Call End Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, REALTIME_EVENTS, UI_EVENTS } from '../../constants/events.js';

class CallEndModule {
    constructor() {
        this.activeCall = null;
    }

    init() {
        eventBus.on(CALL_EVENTS.END, this.end.bind(this));
        eventBus.on(CALL_EVENTS.CONNECTED, data => { this.activeCall = data; });
        eventBus.on(CALL_EVENTS.DISCONNECTED, () => { this.activeCall = null; });
        console.log('✅ Call End moduli tayyor');
    }

    end({ reason = 'ended' } = {}) {
        if (!this.activeCall) return;
        const { callId } = this.activeCall;
        if (callId) {
            eventBus.emit(REALTIME_EVENTS.UPDATE, { path: `calls/${callId}`, data: { status: 'ended', endedAt: Date.now(), reason } });
        }
        this.cleanup();
        eventBus.emit(UI_EVENTS.SOUND_PLAY, { sound: 'abonent-stop.mp3', loop: false });
        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'callContainer' });
        eventBus.emit(UI_EVENTS.SOUND_STOP, {});
        eventBus.emit(CALL_EVENTS.STREAM_STOP);
        eventBus.emit(CALL_EVENTS.CONNECTION_CLOSE);
        this.activeCall = null;
    }

    cleanup() {
        eventBus.emit(CALL_EVENTS.STREAM_STOP);
    }

    destroy() {
        eventBus.off(CALL_EVENTS.END, this.end);
        this.activeCall = null;
    }
}

export default new CallEndModule();
