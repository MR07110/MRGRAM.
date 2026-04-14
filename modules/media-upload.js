// modules/media-upload.js
// Rasm, Video, Audio, Fayl yuklash moduli

import { uploadFile, uploadImage, uploadVideo, uploadAudio } from '../api/supabase-config.js';
import { saveMessageToFirestore, saveMessageToRealtime } from '../api/firebase-config.js';

export class MediaUploader {
    constructor() {
        this.allowedTypes = {
            image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            video: ['video/mp4', 'video/webm', 'video/quicktime'],
            audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'],
            file: ['application/pdf', 'application/msword', 'application/zip']
        };
    }
    
    // Fayl tanlash dialogini ochish
    openFilePicker(type = 'all', multiple = false) {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = multiple;
            
            // Accept atributini sozlash
            if (type === 'image') {
                input.accept = 'image/*';
            } else if (type === 'video') {
                input.accept = 'video/*';
            } else if (type === 'audio') {
                input.accept = 'audio/*';
            } else {
                input.accept = '*/*';
            }
            
            input.onchange = (e) => {
                const files = Array.from(e.target.files);
                resolve(files);
            };
            
            input.oncancel = () => reject('Bekor qilindi');
            
            input.click();
        });
    }
    
    // Rasm yuklash va xabar yuborish
    async sendImage(chatId, sender, file = null) {
        try {
            let files;
            if (file) {
                files = [file];
            } else {
                files = await this.openFilePicker('image', false);
            }
            
            if (!files || files.length === 0) return null;
            
            const fileObj = files[0];
            
            // Hajm tekshirish (10MB)
            if (fileObj.size > 10 * 1024 * 1024) {
                throw new Error('Rasm hajmi 10MB dan katta!');
            }
            
            // Supabase'ga yuklash
            const result = await uploadImage(fileObj);
            
            // Xabar ma'lumoti
            const message = {
                type: 'photo',
                content: fileObj.name,
                mediaUrl: result.url,
                thumbnail: result.url,
                fileSize: fileObj.size,
                mimeType: fileObj.type,
                senderId: sender.id,
                senderName: sender.name,
                timestamp: Date.now()
            };
            
            // Firebase'ga saqlash
            await saveMessageToFirestore(chatId, message);
            await saveMessageToRealtime(chatId, message);
            
            return message;
        } catch (error) {
            console.error('Rasm yuborish xatosi:', error);
            throw error;
        }
    }
    
    // Video yuklash va xabar yuborish
    async sendVideo(chatId, sender, file = null) {
        try {
            let files;
            if (file) {
                files = [file];
            } else {
                files = await this.openFilePicker('video', false);
            }
            
            if (!files || files.length === 0) return null;
            
            const fileObj = files[0];
            
            // Hajm tekshirish (50MB)
            if (fileObj.size > 50 * 1024 * 1024) {
                throw new Error('Video hajmi 50MB dan katta!');
            }
            
            // Supabase'ga yuklash
            const result = await uploadVideo(fileObj);
            
            // Xabar ma'lumoti
            const message = {
                type: 'video',
                content: fileObj.name,
                mediaUrl: result.url,
                thumbnail: result.url,
                fileSize: fileObj.size,
                mimeType: fileObj.type,
                duration: 0, // Keyinroq qo'shiladi
                senderId: sender.id,
                senderName: sender.name,
                timestamp: Date.now()
            };
            
            // Firebase'ga saqlash
            await saveMessageToFirestore(chatId, message);
            await saveMessageToRealtime(chatId, message);
            
            return message;
        } catch (error) {
            console.error('Video yuborish xatosi:', error);
            throw error;
        }
    }
    
    // Audio/Ovozli xabar yuborish
    async sendAudio(chatId, sender, file = null) {
        try {
            let files;
            if (file) {
                files = [file];
            } else {
                files = await this.openFilePicker('audio', false);
            }
            
            if (!files || files.length === 0) return null;
            
            const fileObj = files[0];
            
            // Supabase'ga yuklash
            const result = await uploadAudio(fileObj);
            
            // Xabar ma'lumoti
            const message = {
                type: 'audio',
                content: fileObj.name,
                mediaUrl: result.url,
                fileSize: fileObj.size,
                mimeType: fileObj.type,
                senderId: sender.id,
                senderName: sender.name,
                timestamp: Date.now()
            };
            
            // Firebase'ga saqlash
            await saveMessageToFirestore(chatId, message);
            await saveMessageToRealtime(chatId, message);
            
            return message;
        } catch (error) {
            console.error('Audio yuborish xatosi:', error);
            throw error;
        }
    }
    
    // Media ko'rish (modal)
    showMediaViewer(mediaUrl, type = 'image') {
        const viewer = document.createElement('div');
        viewer.className = 'media-viewer';
        viewer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
        `;
        
        let content;
        if (type === 'image') {
            content = document.createElement('img');
            content.src = mediaUrl;
            content.style.maxWidth = '90%';
            content.style.maxHeight = '90%';
            content.style.objectFit = 'contain';
        } else if (type === 'video') {
            content = document.createElement('video');
            content.src = mediaUrl;
            content.controls = true;
            content.autoplay = true;
            content.style.maxWidth = '90%';
            content.style.maxHeight = '90%';
        }
        
        viewer.appendChild(content);
        viewer.onclick = () => viewer.remove();
        document.body.appendChild(viewer);
    }
}

export default new MediaUploader();
