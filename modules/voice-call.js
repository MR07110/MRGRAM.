// modules/voice-call.js
// Ovozli qo'ng'iroq moduli

export class VoiceCall {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.isCallActive = false;
        this.callStartTime = null;
        this.timerInterval = null;
    }
    
    // Qo'ng'iroq qilish
    async startCall(contactName, isIncoming = false) {
        // UI ko'rsatish
        this.showCallUI(contactName, isIncoming);
        
        try {
            // Mikrofon ruxsati
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: false 
            });
            
            // WebRTC sozlash
            this.peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            });
            
            // Local stream qo'shish
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            // Remote stream
            this.peerConnection.ontrack = (event) => {
                this.remoteStream = event.streams[0];
                const audio = new Audio();
                audio.srcObject = this.remoteStream;
                audio.play();
            };
            
            this.isCallActive = true;
            this.startCallTimer();
            
        } catch (error) {
            console.error('Qo\'ng\'iroq xatosi:', error);
            this.endCall();
        }
    }
    
    // UI ko'rsatish
    showCallUI(contactName, isIncoming) {
        const overlay = document.createElement('div');
        overlay.className = 'call-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #1a5f8a, #0e0e0e);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        `;
        
        // Avatar
        const avatar = document.createElement('div');
        avatar.style.cssText = `
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #24A1DE;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin-bottom: 20px;
        `;
        avatar.textContent = contactName[0];
        
        // Ism
        const name = document.createElement('h2');
        name.textContent = contactName;
        name.style.marginBottom = '10px';
        
        // Status
        const status = document.createElement('p');
        status.id = 'callStatus';
        status.textContent = isIncoming ? 'Qo\'ng\'iroq...' : 'Ulanish...';
        status.style.color = '#aaa';
        status.style.marginBottom = '30px';
        
        // Timer
        const timer = document.createElement('div');
        timer.id = 'callTimer';
        timer.style.cssText = `
            font-size: 24px;
            margin-bottom: 40px;
        `;
        timer.textContent = '00:00';
        
        // Tugmalar
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 30px;
        `;
        
        // Tugatish tugmasi
        const endBtn = document.createElement('button');
        endBtn.innerHTML = '🔴';
        endBtn.style.cssText = `
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: #e74c3c;
            border: none;
            font-size: 30px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
        `;
        endBtn.onclick = () => this.endCall();
        
        // Qabul qilish (faqat incoming)
        if (isIncoming) {
            const acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = '📞';
            acceptBtn.style.cssText = `
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: #2ecc71;
                border: none;
                font-size: 30px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
            `;
            acceptBtn.onclick = () => {
                status.textContent = 'Ulanmoqda...';
                acceptBtn.remove();
            };
            controls.appendChild(acceptBtn);
        }
        
        controls.appendChild(endBtn);
        
        overlay.appendChild(avatar);
        overlay.appendChild(name);
        overlay.appendChild(status);
        overlay.appendChild(timer);
        overlay.appendChild(controls);
        
        document.body.appendChild(overlay);
        this.callUI = overlay;
        
        // Ovoz effekti
        this.playSound(isIncoming ? 'call-in' : 'call-out');
    }
    
    // Timer
    startCallTimer() {
        this.callStartTime = Date.now();
        const timerElement = document.getElementById('callTimer');
        
        this.timerInterval = setInterval(() => {
            if (!this.isCallActive) return;
            
            const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    // Ovoz effekti
    playSound(type) {
        const audio = new Audio();
        audio.src = `../assets/sounds/${type}.mp3`;
        audio.loop = type === 'call-in';
        audio.play();
        this.callSound = audio;
    }
    
    // Qo'ng'iroqni tugatish
    endCall() {
        this.isCallActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.callSound) {
            this.callSound.pause();
            this.callSound = null;
        }
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        
        if (this.callUI) {
            this.callUI.remove();
        }
        
        // Tugatish ovozi
        const endSound = new Audio('../assets/sounds/abonent-stop.mp3');
        endSound.play();
    }
}

export default new VoiceCall();
