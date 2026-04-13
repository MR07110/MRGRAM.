// assets/js/modules/call/call-ui.js
// 📏 ~55 qator
// Call UI Handler Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CALL_TEXT } from '../../constants/ui-text.js';

class CallUIModule {
    constructor() {
        this.startTime = null;
        this.timer = null;
        this.active = false;
    }

    init() {
        eventBus.on(CALL_EVENTS.START, this.onStart.bind(this));
        eventBus.on(CALL_EVENTS.CONNECTED, this.onConnected.bind(this));
        eventBus.on(CALL_EVENTS.END, this.onEnd.bind(this));
        eventBus.on(CALL_EVENTS.INCOMING, this.onIncoming.bind(this));
        console.log('✅ Call UI moduli tayyor');
    }

    onStart({ isVideo }) {
        eventBus.emit(UI_EVENTS.PAGE_OPEN, { id: 'callContainer', data: { callType: isVideo ? 'video' : 'audio', status: 'connecting' } });
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: isVideo ? CALL_TEXT.VIDEO_CALL : CALL_TEXT.AUDIO_CALL, type: 'info' });
    }

    onIncoming({ callerName, isVideo }) {
        eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'incoming-call-modal', data: { callerName: callerName || 'User', callType: isVideo ? 'video' : 'audio' } });
        eventBus.emit(UI_EVENTS.SOUND_PLAY, { sound: 'call-in.mp3', loop: true });
    }

    onConnected() {
        this.active = true;
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            if (!this.active) return;
            const e = Math.floor((Date.now() - this.startTime) / 1000);
            eventBus.emit(UI_EVENTS.CALL_DURATION_UPDATE, { duration: `${Math.floor(e/60).toString().padStart(2,'0')}:${(e%60).toString().padStart(2,'0')}` });
        }, 1000);
        eventBus.emit(UI_EVENTS.SOUND_STOP, {});
        eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'incoming-call-modal' });
    }

    onEnd({ reason }) {
        this.active = false;
        if (this.timer) clearInterval(this.timer);
        eventBus.emit(UI_EVENTS.PAGE_CLOSE, { id: 'callContainer' });
        eventBus.emit(UI_EVENTS.SOUND_STOP, {});
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: reason === 'rejected' ? CALL_TEXT.CALL_REJECTED : CALL_TEXT.CALL_ENDED, type: 'info' });
    }

    destroy() { if (this.timer) clearInterval(this.timer); }
}

export default new CallUIModule();
