// assets/js/core/data-boss.js
// 📏 ~70 qator
// Data Boss - Ma'lumotlar oqimi

import eventBus from './event-bus.js';
import { DATA_EVENTS, AUTH_EVENTS, STORAGE_EVENTS, REALTIME_EVENTS } from '../constants/events.js';

class DataBoss {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.subscriptions = new Map();
        this.isInitialized = false;
        this.services = {};
        
        console.log('📊 DATA BOSS yaratildi');
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Data Boss ishga tushmoqda...');
        
        await this.loadServices();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ Data Boss tayyor');
        
        eventBus.emit(DATA_EVENTS.READY);
    }

    async loadServices() {
        try {
            const firestoreModule = await import('../services/firebase/firestore.js');
            const authModule = await import('../services/firebase/auth.js');
            const realtimeModule = await import('../services/firebase/realtime.js');
            const supabaseStorageModule = await import('../services/supabase/storage.js');
            const supabaseRealtimeModule = await import('../services/supabase/realtime.js');
            
            this.services.firestore = firestoreModule.default;
            this.services.auth = authModule.default;
            this.services.realtime = realtimeModule.default;
            this.services.supabaseStorage = supabaseStorageModule.default;
            this.services.supabaseRealtime = supabaseRealtimeModule.default;
            
            console.log('✅ Services yuklandi');
        } catch (error) {
            console.error('❌ Services yuklashda xatolik:', error);
        }
    }

    setupEventListeners() {
        eventBus.on(DATA_EVENTS.GET, this.handleGet.bind(this));
        eventBus.on(DATA_EVENTS.SET, this.handleSet.bind(this));
        eventBus.on(DATA_EVENTS.UPDATE, this.handleUpdate.bind(this));
        eventBus.on(DATA_EVENTS.DELETE, this.handleDelete.bind(this));
        eventBus.on(DATA_EVENTS.QUERY, this.handleQuery.bind(this));
        
        eventBus.on('auth:login:request', this.handleLogin.bind(this));
        eventBus.on('auth:register:request', this.handleRegister.bind(this));
        eventBus.on(AUTH_EVENTS.LOGOUT, this.handleLogout.bind(this));
        
        eventBus.on(STORAGE_EVENTS.UPLOAD, this.handleUpload.bind(this));
        eventBus.on(STORAGE_EVENTS.DELETE, this.handleDeleteFile.bind(this));
        
        console.log('📡 Data Boss eventlarni tinglayapti');
    }

    async handleGet({ collection, docId, requestId }) {
        try {
            const data = await this.services.firestore.get(collection, docId);
            eventBus.emit(`data:get:${requestId}:success`, data);
        } catch (error) {
            eventBus.emit(`data:get:${requestId}:error`, error);
        }
    }

    async handleSet({ collection, docId, data, requestId }) {
        try {
            const result = await this.services.firestore.set(collection, docId, data);
            eventBus.emit(`data:set:${requestId}:success`, result);
        } catch (error) {
            eventBus.emit(`data:set:${requestId}:error`, error);
        }
    }

    async handleUpdate({ collection, docId, data, requestId }) {
        try {
            const result = await this.services.firestore.update(collection, docId, data);
            eventBus.emit(`data:update:${requestId}:success`, result);
        } catch (error) {
            eventBus.emit(`data:update:${requestId}:error`, error);
        }
    }

    async handleDelete({ collection, docId, requestId }) {
        try {
            const result = await this.services.firestore.delete(collection, docId);
            eventBus.emit(`data:delete:${requestId}:success`, result);
        } catch (error) {
            eventBus.emit(`data:delete:${requestId}:error`, error);
        }
    }

    async handleQuery({ collection, queries, requestId }) {
        try {
            const data = await this.services.firestore.query(collection, queries);
            eventBus.emit(`data:query:${requestId}:success`, data);
        } catch (error) {
            eventBus.emit(`data:query:${requestId}:error`, error);
        }
    }

    async handleLogin({ email, password, requestId }) {
        try {
            const user = await this.services.auth.login(email, password);
            eventBus.emit(`auth:login:${requestId}:success`, user);
            eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user, status: 'login' });
        } catch (error) {
            eventBus.emit(`auth:login:${requestId}:error`, error);
        }
    }

    async handleRegister({ email, password, userData, requestId }) {
        try {
            const user = await this.services.auth.register(email, password, userData);
            eventBus.emit(`auth:register:${requestId}:success`, user);
            eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user, status: 'register' });
        } catch (error) {
            eventBus.emit(`auth:register:${requestId}:error`, error);
        }
    }

    async handleLogout({ requestId }) {
        try {
            await this.services.auth.logout();
            this.cache.clear();
            eventBus.emit(`auth:logout:${requestId}:success`);
            eventBus.emit(AUTH_EVENTS.STATE_CHANGED, { user: null, status: 'logout' });
        } catch (error) {
            eventBus.emit(`auth:logout:${requestId}:error`, error);
        }
    }

    async handleUpload({ file, path, requestId }) {
        try {
            const result = await this.services.supabaseStorage.upload(file, path);
            eventBus.emit(`storage:upload:${requestId}:success`, result);
        } catch (error) {
            eventBus.emit(`storage:upload:${requestId}:error`, error);
        }
    }

    async handleDeleteFile({ path, requestId }) {
        try {
            const result = await this.services.supabaseStorage.delete(path);
            eventBus.emit(`storage:delete:${requestId}:success`, result);
        } catch (error) {
            eventBus.emit(`storage:delete:${requestId}:error`, error);
        }
    }

    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) this.cache.delete(key);
            }
        } else {
            this.cache.clear();
        }
    }

    report() {
        return {
            initialized: this.isInitialized,
            cacheSize: this.cache.size,
            subscriptions: this.subscriptions.size,
            services: Object.keys(this.services)
        };
    }
}

const dataBoss = new DataBoss();

export default dataBoss;
