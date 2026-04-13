// assets/js/modules/contacts/contact-remove.js
// 📏 ~35 qator
// Contact Remove Moduli

import eventBus from '../../core/event-bus.js';
import { CONTACT_EVENTS, DATA_EVENTS, UI_EVENTS } from '../../constants/events.js';

class ContactRemoveModule {
    constructor() {
        this.user = null;
    }

    init() {
        eventBus.on('auth:state-changed', ({ user }) => this.user = user);
        eventBus.on(CONTACT_EVENTS.REMOVE, this.remove.bind(this));
        console.log('✅ Contact Remove moduli tayyor');
    }

    remove({ targetId }) {
        if (!this.user) return;
        eventBus.emit(UI_EVENTS.MODAL_OPEN, { id: 'confirm-modal', data: { title: 'Kontaktni o\'chirish', content: 'Rostdan ham o\'chirmoqchimisiz?' } });
        const handler = () => { this.perform(targetId); eventBus.off('ui:modal:confirm', handler); };
        eventBus.on('ui:modal:confirm', handler);
    }

    perform(targetId) {
        const rid = `remove_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.UPDATE, { collection: `users/${this.user.uid}/contacts`, docId: 'list', data: { [targetId]: null }, requestId: rid });
        eventBus.once(`data:update:${rid}:success`, () => {
            eventBus.emit(CONTACT_EVENTS.REMOVED, { contactId: targetId });
            eventBus.emit(UI_EVENTS.TOAST_SHOW, { msg: '✅ Kontakt o\'chirildi', type: 'success' });
            eventBus.emit(UI_EVENTS.MODAL_CLOSE, { id: 'confirm-modal' });
        });
    }

    destroy() { eventBus.off(CONTACT_EVENTS.REMOVE, this.remove); }
}

export default new ContactRemoveModule();
