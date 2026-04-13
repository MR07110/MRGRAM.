// assets/js/app.js - MRGRAM Global Functions (NO EXPORTS)

const MRGRAM = {
storage: {
get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
set: (key, value) => { localStorage.setItem(key, JSON.stringify(value)); },
remove: (key) => { localStorage.removeItem(key); },
clear: () => { localStorage.clear(); }
},
user: {
get: () => MRGRAM.storage.get("mrgram_user"),
set: (data) => MRGRAM.storage.set("mrgram_user", data),
logout: () => { MRGRAM.storage.clear(); window.location.href = "../"; }
},
onboarding: {
isCompleted: () => MRGRAM.storage.get("onboarding_completed") === "true",
complete: () => MRGRAM.storage.set("onboarding_completed", "true")
},
theme: {
get: () => MRGRAM.storage.get("mrgram_theme") || "dark",
set: (t) => { MRGRAM.storage.set("mrgram_theme", t); document.body.classList.toggle("light-theme", t === "light"); },
toggle: () => { const c = MRGRAM.theme.get(); MRGRAM.theme.set(c === "dark" ? "light" : "dark"); }
},
ui: {
showToast: (msg, type = "info") => {
const toast = document.createElement("div");
toast.className = "toast toast-" + type;
toast.textContent = msg;
toast.style.cssText = "position:fixed; bottom:80px; left:20px; right:20px; background:#1e1e1e; color:white; padding:14px; border-radius:12px; text-align:center; z-index:9999;";
document.body.appendChild(toast);
setTimeout(() => toast.remove(), 3000);
},
setPageTitle: (title) => { document.title = "MR GRAM · " + title; }
}
};

console.log("✅ MRGRAM app.js yuklandi!");
