// assets/js/modules/vault/vault-encrypt.js
// 📏 ~20 qator
// Vault Encrypt Moduli

import eventBus from '../../core/event-bus.js';
import { VAULT_EVENTS } from '../../constants/events.js';

class VaultEncryptModule {
    init() {
        eventBus.on(VAULT_EVENTS.ENCRYPT, this.encrypt.bind(this));
        console.log('✅ Vault Encrypt moduli tayyor');
    }

    encrypt({ data }) {
        try {
            const json = JSON.stringify(data);
            const encrypted = btoa(unescape(encodeURIComponent(json)));
            return { success: true, encrypted };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    destroy() { eventBus.off(VAULT_EVENTS.ENCRYPT, this.encrypt); }
}

export default new VaultEncryptModule();
