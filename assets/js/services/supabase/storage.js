// assets/js/services/supabase/storage.js
// 📏 ~45 qator
// Supabase Storage Service

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_CONFIG } from '../../constants/config.js';

class SupabaseStorageService {
    constructor() { this.client = null; this.bucket = SUPABASE_CONFIG.bucket; }
    init() { if (!this.client) this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); }

    async upload(file, folder) {
        this.init();
        const ext = file.name.split('.').pop();
        const name = `${Date.now()}_${Math.random().toString(36).substring(2,8)}.${ext}`;
        const path = folder ? `${folder}/${name}` : name;
        const { error } = await this.client.storage.from(this.bucket).upload(path, file, { cacheControl: '3600' });
        if (error) throw error;
        const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
        return { url: data.publicUrl, path, name, size: file.size };
    }

    async delete(path) { this.init(); const { error } = await this.client.storage.from(this.bucket).remove([path]); if (error) throw error; return true; }
    getUrl(path) { this.init(); return this.client.storage.from(this.bucket).getPublicUrl(path).data.publicUrl; }
    formatSize(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b/1024).toFixed(1) + ' KB'; return (b/1048576).toFixed(1) + ' MB'; }
}

export default new SupabaseStorageService();
