// assets/js/modules/voice/voice-vizual.js
// 📏 ~45 qator
// Voice Visualizer Moduli

import eventBus from '../../core/event-bus.js';
import { VOICE_EVENTS } from '../../constants/events.js';

class VoiceVizualModule {
    constructor() {
        this.ctx = null;
        this.analyser = null;
        this.source = null;
        this.stream = null;
        this.animation = null;
    }

    init() {
        eventBus.on(VOICE_EVENTS.RECORD_START, this.start.bind(this));
        eventBus.on(VOICE_EVENTS.RECORD_STOP, this.stop.bind(this));
        eventBus.on(VOICE_EVENTS.RECORD_CANCEL, this.stop.bind(this));
        console.log('✅ Voice Vizual moduli tayyor');
    }

    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
            this.source = this.ctx.createMediaStreamSource(this.stream);
            this.source.connect(this.analyser);
            const buffer = new Uint8Array(this.analyser.frequencyBinCount);
            const draw = () => {
                if (!this.analyser) return;
                this.animation = requestAnimationFrame(draw);
                this.analyser.getByteFrequencyData(buffer);
                const bars = [];
                for (let i = 0; i < 14; i++) bars.push(buffer[Math.floor(i * buffer.length / 14)] || 0);
                eventBus.emit('voice:waveform', { bars });
            };
            draw();
        } catch { /* ruxsat berilmadi */ }
    }

    stop() {
        if (this.animation) { cancelAnimationFrame(this.animation); this.animation = null; }
        if (this.source) { this.source.disconnect(); this.source = null; }
        if (this.ctx) { this.ctx.close(); this.ctx = null; }
        if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
        this.analyser = null;
        eventBus.emit('voice:waveform', { bars: [] });
    }

    destroy() { this.stop(); }
}

export default new VoiceVizualModule();
