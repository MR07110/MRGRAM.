// assets/js/modules/vault/vault-pin.js
// 📏 ~45 qator
// Vault PIN Moduli

import eventBus from '../../core/event-bus.js';
import { VAULT_EVENTS, UI_EVENTS } from '../../constants/events.js';
import { VAULT_ERRORS } from '../../constants/errors.js';

class VaultPinModule {
    constructor() {
        this.pinHash = null;
        this.attempts = 0;
    }

    init() {
        this.pinHash = localStorage.getItem('vault_pin_hash') || this.hash('0000');
        eventBus.on(VAULT_EVENTS.PIN_VERIFY, this.verify.bind(this));
        eventBus.on(VAULT_EVENTS.PIN_CHANGE, this.change.bind(this));
        console.log('✅ Vault PIN moduli tayyor');
    }

    hash(pin) { let h = 0; for (let i = 0; i < pin.length; i++) h = ((h << 5) - h) + pin.charCodeAt(i); return h.toString(); }

    verify({ pin }) {
        if (!pin || pin.length !== 4) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.PIN_LENGTH, type: 'error' }); return false; }
        if (this.hash(pin) === this.pinHash) { this.attempts = 0; eventBus.emit(VAULT_EVENTS.UNLOCK); return true; }
        this.attempts++;
        if (this.attempts >= 3) { eventBus.emit(VAULT_EVENTS.LOCK); setTimeout(() => this.attempts = 0, 300000); }
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: VAULT_ERRORS.PIN_INVALID, type: 'error' });
        return false;
    }

    change({ oldPin, newPin, confirm }) {
        if (!oldPin || !newPin || !confirm) return { success: false, error: 'Barcha maydonlarni to\'ldiring' };
        if (newPin.length !== 4) return { success: false, error: VAULT_ERRORS.PIN_LENGTH };
        if (newPin !== confirm) return { success: false, error: VAULT_ERRORS.PIN_MISMATCH };
        if (this.hash(oldPin) !== this.pinHash) return { success: false, error: 'Eski PIN xato' };
        this.pinHash = this.hash(newPin);
        localStorage.setItem('vault_pin_hash', this.pinHash);
        eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ PIN o\'zgartirildi', type: 'success' });
        return { success: true };
    }

    destroy() { eventBus.off(VAULT_EVENTS.PIN_VERIFY, this.verify); eventBus.off(VAULT_EVENTS.PIN_CHANGE, this.change); }
}

export default new VaultPinModule();
