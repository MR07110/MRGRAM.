// modules/camera.js
// Kamera moduli - rasmga olish

export class Camera {
    constructor() {
        this.stream = null;
        this.isActive = false;
    }
    
    // Kamera ochish va rasmga olish
    async capturePhoto() {
        return new Promise(async (resolve, reject) => {
            try {
                // Kamera ruxsati
                this.stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }
                });
                this.isActive = true;
                
                // UI yaratish
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #000;
                    z-index: 1000;
                `;
                
                // Video elementi
                const video = document.createElement('video');
                video.autoplay = true;
                video.playsInline = true;
                video.srcObject = this.stream;
                video.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                
                // Suratga olish tugmasi
                const captureBtn = document.createElement('button');
                captureBtn.style.cssText = `
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #24A1DE;
                    cursor: pointer;
                `;
                
                // Yopish tugmasi
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '✕';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                `;
                closeBtn.onclick = () => {
                    this.close();
                    overlay.remove();
                    reject('Bekor qilindi');
                };
                
                // Suratga olish
                captureBtn.onclick = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        this.close();
                        overlay.remove();
                        resolve(file);
                    }, 'image/jpeg', 0.9);
                };
                
                overlay.appendChild(video);
                overlay.appendChild(captureBtn);
                overlay.appendChild(closeBtn);
                document.body.appendChild(overlay);
                
            } catch (error) {
                console.error('Kamera xatosi:', error);
                reject(error);
            }
        });
    }
    
    close() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.isActive = false;
    }
}

export default new Camera();
