// script.js - MRGRAM Global JavaScript

const MRGRAM = {
    storage: {
        get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
        set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
        remove: (key) => { try { localStorage.removeItem(key); return true; } catch { return false; } },
        clear: () => { try { localStorage.clear(); return true; } catch { return false; } }
    },

    user: {
        get: () => MRGRAM.storage.get('mrgram_user'),
        set: (data) => MRGRAM.storage.set('mrgram_user', data),
        logout: () => { MRGRAM.storage.clear(); window.location.href = '../'; },
        isAuthenticated: () => !!MRGRAM.user.get()
    },

    onboard: {
        isCompleted: () => MRGRAM.storage.get('onboarding_completed') === 'true',
        complete: () => MRGRAM.storage.set('onboarding_completed', 'true'),
        reset: () => MRGRAM.storage.remove('onboarding_completed')
    },

    theme: {
        get: () => MRGRAM.storage.get('mrgram_theme') || 'system',
        set: (theme) => { MRGRAM.storage.set('mrgram_theme', theme); MRGRAM.theme.apply(theme); },
        apply: (theme) => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            document.documentElement.classList.toggle('dark', isDark);
        },
        toggle: () => { const t = MRGRAM.theme.get(); MRGRAM.theme.set(t === 'dark' ? 'light' : 'dark'); },
        init: () => { MRGRAM.theme.apply(MRGRAM.theme.get()); }
    },

    ui: {
        showToast: (msg, type = 'info') => {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = msg;
            toast.style.cssText = `position:fixed; bottom:80px; left:20px; right:20px; max-width:400px; margin:0 auto; background:var(--glass-bg); backdrop-filter:blur(20px); padding:14px 20px; border-radius:16px; color:var(--text); font-size:14px; text-align:center; border-left:3px solid ${type==='error'?'var(--error)':'var(--accent)'}; box-shadow:var(--shadow-lg); z-index:9999; animation:slideUp 0.3s ease;`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
        },
        setPageTitle: (title) => { document.title = `MR GRAM · ${title}`; },
        getInitials: (name) => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?',
        formatNumber: (num) => num < 1000 ? num.toString() : num < 1000000 ? (num / 1000).toFixed(1) + 'k' : (num / 1000000).toFixed(1) + 'M',
        debounce: (fn, wait) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
    },

    navigate: {
        to: (path) => window.location.href = path,
        toHome: () => window.location.href = '../home/',
        toOnboard: () => window.location.href = '../onboard/',
        toSettings: () => window.location.href = '../settings/',
        back: () => window.history.back()
    },

    init: () => { MRGRAM.theme.init(); console.log('✅ MRGRAM ready!'); }
};

MRGRAM.init();
window.MRGRAM = MRGRAM;

const style = document.createElement('style');
style.textContent = `@keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}`;
document.head.appendChild(style);

console.log('🚀 MRGRAM loaded!');
