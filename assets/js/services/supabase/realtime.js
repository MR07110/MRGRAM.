// assets/js/services/supabase/realtime.js
// 📏 ~35 qator
// Supabase Realtime Service

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_CONFIG } from '../../constants/config.js';

class SupabaseRealtimeService {
    constructor() { this.client = null; this.channels = new Map(); }
    init() { if (!this.client) this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); }

    channel(name) { this.init(); if (this.channels.has(name)) return this.channels.get(name); const c = this.client.channel(name); this.channels.set(name, c); return c; }

    subscribe(name, cb) {
        const c = this.channel(name);
        c.on('broadcast', { event: 'message' }, p => cb(p.payload));
        c.subscribe(s => { if (s === 'SUBSCRIBED') console.log(`📡 ${name}`); });
        return `${name}_${Date.now()}`;
    }

    async send(name, msg) { const c = this.channels.get(name); if (c) await c.send({ type: 'broadcast', event: 'message', payload: msg }); }
    onDBChange(table, event, cb) { const c = this.channel(`db-${table}`); c.on('postgres_changes', { event, schema: 'public', table }, p => cb(p)); c.subscribe(); }
    unsubscribe(name) { const c = this.channels.get(name); if (c) { c.unsubscribe(); this.channels.delete(name); } }
    unsubscribeAll() { this.channels.forEach(c => c.unsubscribe()); this.channels.clear(); }
}

export default new SupabaseRealtimeService();
