// modules/video-call.js
// Video qo'ng'iroq moduli

export class VideoCall {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.isCallActive = false;
        this.isVideoEnabled = true;
        this.isAudioEnabled = true;
    }
    
    async startCall(contactName, isIncoming = false) {
        this.showVideoCallUI(contactName, isIncoming);
        
        try {
            // Kamera va mikrofon ruxsati
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            
            // Local video ko'rsatish
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }
            
            // WebRTC
            this.peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            });
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            this.peerConnection.ontrack = (event) => {
                const remoteVideo = document.getElementById('remoteVideo');
                if (remoteVideo) {
                    this.remoteStream = event.streams[0];
                    remoteVideo.srcObject = this.remoteStream;
                }
            };
            
            this.isCallActive = true;
            
        } catch (error) {
            console.error('Video qo\'ng\'iroq xatosi:', error);
            this.endCall();
        }
    }
    
    showVideoCallUI(contactName, isIncoming) {
        const overlay = document.createElement('div');
        overlay.className = 'video-call-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            z-index: 1000;
        `;
        
        // Remote video (to'liq ekran)
        const remoteVideo = document.createElement('video');
        remoteVideo.id = 'remoteVideo';
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        remoteVideo.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        // Local video (kichik oyna)
        const localVideo = document.createElement('video');
        localVideo.id = 'localVideo';
        localVideo.autoplay = true;
        localVideo.playsInline = true;
        localVideo.muted = true;
        localVideo.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 120px;
            height: 180px;
            border-radius: 12px;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.3);
            z-index: 10;
        `;
        
        // Ism
        const nameLabel = document.createElement('div');
        nameLabel.textContent = contactName;
        nameLabel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            font-size: 18px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        `;
        
        // Boshqaruv tugmalari
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 20px;
            z-index: 10;
        `;
        
        // Video o'chirish/yoqish
        const videoBtn = this.createControlButton('📹', () => {
            this.isVideoEnabled = !this.isVideoEnabled;
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = this.isVideoEnabled;
            });
            videoBtn.style.background = this.isVideoEnabled ? '#24A1DE' : '#e74c3c';
        });
        
        // Mikrofon o'chirish/yoqish
        const micBtn = this.createControlButton('🎤', () => {
            this.isAudioEnabled = !this.isAudioEnabled;
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = this.isAudioEnabled;
            });
            micBtn.style.background = this.isAudioEnabled ? '#24A1DE' : '#e74c3c';
        });
        
        // Kamerani almashtirish
        const switchBtn = this.createControlButton('🔄', async () => {
            // Kamera almashtirish logikasi
        });
        
        // Tugatish
        const endBtn = this.createControlButton('🔴', () => this.endCall());
        endBtn.style.background = '#e74c3c';
        
        controls.appendChild(videoBtn);
        controls.appendChild(micBtn);
        controls.appendChild(switchBtn);
        controls.appendChild(endBtn);
        
        overlay.appendChild(remoteVideo);
        overlay.appendChild(localVideo);
        overlay.appendChild(nameLabel);
        overlay.appendChild(controls);
        
        document.body.appendChild(overlay);
        this.callUI = overlay;
    }
    
    createControlButton(icon, onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #24A1DE;
            border: none;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.2s;
        `;
        btn.onclick = onClick;
        return btn;
    }
    
    endCall() {
        this.isCallActive = false;
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        
        if (this.callUI) {
            this.callUI.remove();
        }
    }
}

export default new VideoCall();
