// assets/js/utils/validators.js
// 📏 ~30 qator
// Validatsiya funksiyalari

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export function isValidPassword(password) {
    return password && password.length >= 6;
}

export function isFileSizeValid(file, maxSize = 100 * 1024 * 1024) {
    return file && file.size <= maxSize;
}

export function isFileTypeValid(file, allowedTypes = []) {
    if (!allowedTypes.length) return true;
    return allowedTypes.some(t => file.type.startsWith(t) || file.name.endsWith(t));
}

export function isNotEmpty(value) { return value && value.trim().length > 0; }

export default { isValidEmail, isValidUsername, isValidPassword, isFileSizeValid, isFileTypeValid, isNotEmpty };
