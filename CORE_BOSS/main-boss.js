// CORE_BOSS/main-boss.js

import eventBus from './event-bus.js';
import dataBoss from './data-boss.js';
import uiBoss from './ui-boss.js';
import moduleLoader from './module-loader.js';
import { SYSTEM_EVENTS } from '../constants/events.js';

class MainBoss {
    constructor() {
        this.bosses = new Map();
        this.isInitialized = false;
        console.log('🏢 MAIN BOSS yaratildi');
    }

    registerBosses() {
        this.bosses.set('data', dataBoss);
        this.bosses.set('ui', uiBoss);
        console.log('✅ Bosslar ro\'yxatdan o\'tdi');
    }

    async start() {
        if (this.isInitialized) {
            console.warn('⚠️ Tizim allaqachon ishga tushgan');
            return;
        }

        console.log('🚀 MRGRAM ishga tushmoqda...');

        this.registerBosses();
        
        // UI Boss ni birinchi ishga tushirish (interfeys ko'rinsin)
        await uiBoss.init();
        
        // Data Boss ni ishga tushirish
        await dataBoss.init();

        // Modullarni yuklash
        const results = await moduleLoader.loadAll();
        const loaded = results.filter(r => r && r.success !== false).length;

        this.isInitialized = true;

        eventBus.emit(SYSTEM_EVENTS.READY, {
            timestamp: Date.now(),
            bosses: this.bosses.size,
            modules: loaded
        });

        console.log(`✅ MRGRAM tayyor! (${loaded} modul)`);
    }

    report() {
        return {
            initialized: this.isInitialized,
            bosses: this.bosses.size,
            ...moduleLoader.report()
        };
    }
}

const mainBoss = new MainBoss();

if (typeof window !== 'undefined') {
    window.mainBoss = mainBoss;
}

export default mainBoss;
