// assets/js/modules/call/call-start.js
// 📏 ~50 qator
// Call Start Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, DATA_EVENTS, REALTIME_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { CALL_ERRORS } from '../../constants/errors.js';

class CallStartModule {
    constructor() {
        this.ringtone = null;
        this.timer = null;
        this.target = null;
    }

    init() {
        eventBus.on(CALL_EVENTS.START, this.start.bind(this));
        eventBus.on(CALL_EVENTS.END, this.cleanup.bind(this));
        eventBus.on(CALL_EVENTS.REJECT, this.cleanup.bind(this));
        console.log('✅ Call Start moduli tayyor');
    }

    start({ targetId, isVideo = false }) {
        if (this.target) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: CALL_ERRORS.ALREADY_IN_CALL, type: 'error' }); return; }
        this.target = targetId;
        this.playRingtone();
        this.timer = setTimeout(() => { this.cleanup(); eventBus.emit(CALL_EVENTS.END, { reason: 'timeout' }); }, 30000);
        this.checkUserStatus(targetId, isVideo);
    }

    async checkUserStatus(targetId, isVideo) {
        const rid = `check_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.GET, { collection: 'users', docId: targetId, requestId: rid });
        eventBus.once(`data:get:${rid}:success`, user => {
            if (!user) { this.fail('Abonent mavjud emas'); return; }
            this.sendCallRequest(targetId, isVideo);
        });
        eventBus.once(`data:get:${rid}:error`, () => this.fail(CALL_ERRORS.USER_OFFLINE));
    }

    sendCallRequest(targetId, isVideo) {
        const uid = JSON.parse(localStorage.getItem('mrgram_user') || '{}').uid;
        eventBus.emit(REALTIME_EVENTS.SET, {
            path: `calls/${targetId}`,
            data: { caller: uid, isVideo, status: 'calling', timestamp: Date.now() }
        });
        eventBus.emit(CALL_EVENTS.CONNECTED, { targetId, isVideo });
    }

    playRingtone() { this.ringtone = new Audio('/assets/sounds/call-out.mp3'); this.ringtone.loop = true; this.ringtone.play().catch(()=>{}); }
    cleanup() { if (this.ringtone) { this.ringtone.pause(); this.ringtone = null; } if (this.timer) { clearTimeout(this.timer); this.timer = null; } this.target = null; }
    fail(msg) { this.cleanup(); eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg, type: 'error' }); eventBus.emit(CALL_EVENTS.END); }
    destroy() { this.cleanup(); eventBus.off(CALL_EVENTS.START, this.start); }
}

export default new CallStartModule();
