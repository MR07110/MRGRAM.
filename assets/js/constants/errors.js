// assets/js/constants/errors.js
// 📏 ~60 qator
// Barcha xatolik xabarlari

export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: '❌ Username yoki parol xato!',
    USERNAME_TAKEN: '❌ Bu username allaqachon band!',
    WEAK_PASSWORD: '❌ Parol juda kuchsiz! Kamida 6 ta belgi kiriting.',
    PASSWORDS_NOT_MATCH: '❌ Parollar mos kelmadi!',
    INVALID_USERNAME: '❌ Noto\'g\'ri username formati!',
    LOGIN_REQUIRED: '❌ Davom etish uchun tizimga kiring!',
    NETWORK_ERROR: '❌ Internet aloqasi yo\'q!',
    SESSION_EXPIRED: '❌ Sessiya muddati tugadi!'
};

export const CHAT_ERRORS = {
    MESSAGE_EMPTY: '❌ Xabar bo\'sh bo\'lishi mumkin emas!',
    MESSAGE_TOO_LONG: '❌ Xabar juda uzun! Maksimum 4096 ta belgi.',
    CHAT_NOT_FOUND: '❌ Chat topilmadi!',
    USER_NOT_FOUND: '❌ Foydalanuvchi topilmadi!',
    FORWARD_FAILED: '❌ Forward qilish muvaffaqiyatsiz tugadi!',
    DELETE_FAILED: '❌ O\'chirish muvaffaqiyatsiz tugadi!',
    EDIT_FAILED: '❌ Tahrirlash muvaffaqiyatsiz tugadi!',
    SEND_FAILED: '❌ Xabar yuborilmadi!'
};

export const CALL_ERRORS = {
    MICROPHONE_DENIED: '❌ Mikrofon ruxsati rad etildi!',
    CAMERA_DENIED: '❌ Kamera ruxsati rad etildi!',
    USER_OFFLINE: '❌ Foydalanuvchi tarmoqda emas!',
    USER_BUSY: '❌ Foydalanuvchi band!',
    CALL_FAILED: '❌ Qo\'ng\'iroq muvaffaqiyatsiz tugadi!',
    PEER_CONNECTION_FAILED: '❌ Ulanish o\'rnatilmadi!',
    ALREADY_IN_CALL: '❌ Siz allaqachon qo\'ng\'iroqdasiz!',
    NO_STREAM: '❌ Media oqimi topilmadi!'
};

export const VOICE_ERRORS = {
    RECORDER_DENIED: '❌ Mikrofon ruxsati rad etildi!',
    RECORD_FAILED: '❌ Ovoz yozib olinmadi!',
    PLAY_FAILED: '❌ Ovoz ijro etilmadi!',
    UPLOAD_FAILED: '❌ Ovoz yuklanmadi!'
};

export const VAULT_ERRORS = {
    PIN_REQUIRED: '❌ PIN-kod kiriting!',
    PIN_INVALID: '❌ PIN-kod xato!',
    PIN_LENGTH: '❌ PIN-kod 4 xonali bo\'lishi kerak!',
    PIN_MISMATCH: '❌ PIN-kodlar mos kelmadi!',
    VAULT_LOCKED: '❌ Seyf qulflangan!',
    CONTACT_EXISTS: '❌ Bu kontakt allaqachon seyfda mavjud!',
    CONTACT_NOT_FOUND: '❌ Kontakt topilmadi!'
};

export const UPLOAD_ERRORS = {
    FILE_TOO_LARGE: '❌ Fayl hajmi 100MB dan kichik bo\'lishi kerak!',
    UNSUPPORTED_TYPE: '❌ Bu fayl turi qo\'llab-quvvatlanmaydi!',
    UPLOAD_FAILED: '❌ Yuklash muvaffaqiyatsiz tugadi!',
    AVATAR_TOO_LARGE: '❌ Profil rasmi 5MB dan kichik bo\'lishi kerak!'
};

export const DATA_ERRORS = {
    FETCH_FAILED: '❌ Ma\'lumot olinmadi!',
    SAVE_FAILED: '❌ Ma\'lumot saqlanmadi!',
    UPDATE_FAILED: '❌ Ma\'lumot yangilanmadi!',
    DELETE_FAILED: '❌ Ma\'lumot o\'chirilmadi!',
    NOT_FOUND: '❌ Ma\'lumot topilmadi!'
};

export const GENERAL_ERRORS = {
    SOMETHING_WRONG: '❌ Nimadir xato ketdi! Qaytadan urinib ko\'ring.',
    FEATURE_UNAVAILABLE: '❌ Bu xususiyat hozirda mavjud emas!',
    PERMISSION_DENIED: '❌ Ruxsat berilmagan!'
};

export const getError = (category, key) => {
    const errors = {
        auth: AUTH_ERRORS,
        chat: CHAT_ERRORS,
        call: CALL_ERRORS,
        voice: VOICE_ERRORS,
        vault: VAULT_ERRORS,
        upload: UPLOAD_ERRORS,
        data: DATA_ERRORS,
        general: GENERAL_ERRORS
    };
    return errors[category]?.[key] || GENERAL_ERRORS.SOMETHING_WRONG;
};

export default {
    AUTH_ERRORS,
    CHAT_ERRORS,
    CALL_ERRORS,
    VOICE_ERRORS,
    VAULT_ERRORS,
    UPLOAD_ERRORS,
    DATA_ERRORS,
    GENERAL_ERRORS
};
