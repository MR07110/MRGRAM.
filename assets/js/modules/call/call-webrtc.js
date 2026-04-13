// assets/js/modules/call/call-webrtc.js
// 📏 ~55 qator
// Call WebRTC Connection Moduli

import eventBus from '../../core/event-bus.js';
import { CALL_EVENTS, REALTIME_EVENTS } from '../../constants/events.js';
import { WEBRTC_CONFIG } from '../../constants/config.js';

class CallWebRTCModule {
    constructor() {
        this.pc = null;
        this.callId = null;
    }

    init() {
        eventBus.on(CALL_EVENTS.CONNECTED, this.create.bind(this));
        eventBus.on(CALL_EVENTS.END, this.close.bind(this));
        console.log('✅ Call WebRTC moduli tayyor');
    }

    create({ targetId }) {
        this.close();
        this.pc = new RTCPeerConnection(WEBRTC_CONFIG);
        this.callId = `call_${Date.now()}`;
        this.pc.onicecandidate = e => { if (e.candidate) this.signal(targetId, { type: 'candidate', candidate: e.candidate }); };
        this.pc.oniceconnectionstatechange = () => {
            if (this.pc?.iceConnectionState === 'failed') this.pc?.restartIce();
            if (this.pc?.iceConnectionState === 'disconnected') eventBus.emit(CALL_EVENTS.DISCONNECTED);
        };
        eventBus.emit(CALL_EVENTS.CONNECTION_CREATED, { pc: this.pc, callId: this.callId });
    }

    async createOffer() { if (!this.pc) return null; const o = await this.pc.createOffer(); await this.pc.setLocalDescription(o); return o; }
    async createAnswer() { if (!this.pc) return null; const a = await this.pc.createAnswer(); await this.pc.setLocalDescription(a); return a; }
    async setRemote(desc) { if (!this.pc) return false; try { await this.pc.setRemoteDescription(desc); return true; } catch { return false; } }
    async addIce(c) { if (!this.pc) return false; try { await this.pc.addIceCandidate(c); return true; } catch { return false; } }
    addTrack(track, stream) { if (this.pc) this.pc.addTrack(track, stream); }

    signal(targetId, signal) {
        eventBus.emit(REALTIME_EVENTS.SET, { path: `signals/${targetId}/${this.callId}`, data: { ...signal, timestamp: Date.now() } });
    }

    close() { if (this.pc) { this.pc.close(); this.pc = null; } this.callId = null; }
    destroy() { this.close(); eventBus.off(CALL_EVENTS.CONNECTED, this.create); }
}

export default new CallWebRTCModule();
