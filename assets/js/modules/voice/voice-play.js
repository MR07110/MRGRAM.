// assets/js/modules/voice/voice-play.js
// 📏 ~40 qator
// Voice Play Moduli

import eventBus from '../../core/event-bus.js';
import { VOICE_EVENTS } from '../../constants/events.js';

class VoicePlayModule {
    constructor() {
        this.current = null;
        this.audio = null;
        this.playing = false;
    }

    init() {
        eventBus.on(VOICE_EVENTS.RECORD_COMPLETE, this.load.bind(this));
        eventBus.on(VOICE_EVENTS.PLAY_START, this.play.bind(this));
        eventBus.on(VOICE_EVENTS.PLAY_STOP, this.pause.bind(this));
        console.log('✅ Voice Play moduli tayyor');
    }

    load({ blob, url }) {
        this.stop();
        this.audio = new Audio(url || URL.createObjectURL(blob));
        this.audio.onended = () => { this.playing = false; eventBus.emit(VOICE_EVENTS.PLAY_END); };
    }

    play() { if (!this.audio) return; this.audio.play(); this.playing = true; eventBus.emit(VOICE_EVENTS.PLAY_START); }
    pause() { if (!this.audio) return; this.audio.pause(); this.playing = false; eventBus.emit(VOICE_EVENTS.PLAY_STOP); }
    stop() { if (this.audio) { this.audio.pause(); this.audio.currentTime = 0; } this.playing = false; this.audio = null; }
    seek(time) { if (this.audio) this.audio.currentTime = time; }
    destroy() { this.stop(); }
}

export default new VoicePlayModule();
