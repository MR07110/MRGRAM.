// services/supabase/realtime.js
// 📏 ~50 qator

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_CONFIG } from '../../constants/config.js';

class SupabaseRealtimeService {
    constructor() { this.client = null; this.channels = new Map(); }
    init() { if (!this.client) this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); }

    createChannel(name) { this.init(); if (this.channels.has(name)) return this.channels.get(name); const c = this.client.channel(name); this.channels.set(name, c); return c; }

    subscribe(name, cb) {
        const c = this.createChannel(name);
        c.on('broadcast', { event: 'message' }, p => cb(p.payload));
        c.subscribe(s => { if (s === 'SUBSCRIBED') console.log(`📡 ${name}`); });
        return `${name}_${Date.now()}`;
    }

    async send(name, msg) { const c = this.channels.get(name); if (c) await c.send({ type: 'broadcast', event: 'message', payload: msg }); }

    onDBChange(table, event, cb) {
        const c = this.createChannel(`db-${table}`);
        c.on('postgres_changes', { event, schema: 'public', table }, p => cb({ event: p.eventType, data: p.new, old: p.old }));
        c.subscribe();
    }

    unsubscribe(name) { const c = this.channels.get(name); if (c) { c.unsubscribe(); this.channels.delete(name); } }
    unsubscribeAll() { this.channels.forEach(c => c.unsubscribe()); this.channels.clear(); }
}

export default new SupabaseRealtimeService();
