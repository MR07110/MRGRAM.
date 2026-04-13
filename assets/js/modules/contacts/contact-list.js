// assets/js/modules/contacts/contact-list.js
// 📏 ~45 qator
// Contact List Moduli

import eventBus from '../../core/event-bus.js';
import { CONTACT_EVENTS, DATA_EVENTS } from '../../constants/events.js';

class ContactListModule {
    constructor() {
        this.user = null;
        this.contacts = [];
        this.cache = new Map();
    }

    init() {
        eventBus.on('auth:state-changed', ({ user }) => { this.user = user; if (user) this.load(); });
        eventBus.on(CONTACT_EVENTS.LIST, () => eventBus.emit('contacts:updated', { contacts: this.contacts }));
        eventBus.on(CONTACT_EVENTS.ADDED, () => this.load());
        eventBus.on(CONTACT_EVENTS.REMOVED, () => this.load());
        console.log('✅ Contact List moduli tayyor');
    }

    load() {
        if (!this.user) return;
        const rid = `contacts_${Date.now()}`;
        eventBus.emit(DATA_EVENTS.GET, { collection: `users/${this.user.uid}/contacts`, docId: 'list', requestId: rid });
        eventBus.once(`data:get:${rid}:success`, async data => {
            const ids = data ? Object.keys(data).filter(k => data[k]) : [];
            this.contacts = await this.fetchDetails(ids);
            eventBus.emit('contacts:updated', { contacts: this.contacts });
        });
    }

    async fetchDetails(ids) {
        const details = [];
        for (const id of ids) {
            if (this.cache.has(id)) { details.push(this.cache.get(id)); continue; }
            const rid = `user_${id}`;
            eventBus.emit(DATA_EVENTS.GET, { collection: 'users', docId: id, requestId: rid });
            await new Promise(r => eventBus.once(`data:get:${rid}:success`, u => { if (u) { const c = { id: u.uid, username: u.username, name: u.name, photoURL: u.photoURL }; this.cache.set(id, c); details.push(c); } r(); }));
        }
        return details.sort((a, b) => (a.name || a.username).localeCompare(b.name || b.username));
    }

    destroy() { this.cache.clear(); }
}

export default new ContactListModule();
