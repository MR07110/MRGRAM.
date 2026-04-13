// assets/js/core/module-loader.js
// 📏 ~80 qator
// Module Loader - Modullarni dinamik yuklash

import eventBus from './event-bus.js';
import { MODULE_EVENTS } from '../constants/events.js';

class ModuleLoader {
    constructor() {
        this.loaded = new Map();
        this.modulePaths = this.defineModulePaths();
    }

    defineModulePaths() {
        return {
            // Auth modullari
            authLogin: () => import('../modules/auth/auth-login.js'),
            authRegister: () => import('../modules/auth/auth-register.js'),
            authLogout: () => import('../modules/auth/auth-logout.js'),
            authSession: () => import('../modules/auth/auth-session.js'),

            // Chat modullari
            chatSend: () => import('../modules/chat/chat-send.js'),
            chatReceive: () => import('../modules/chat/chat-receive.js'),
            chatDelete: () => import('../modules/chat/chat-delete.js'),
            chatEdit: () => import('../modules/chat/chat-edit.js'),
            chatForward: () => import('../modules/chat/chat-forward.js'),
            chatTyping: () => import('../modules/chat/chat-typing.js'),
            chatRead: () => import('../modules/chat/chat-read.js'),

            // Call modullari
            callStart: () => import('../modules/call/call-start.js'),
            callAccept: () => import('../modules/call/call-accept.js'),
            callReject: () => import('../modules/call/call-reject.js'),
            callEnd: () => import('../modules/call/call-end.js'),
            callMedia: () => import('../modules/call/call-media.js'),
            callWebRTC: () => import('../modules/call/call-webrtc.js'),
            callUI: () => import('../modules/call/call-ui.js'),

            // Voice modullari
            voiceRecord: () => import('../modules/voice/voice-record.js'),
            voicePlay: () => import('../modules/voice/voice-play.js'),
            voiceVizual: () => import('../modules/voice/voice-vizual.js'),
            voiceUpload: () => import('../modules/voice/voice-upload.js'),

            // Contacts modullari
            contactAdd: () => import('../modules/contacts/contact-add.js'),
            contactRemove: () => import('../modules/contacts/contact-remove.js'),
            contactSearch: () => import('../modules/contacts/contact-search.js'),
            contactList: () => import('../modules/contacts/contact-list.js'),

            // Vault modullari
            vaultPin: () => import('../modules/vault/vault-pin.js'),
            vaultEncrypt: () => import('../modules/vault/vault-encrypt.js'),
            vaultDecrypt: () => import('../modules/vault/vault-decrypt.js'),
            vaultContacts: () => import('../modules/vault/vault-contacts.js'),

            // Media modullari
            mediaUpload: () => import('../modules/media/media-upload.js'),
            mediaPreview: () => import('../modules/media/media-preview.js'),
            mediaViewer: () => import('../modules/media/media-viewer.js'),
            mediaCapture: () => import('../modules/media/media-capture.js')
        };
    }

    async loadModule(moduleName) {
        if (this.loaded.has(moduleName)) {
            return this.loaded.get(moduleName);
        }

        const loader = this.modulePaths[moduleName];
        if (!loader) {
            console.error(`❌ Modul topilmadi: ${moduleName}`);
            return null;
        }

        try {
            const module = await loader();
            const instance = module.default;
            
            if (instance && typeof instance.init === 'function') {
                instance.init();
            }

            this.loaded.set(moduleName, instance);
            
            eventBus.emit(MODULE_EVENTS.REGISTERED, { 
                name: moduleName, 
                instance 
            });

            return instance;
        } catch (error) {
            console.error(`❌ Modul yuklanmadi: ${moduleName}`, error);
            eventBus.emit(MODULE_EVENTS.ERROR, { 
                name: moduleName, 
                error 
            });
            return null;
        }
    }

    async loadModules(moduleNames) {
        const results = [];
        
        for (const name of moduleNames) {
            const instance = await this.loadModule(name);
            results.push({ name, instance, success: !!instance });
        }

        return results;
    }

    async loadAll() {
        const allModuleNames = Object.keys(this.modulePaths);
        return this.loadModules(allModuleNames);
    }

    async loadByCategory(category) {
        const names = Object.keys(this.modulePaths)
            .filter(name => name.startsWith(category));
        
        return this.loadModules(names);
    }

    getLoadedModule(moduleName) {
        return this.loaded.get(moduleName) || null;
    }

    getLoadedModules() {
        return Array.from(this.loaded.keys());
    }

    isLoaded(moduleName) {
        return this.loaded.has(moduleName);
    }

    report() {
        return {
            totalDefined: Object.keys(this.modulePaths).length,
            loaded: this.loaded.size,
            modules: this.getLoadedModules()
        };
    }
}

const moduleLoader = new ModuleLoader();

export default moduleLoader;
