// api/app-config.js
export const APP_CONFIG = {
    name: "MRgram",
    version: "1.0.0",
    apiVersion: "v1",
    environment: "development", // development, production
    debug: true,
    
    // Feature flags
    features: {
        voiceCall: false,
        videoCall: false,
        pushNotifications: false,
        location: false,
        bots: true
    },
    
    // Limitlar
    limits: {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        maxMessageLength: 4096,
        maxGroupMembers: 200,
        maxChannelSubscribers: 1000
    },
    
    // Default sozlamalar
    defaults: {
        theme: 'dark',
        language: 'uz',
        notifications: true,
        sound: true
    }
};

// Til sozlamalari
export const LOCALES = {
    uz: {
        appName: "MRgram",
        search: "Qidirish",
        newMessage: "Yangi xabar",
        settings: "Sozlamalar",
        logout: "Chiqish"
    },
    ru: {
        appName: "MRgram",
        search: "Поиск",
        newMessage: "Новое сообщение",
        settings: "Настройки",
        logout: "Выход"
    },
    en: {
        appName: "MRgram",
        search: "Search",
        newMessage: "New Message",
        settings: "Settings",
        logout: "Logout"
    }
};
