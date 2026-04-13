// assets/js/modules/vault/vault-contacts.js
// 📏 ~45 qator
// Vault Contacts Moduli

import eventBus from '../../core/event-bus.js';
import { VAULT_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { VAULT_ERRORS } from '../../constants/errors.js';
import vaultEncrypt from './vault-encrypt.js';
import vaultDecrypt from './vault-decrypt.js';

class VaultContactsModule {
    constructor() {
        this.contacts = [];
        this.unlocked = false;
    }

    init() {
        eventBus.on(VAULT_EVENTS.UNLOCK, () => { this.unlocked = true; this.load(); });
        eventBus.on(VAULT_EVENTS.LOCK, () => { this.unlocked = false; this.contacts = []; });
        eventBus.on(VAULT_EVENTS.CONTACT_ADD, this.add.bind(this));
        eventBus.on(VAULT_EVENTS.CONTACT_REMOVE, this.remove.bind(this));
        eventBus.on(VAULT_EVENTS.CONTACT_LIST, () => eventBus.emit('vault:contacts:list', { contacts: this.contacts }));
        console.log('✅ Vault Contacts moduli tayyor');
    }

    load() { const data = vaultDecrypt.getData(); this.contacts = data?.contacts || []; }

    save() {
        const result = vaultEncrypt.encrypt({ data: { contacts: this.contacts } });
        if (result.success) localStorage.setItem('vault_data', result.encrypted);
    }

    add({ contact }) {
        if (!this.unlocked) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.VAULT_LOCKED, type: 'error' }); return; }
        if (this.contacts.some(c => c.id === contact.id || c.username === contact.username)) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.CONTACT_EXISTS, type: 'error' }); return; }
        contact.id = `vc_${Date.now()}`;
        this.contacts.push(contact);
        this.save();
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ Maxfiy kontakt qo\'shildi', type: 'success' });
    }

    remove({ contactId }) {
        if (!this.unlocked) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.VAULT_LOCKED, type: 'error' }); return; }
        const idx = this.contacts.findIndex(c => c.id === contactId);
        if (idx === -1) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.CONTACT_NOT_FOUND, type: 'error' }); return; }
        this.contacts.splice(idx, 1);
        this.save();
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ Kontakt o\'chirildi', type: 'success' });
    }

    destroy() { eventBus.off(VAULT_EVENTS.CONTACT_ADD, this.add); eventBus.off(VAULT_EVENTS.CONTACT_REMOVE, this.remove); }
}

export default new VaultContactsModule();
