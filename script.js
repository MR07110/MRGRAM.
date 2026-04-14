// script.js - MRGRAM Global | Theme & Storage

const MRGRAM = {
    storage: {
        get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
        set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
        remove: (k) => { try { localStorage.removeItem(k); return true; } catch { return false; } },
        clear: () => { try { localStorage.clear(); } catch {} }
    },

    user: {
        get: () => MRGRAM.storage.get('mrgram_user'),
        set: (d) => MRGRAM.storage.set('mrgram_user', d),
        logout: () => { MRGRAM.storage.clear(); window.location.href = '../'; }
    },

    onboard: {
        done: () => MRGRAM.storage.get('onboarding_completed') === 'true',
        complete: () => MRGRAM.storage.set('onboarding_completed', 'true')
    },

    theme: {
        get: () => MRGRAM.storage.get('mrgram_theme') || 'system',
        set: (t) => {
            MRGRAM.storage.set('mrgram_theme', t);
            MRGRAM.theme.apply(t);
        },
        apply: (t) => {
            const root = document.documentElement;
            const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            root.classList.toggle('dark', isDark);
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        },
        toggle: () => {
            const current = MRGRAM.theme.get();
            const next = current === 'dark' ? 'light' : 'dark';
            MRGRAM.theme.set(next);
            return next;
        },
        init: () => {
            MRGRAM.theme.apply(MRGRAM.theme.get());
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (MRGRAM.theme.get() === 'system') MRGRAM.theme.apply('system');
            });
        }
    },

    ui: {
        showToast: (msg, type = 'info') => {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = msg;
            toast.style.cssText = `position:fixed; bottom:80px; left:20px; right:20px; max-width:400px; margin:0 auto; background:var(--glass-bg); backdrop-filter:blur(20px); padding:14px 20px; border-radius:16px; color:var(--text); border-left:3px solid ${type==='error'?'var(--error)':'var(--accent)'}; box-shadow:var(--shadow-lg); z-index:9999;`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
        },
        setPageTitle: (t) => { document.title = `MR GRAM · ${t}`; },
        getInitials: (n) => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?',
        formatNumber: (n) => n < 1000 ? n.toString() : n < 1000000 ? (n/1000).toFixed(1)+'k' : (n/1000000).toFixed(1)+'M'
    },

    init: () => { MRGRAM.theme.init(); console.log('✅ MRGRAM ready!'); }
};

MRGRAM.init();
window.MRGRAM = MRGRAM;
console.log('🚀 MRGRAM loaded!');
