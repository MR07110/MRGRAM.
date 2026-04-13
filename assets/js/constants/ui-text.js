// assets/js/constants/ui-text.js
// 📏 ~60 qator
// Barcha UI matnlari

export const APP_INFO = {
    NAME: 'MR GRAM',
    SUBTITLE: 'Premium Edition',
    TAGLINE: 'Zamonaviy, xavfsiz va tezkor messenjer',
    VERSION: '3.0.0'
};

export const PAGE_TITLES = {
    CHATS: 'Chatlar',
    GROUPS: 'Guruhlar',
    CHANNELS: 'Kanallar',
    SETTINGS: 'Sozlamalar',
    SEARCH: 'Qidirish',
    CONTACTS: 'Kontaktlar',
    CALLS: 'Qo\'ng\'iroqlar',
    PROFILE: 'Profil',
    VAULT: 'Maxfiy seyf'
};

export const BUTTONS = {
    SEND: 'Yuborish',
    CANCEL: 'Bekor qilish',
    CONFIRM: 'Tasdiqlash',
    SAVE: 'Saqlash',
    DELETE: 'O\'chirish',
    EDIT: 'Tahrirlash',
    COPY: 'Nusxa olish',
    FORWARD: 'Forward',
    REPLY: 'Javob berish',
    PIN: 'Pin qilish',
    LOGIN: 'Kirish',
    REGISTER: 'Ro\'yxatdan o\'tish',
    LOGOUT: 'Chiqish',
    CLOSE: 'Yopish',
    BACK: 'Orqaga',
    ADD: 'Qo\'shish',
    REMOVE: 'Olib tashlash',
    UPLOAD: 'Yuklash',
    PLAY: 'Ijro etish',
    PAUSE: 'To\'xtatish',
    RECORD: 'Yozish',
    ACCEPT: 'Qabul qilish',
    REJECT: 'Rad etish'
};

export const PLACEHOLDERS = {
    SEARCH: 'Qidirish...',
    MESSAGE: 'Xabar yozing...',
    NAME: 'Ismingiz',
    USERNAME: 'Username',
    PASSWORD: 'Parol',
    CONFIRM_PASSWORD: 'Parolni tasdiqlang',
    GROUP_NAME: 'Guruh nomi',
    CHANNEL_NAME: 'Kanal nomi',
    DESCRIPTION: 'Tavsif',
    PIN: 'PIN-kod'
};

export const STATUS_TEXT = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    TYPING: 'yozmoqda...',
    RECORDING: 'Yozilmoqda...',
    SENDING: 'Yuborilmoqda...',
    CONNECTING: 'Ulanmoqda...',
    LOADING: 'Yuklanmoqda...',
    CALLING: 'Qo\'ng\'iroq qilinmoqda...',
    INCOMING_CALL: 'Kiruvchi qo\'ng\'iroq...',
    BUSY: 'Band'
};

export const EMPTY_STATES = {
    NO_MESSAGES: 'Hozircha xabarlar yo\'q',
    NO_CONTACTS: 'Kontaktlar ro\'yxati bo\'sh',
    NO_GROUPS: 'Siz hech qanday guruhda emassiz',
    NO_CHANNELS: 'Siz hech qanday kanalga obuna emassiz',
    NO_RESULTS: 'Natija topilmadi',
    SEARCH_HINT: '🔍 Foydalanuvchi qidirish'
};

export const CONFIRM_TEXT = {
    DELETE_MESSAGE: 'Xabarni o\'chirishni xohlaysizmi?',
    DELETE_CONTACT: 'Kontaktni o\'chirishni xohlaysizmi?',
    DELETE_GROUP: 'Guruhni o\'chirishni xohlaysizmi?',
    DELETE_ACCOUNT: 'Hisobingizni butunlay o\'chirishni xohlaysizmi?',
    LEAVE_GROUP: 'Guruhdan chiqishni xohlaysizmi?',
    LOGOUT: 'Tizimdan chiqishni xohlaysizmi?',
    CLEAR_CACHE: 'Kesh tozalansinmi?'
};

export const CALL_TEXT = {
    AUDIO_CALL: 'Ovozli qo\'ng\'iroq',
    VIDEO_CALL: 'Video qo\'ng\'iroq',
    END_CALL: 'Qo\'ng\'iroqni tugatish',
    CALL_ENDED: 'Qo\'ng\'iroq tugadi',
    CALL_REJECTED: 'Qo\'ng\'iroq rad etildi',
    CALL_MISSED: 'O\'tkazib yuborilgan qo\'ng\'iroq',
    MIC_OFF: 'Mikrofon o\'chirilgan',
    CAMERA_OFF: 'Kamera o\'chirilgan'
};

export const VAULT_TEXT = {
    ENTER_PIN: 'PIN-kod kiriting',
    NEW_PIN: 'Yangi PIN-kod',
    CONFIRM_PIN: 'PIN-kodni tasdiqlang',
    SECRET_CONTACTS: 'Maxfiy kontaktlar',
    VAULT_LOCKED: 'Seyf qulflangan',
    VAULT_UNLOCKED: 'Seyf ochiq'
};

export const TIME_FORMATS = {
    TODAY: 'Bugun',
    YESTERDAY: 'Kecha',
    MINUTES: 'daqiqa',
    HOURS: 'soat',
    DAYS: 'kun',
    AGO: 'oldin'
};

export const getUIText = (category, key) => {
    const texts = {
        app: APP_INFO,
        page: PAGE_TITLES,
        button: BUTTONS,
        placeholder: PLACEHOLDERS,
        status: STATUS_TEXT,
        empty: EMPTY_STATES,
        confirm: CONFIRM_TEXT,
        call: CALL_TEXT,
        vault: VAULT_TEXT,
        time: TIME_FORMATS
    };
    return texts[category]?.[key] || key;
};

export default {
    APP_INFO,
    PAGE_TITLES,
    BUTTONS,
    PLACEHOLDERS,
    STATUS_TEXT,
    EMPTY_STATES,
    CONFIRM_TEXT,
    CALL_TEXT,
    VAULT_TEXT,
    TIME_FORMATS
};
