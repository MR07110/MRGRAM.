// assets/js/modules/vault/vault-decrypt.js
// 📏 ~25 qator
// Vault Decrypt Moduli

import eventBus from '../../core/event-bus.js';
import { VAULT_EVENTS } from '../../constants/events.js';

class VaultDecryptModule {
    init() {
        eventBus.on(VAULT_EVENTS.DECRYPT, this.decrypt.bind(this));
        console.log('✅ Vault Decrypt moduli tayyor');
    }

    decrypt({ encrypted }) {
        try {
            const json = decodeURIComponent(escape(atob(encrypted)));
            const data = JSON.parse(json);
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    getData() {
        const encrypted = localStorage.getItem('vault_data');
        if (!encrypted) return null;
        return this.decrypt({ encrypted }).data;
    }

    destroy() { eventBus.off(VAULT_EVENTS.DECRYPT, this.decrypt); }
}

export default new VaultDecryptModule();
