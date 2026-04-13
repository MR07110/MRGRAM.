// CORE_BOSS/data-boss.js
// 📏 ~15 qator

import { dataBossCore } from './data-boss-core.js';

class DataBoss {
    async init() {
        await dataBossCore.init();
        console.log('✅ Data Boss tayyor');
    }
}

export default new DataBoss();
