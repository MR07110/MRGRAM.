// services/supabase/storage.js
// 📏 ~20 qator

import { storageCore } from './storage-core.js';
import { storageUploader } from './storage-uploader.js';
import { storageManager } from './storage-manager.js';

class SupabaseStorageService {
    async upload(file, path, cb) { return storageUploader.upload(file, path, cb); }
    async uploadMany(files, path, cb) { return storageUploader.uploadMany(files, path, cb); }
    async delete(path) { return storageManager.delete(path); }
    async deleteMany(paths) { return storageManager.deleteMany(paths); }
    getUrl(path) { return storageCore.getUrl(path); }
    async exists(path) { return storageManager.exists(path); }
    async listFiles(folder) { return storageManager.listFiles(folder); }
    formatSize(b) { return storageManager.formatSize(b); }
}

export default new SupabaseStorageService();
