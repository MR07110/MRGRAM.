// CORE_BOSS/event-bus.js
// 📏 ~60 qator

class EventBus {
    constructor() {
        this.events = new Map();
        this.debugMode = true;
    }

    on(eventName, callback) {
        if (!this.events.has(eventName)) this.events.set(eventName, new Set());
        this.events.get(eventName).add(callback);
        if (this.debugMode) console.log(`📡 on: ${eventName}`);
        return () => this.off(eventName, callback);
    }

    once(eventName, callback) {
        const wrapper = (data) => { callback(data); this.off(eventName, wrapper); };
        return this.on(eventName, wrapper);
    }

    off(eventName, callback) {
        const cbs = this.events.get(eventName);
        if (cbs) { cbs.delete(callback); if (cbs.size === 0) this.events.delete(eventName); }
    }

    emit(eventName, data = {}) {
        const cbs = this.events.get(eventName);
        if (this.debugMode) console.log(`📤 emit: ${eventName}`, data);
        if (!cbs) return;
        cbs.forEach(cb => { try { cb(data); } catch (e) { console.error(e); } });
    }

    clear() { this.events.clear(); }
    getEventCount() { let t = 0; this.events.forEach(s => t += s.size); return t; }
    setDebug(enabled) { this.debugMode = enabled; }
}

const eventBus = new EventBus();
if (typeof window !== 'undefined') window.eventBus = eventBus;
export default eventBus;
