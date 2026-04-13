// assets/js/constants/config.js
// 📏 ~50 qator
// Konfiguratsiya sozlamalari

export const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBhzWWFFgrOH84J2RIW5o7l_8192iPtbOg',
    authDomain: 'code-vibe-df610.firebaseapp.com',
    projectId: 'code-vibe-df610',
    storageBucket: 'code-vibe-df610.firebasestorage.app',
    messagingSenderId: '747762490655',
    appId: '1:747762490655:web:125516814620784cf3a42a',
    measurementId: 'G-3QE6F8LWZ1',
    databaseURL: 'https://code-vibe-df610-default-rtdb.firebaseio.com'
};

export const SUPABASE_CONFIG = {
    url: 'https://mujoriozaxjojrgkkars.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11am9yaW96YXhqb2pyZ2trYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjQ1MjQsImV4cCI6MjA5MDU0MDUyNH0.IiCWIT5QU06Wd7fEgRtTkG4IoC5oxyTgRAuWxRf15Zw',
    bucket: 'videos'
};

export const WEBRTC_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
};

export const APP_CONFIG = {
    MAX_MESSAGE_LENGTH: 4096,
    MAX_FILE_SIZE: 100 * 1024 * 1024,
    MAX_AVATAR_SIZE: 5 * 1024 * 1024,
    MAX_VOICE_DURATION: 300,
    TYPING_TIMEOUT: 2000,
    TOAST_DURATION: 3000,
    CACHE_TTL: 5 * 60 * 1000,
    RECONNECT_INTERVAL: 3000,
    MAX_RECONNECT_ATTEMPTS: 5
};

export const STORAGE_PATHS = {
    AVATARS: 'avatars',
    IMAGES: 'images',
    VIDEOS: 'videos',
    AUDIO: 'audio',
    VOICE: 'voice',
    FILES: 'files'
};

export const COLLECTIONS = {
    USERS: 'users',
    CHATS: 'chats',
    MESSAGES: 'messages',
    GROUPS: 'groups',
    CHANNELS: 'channels',
    CALLS: 'calls',
    VAULT: 'vault',
    CONTACTS: 'contacts',
    TYPING: 'typing'
};

export const DEFAULTS = {
    THEME: 'dark',
    LANGUAGE: 'uz',
    PIN: '0000'
};

export const DEBUG_CONFIG = {
    ENABLED: true,
    LOG_LEVEL: 'info',
    SHOW_EVENT_BUS_LOGS: true,
    SHOW_DATA_BOSS_LOGS: true,
    SHOW_UI_BOSS_LOGS: true
};

export const getConfig = (category, key) => {
    const configs = {
        firebase: FIREBASE_CONFIG,
        supabase: SUPABASE_CONFIG,
        webrtc: WEBRTC_CONFIG,
        app: APP_CONFIG,
        storage: STORAGE_PATHS,
        collections: COLLECTIONS,
        defaults: DEFAULTS,
        debug: DEBUG_CONFIG
    };
    return configs[category]?.[key] || null;
};

export const isDebugEnabled = () => DEBUG_CONFIG.ENABLED;

export default {
    FIREBASE_CONFIG,
    SUPABASE_CONFIG,
    WEBRTC_CONFIG,
    APP_CONFIG,
    STORAGE_PATHS,
    COLLECTIONS,
    DEFAULTS,
    DEBUG_CONFIG
};
