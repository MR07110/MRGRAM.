// modules/voice-recorder.js
// Ovozli xabar yozish moduli

import { uploadAudio } from '../api/supabase-config.js';
import { saveMessageToFirestore, saveMessageToRealtime } from '../api/firebase-config.js';

export class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.stream = null;
        this.startTime = null;
        this.timerInterval = null;
    }
    
    // UI ko'rsatish
    showRecordingUI(onSend, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'voice-recorder-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1c1c1c;
            padding: 20px;
            z-index: 500;
            border-radius: 20px 20px 0 0;
            display: flex;
            align-items: center;
            gap: 15px;
        `;
        
        // Timer
        const timer = document.createElement('div');
        timer.id = 'voiceTimer';
        timer.style.cssText = `
            font-size: 24px;
            font-weight: 600;
            color: #24A1DE;
            min-width: 70px;
        `;
        timer.textContent = '00:00';
        
        // Animatsiya
        const wave = document.createElement('div');
        wave.style.cssText = `
            flex: 1;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        `;
        
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 4px;
                height: 20px;
                background: #24A1DE;
                border-radius: 2px;
                animation: voiceWave 1s ease-in-out infinite;
                animation-delay: ${i * 0.1}s;
            `;
            wave.appendChild(bar);
        }
        
        // To'xtatish tugmasi
        const stopBtn = document.createElement('button');
        stopBtn.innerHTML = '⏹️ To\'xtatish';
        stopBtn.style.cssText = `
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
        `;
        
        // Yuborish tugmasi
        const sendBtn = document.createElement('button');
        sendBtn.innerHTML = '📤 Yuborish';
        sendBtn.style.cssText = `
            background: #24A1DE;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
        `;
        
        // Bekor qilish
        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '❌';
        cancelBtn.style.cssText = `
            background: transparent;
            color: #aaa;
            border: none;
            padding: 12px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
        `;
        
        overlay.appendChild(timer);
        overlay.appendChild(wave);
        overlay.appendChild(stopBtn);
        overlay.appendChild(sendBtn);
        overlay.appendChild(cancelBtn);
        
        document.body.appendChild(overlay);
        
        // CSS animatsiya
        const style = document.createElement('style');
        style.textContent = `
            @keyframes voiceWave {
                0%, 100% { height: 10px; }
                50% { height: 40px; }
            }
        `;
        document.head.appendChild(style);
        
        // Eventlar
        stopBtn.onclick = () => this.stopRecording();
        sendBtn.onclick = async () => {
            const audioFile = await this.stopRecording();
            overlay.remove();
            if (audioFile && onSend) onSend(audioFile);
        };
        cancelBtn.onclick = () => {
            this.cancelRecording();
            overlay.remove();
            if (onCancel) onCancel();
        };
        
        // Timer boshlash
        this.startTimer(timer);
        
        return overlay;
    }
    
    // Timer
    startTimer(timerElement) {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    // Yozishni boshlash
    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];
            this.isRecording = true;
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.start(100);
            
            return new Promise((resolve) => {
                this.showRecordingUI(
                    async (audioFile) => resolve(audioFile),
                    () => resolve(null)
                );
            });
            
        } catch (error) {
            console.error('Mikrofon xatosi:', error);
            alert('Mikrofonga ruxsat berilmadi!');
            return null;
        }
    }
    
    // Yozishni to'xtatish
    async stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(null);
                return;
            }
            
            this.mediaRecorder.onstop = async () => {
                this.stopTimer();
                
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { 
                    type: 'audio/webm' 
                });
                
                // Stream ni to'xtatish
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
                
                this.isRecording = false;
                resolve(audioFile);
            };
            
            this.mediaRecorder.stop();
        });
    }
    
    // Bekor qilish
    cancelRecording() {
        this.stopTimer();
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.isRecording = false;
        this.audioChunks = [];
    }
    
    // Ovozli xabar yuborish
    async sendVoiceMessage(chatId, sender) {
        try {
            const audioFile = await this.startRecording();
            
            if (!audioFile) {
                console.log('Yozish bekor qilindi');
                return null;
            }
            
            // Supabase'ga yuklash
            const result = await uploadAudio(audioFile, 'voice');
            
            // Xabar ma'lumoti
            const message = {
                type: 'voice',
                content: '🎤 Ovozli xabar',
                mediaUrl: result.url,
                fileSize: audioFile.size,
                duration: Math.floor((Date.now() - this.startTime) / 1000),
                senderId: sender.id,
                senderName: sender.name,
                timestamp: Date.now()
            };
            
            // Firebase'ga saqlash
            await saveMessageToFirestore(chatId, message);
            await saveMessageToRealtime(chatId, message);
            
            return message;
            
        } catch (error) {
            console.error('Ovozli xabar xatosi:', error);
            alert('Ovoz yozishda xatolik!');
            return null;
        }
    }
}

export default new VoiceRecorder();
