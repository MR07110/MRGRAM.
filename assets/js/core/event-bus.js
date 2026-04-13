// assets/js/core/event-bus.js
// 📏 ~55 qator
// Markaziy Event Bus - Asab tizimi

class EventBus {
    constructor() {
        this.events = new Map();
        this.debugMode = true;
    }

    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }
        this.events.get(eventName).add(callback);
        
        if (this.debugMode) {
            console.log(`📡 on: ${eventName}`);
        }
        
        return () => this.off(eventName, callback);
    }

    once(eventName, callback) {
        const onceWrapper = (data) => {
            callback(data);
            this.off(eventName, onceWrapper);
        };
        return this.on(eventName, onceWrapper);
    }

    off(eventName, callback) {
        const callbacks = this.events.get(eventName);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.events.delete(eventName);
            }
        }
    }

    emit(eventName, data = {}) {
        const callbacks = this.events.get(eventName);
        
        if (this.debugMode) {
            console.log(`📤 emit: ${eventName}`, data);
        }
        
        if (!callbacks || callbacks.size === 0) {
            if (this.debugMode) {
                console.warn(`⚠️ Tinglovchi yo'q: ${eventName}`);
            }
            return;
        }
        
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`❌ EventBus error [${eventName}]:`, error);
            }
        });
    }

    clear() {
        this.events.clear();
        if (this.debugMode) {
            console.log('🧹 EventBus tozalandi');
        }
    }

    getEventCount() {
        let total = 0;
        this.events.forEach(callbacks => total += callbacks.size);
        return total;
    }

    getEventNames() {
        return Array.from(this.events.keys());
    }

    setDebug(enabled) {
        this.debugMode = enabled;
    }
}

const eventBus = new EventBus();

if (typeof window !== 'undefined') {
    window.eventBus = eventBus;
}

export default eventBus;
