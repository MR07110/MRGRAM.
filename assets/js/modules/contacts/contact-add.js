// assets/js/modules/contacts/contact-add.js
// 📏 ~40 qator
// Contact Add Moduli

import eventBus from '../../core/event-bus.js';
import { CONTACT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class ContactAddModule {
    constructor() {
        this.user = null;
    }

    init() {
        eventBus.on('auth:state-changed', ({ user }) => this.user = user);
        eventBus.on(CONTACT_EVENTS.ADD, this.add.bind(this));
        console.log('✅ Contact Add moduli tayyor');
    }

    add({ targetId }) {
        if (!this.user) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '❌ Avval tizimga kiring', type: 'error' }); return; }
        const rid = `check_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.GET, { collection: 'users', docId: targetId, requestId: rid });
        eventBus.once(`data:get:${rid}:success`, user => {
            if (!user) { eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '❌ Foydalanuvchi topilmadi', type: 'error' }); return; }
            this.save(targetId);
        });
    }

    save(targetId) {
        const rid = `add_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.UPDATE, { collection: `users/${this.user.uid}/contacts`, docId: 'list', data: { [targetId]: true }, requestId: rid });
        eventBus.once(`data:update:${rid}:success`, () => {
            eventBus.emit(CONTACT_EVENTS.ADDED, { contactId: targetId });
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ Kontakt qo\'shildi', type: 'success' });
        });
    }

    destroy() { eventBus.off(CONTACT_EVENTS.ADD, this.add); }
}

export default new ContactAddModule();
