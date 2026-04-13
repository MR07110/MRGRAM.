// assets/js/modules/contacts/contact-search.js
// 📏 ~30 qator
// Contact Search Moduli

import eventBus from '../../core/event-bus.js';
import { CONTACT_EVENTS, DATA_EVENTS } from '../../constants/events.js';

class ContactSearchModule {
    init() {
        eventBus.on(CONTACT_EVENTS.SEARCH, this.search.bind(this));
        console.log('✅ Contact Search moduli tayyor');
    }

    search({ query }) {
        if (!query || query.length < 2) return;
        const rid = `search_${Date.now()}`;
        const term = query.toLowerCase();
        eventBus.emit(DATA_EVENTS.QUERY, { collection: 'users', queries: [{ field: 'username', operator: '>=', value: term }, { field: 'username', operator: '<=', value: term + '\uf8ff' }, { field: 'limit', operator: 20 }], requestId: rid });
        eventBus.once(`data:query:${rid}:success`, users => {
            const results = users.filter(u => u.username?.toLowerCase().includes(term) || u.name?.toLowerCase().includes(term));
            eventBus.emit('contact:search:results', { results });
        });
    }

    destroy() { eventBus.off(CONTACT_EVENTS.SEARCH, this.search); }
}

export default new ContactSearchModule();
