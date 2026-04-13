// assets/js/core/main-boss.js
// 📏 ~65 qator
// Main Boss - Orkestrator

import eventBus from './event-bus.js';
import { SYSTEM_EVENTS, MODULE_EVENTS } from '../constants/events.js';

class MainBoss {
    constructor() {
        this.modules = new Map();
        this.bosses = new Map();
        this.isInitialized = false;
        
        console.log('🏢 MAIN BOSS yaratildi');
    }

    registerBoss(name, boss) {
        if (this.bosses.has(name)) {
            console.warn(`⚠️ Boss allaqachon ro'yxatdan o'tgan: ${name}`);
            return;
        }
        
        this.bosses.set(name, boss);
        console.log(`✅ Boss ro'yxatdan o'tdi: ${name}`);
    }

    registerModule(moduleName, moduleInstance) {
        if (this.modules.has(moduleName)) {
            console.warn(`⚠️ Modul allaqachon ro'yxatdan o'tgan: ${moduleName}`);
            return;
        }
        
        this.modules.set(moduleName, moduleInstance);
        console.log(`📦 Modul ro'yxatdan o'tdi: ${moduleName}`);
        
        eventBus.emit(MODULE_EVENTS.REGISTERED, { name: moduleName });
    }

    getModule(moduleName) {
        const module = this.modules.get(moduleName);
        if (!module) {
            console.error(`❌ Modul topilmadi: ${moduleName}`);
            return null;
        }
        return module;
    }

    getBoss(bossName) {
        const boss = this.bosses.get(bossName);
        if (!boss) {
            console.error(`❌ Boss topilmadi: ${bossName}`);
            return null;
        }
        return boss;
    }

    async loadBosses() {
        try {
            const dataBossModule = await import('./data-boss.js');
            const uiBossModule = await import('./ui-boss.js');
            
            const dataBoss = dataBossModule.default;
            const uiBoss = uiBossModule.default;
            
            this.registerBoss('data', dataBoss);
            this.registerBoss('ui', uiBoss);
            
            if (dataBoss && typeof dataBoss.init === 'function') {
                await dataBoss.init();
            }
            
            if (uiBoss && typeof uiBoss.init === 'function') {
                await uiBoss.init();
            }
            
            console.log('✅ Bosslar yuklandi');
        } catch (error) {
            console.error('❌ Bosslarni yuklashda xatolik:', error);
        }
    }

    async loadModules() {
        try {
            const moduleLoaderModule = await import('./module-loader.js');
            const moduleLoader = moduleLoaderModule.default;
            
            const results = await moduleLoader.loadAll();
            const loaded = results.filter(r => r && r.success !== false).length;
            
            console.log(`✅ ${loaded} ta modul yuklandi`);
            return loaded;
        } catch (error) {
            console.error('❌ Modullarni yuklashda xatolik:', error);
            return 0;
        }
    }

    async start() {
        if (this.isInitialized) {
            console.warn('⚠️ Tizim allaqachon ishga tushgan');
            return;
        }
        
        console.log('🚀 MRGRAM ishga tushmoqda...');
        
        await this.loadBosses();
        
        const loadedModules = await this.loadModules();
        
        this.isInitialized = true;
        
        eventBus.emit(SYSTEM_EVENTS.READY, {
            timestamp: Date.now(),
            bosses: this.bosses.size,
            modules: loadedModules
        });
        
        console.log(`✅ MRGRAM tayyor! (${this.bosses.size} boss, ${loadedModules} modul)`);
    }

    async stop() {
        console.log('🛑 MRGRAM to\'xtatilmoqda...');
        
        for (const [name, module] of this.modules) {
            if (typeof module.destroy === 'function') {
                await module.destroy();
                console.log(`📦 Modul to'xtatildi: ${name}`);
            }
        }
        
        this.modules.clear();
        this.bosses.clear();
        this.isInitialized = false;
        
        eventBus.emit(SYSTEM_EVENTS.STOPPED);
        console.log('⏹️ MRGRAM to\'xtatildi');
    }

    report() {
        return {
            initialized: this.isInitialized,
            bossCount: this.bosses.size,
            moduleCount: this.modules.size,
            eventCount: eventBus.getEventCount(),
            bosses: Array.from(this.bosses.keys()),
            modules: Array.from(this.modules.keys())
        };
    }
}

const mainBoss = new MainBoss();

if (typeof window !== 'undefined') {
    window.mainBoss = mainBoss;
}

export default mainBoss;
