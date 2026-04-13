// assets/js/constants/events.js
// 📏 ~50 qator
// Barcha event nomlari

export const SYSTEM_EVENTS = {
    READY: 'system:ready',
    STOPPED: 'system:stopped',
    ERROR: 'system:error',
    ONLINE: 'system:online',
    OFFLINE: 'system:offline'
};

export const DATA_EVENTS = {
    READY: 'data:ready',
    GET: 'data:get',
    SET: 'data:set',
    UPDATE: 'data:update',
    DELETE: 'data:delete',
    QUERY: 'data:query',
    CACHE_CLEAR: 'data:cache:clear'
};

export const AUTH_EVENTS = {
    LOGIN: 'auth:login',
    REGISTER: 'auth:register',
    LOGOUT: 'auth:logout',
    REFRESH_TOKEN: 'auth:refresh-token',
    STATE_CHANGED: 'auth:state-changed',
    SESSION_EXPIRED: 'auth:session-expired',
    PROFILE_UPDATED: 'auth:profile-updated'
};

export const UI_EVENTS = {
    READY: 'ui:ready',
    PAGE_OPEN: 'ui:page:open',
    PAGE_CLOSE: 'ui:page:close',
    PAGE_OPENED: 'ui:page:opened',
    PAGE_CLOSED: 'ui:page:closed',
    MODAL_OPEN: 'ui:modal:open',
    MODAL_CLOSE: 'ui:modal:close',
    MODAL_OPENED: 'ui:modal:opened',
    MODAL_CLOSED: 'ui:modal:closed',
    TOAST_SHOW: 'ui:toast:show',
    LOADER_SHOW: 'ui:loader:show',
    LOADER_HIDE: 'ui:loader:hide',
    THEME_CHANGE: 'ui:theme:change',
    THEME_CHANGED: 'ui:theme:changed',
    NEON_PULSE: 'ui:neon:pulse',
    NEON_GLOW: 'ui:neon:glow',
    SOUND_PLAY: 'ui:sound:play',
    SOUND_STOP: 'ui:sound:stop',
    CALL_DURATION_UPDATE: 'ui:call:duration:update',
    TYPING_UPDATE: 'ui:typing:update',
    MESSAGE_READ: 'ui:message:read'
};

export const MODULE_EVENTS = {
    REGISTERED: 'module:registered',
    INITIALIZED: 'module:initialized',
    DESTROYED: 'module:destroyed',
    ERROR: 'module:error'
};

export const CHAT_EVENTS = {
    SEND: 'chat:send',
    RECEIVE: 'chat:receive',
    DELETE: 'chat:delete',
    EDIT: 'chat:edit',
    FORWARD: 'chat:forward',
    REPLY: 'chat:reply',
    TYPING_START: 'chat:typing:start',
    TYPING_STOP: 'chat:typing:stop',
    READ: 'chat:read',
    MESSAGE_SENT: 'chat:message:sent',
    MESSAGE_RECEIVED: 'chat:message:received',
    MESSAGE_DELETED: 'chat:message:deleted',
    MESSAGE_EDITED: 'chat:message:edited',
    MESSAGE_READ: 'chat:message:read'
};

export const CALL_EVENTS = {
    START: 'call:start',
    END: 'call:end',
    ACCEPT: 'call:accept',
    REJECT: 'call:reject',
    INCOMING: 'call:incoming',
    CONNECTED: 'call:connected',
    DISCONNECTED: 'call:disconnected',
    MUTE: 'call:mute',
    UNMUTE: 'call:unmute',
    VIDEO_ON: 'call:video:on',
    VIDEO_OFF: 'call:video:off',
    STREAM_READY: 'call:stream:ready',
    STREAM_STOP: 'call:stream:stop',
    CONNECTION_CREATED: 'call:connection:created',
    CONNECTION_CLOSE: 'call:connection:close'
};

export const VOICE_EVENTS = {
    RECORD_START: 'voice:record:start',
    RECORD_STOP: 'voice:record:stop',
    RECORD_CANCEL: 'voice:record:cancel',
    RECORD_COMPLETE: 'voice:record:complete',
    PLAY_START: 'voice:play:start',
    PLAY_STOP: 'voice:play:stop',
    PLAY_END: 'voice:play:end'
};

export const VAULT_EVENTS = {
    UNLOCK: 'vault:unlock',
    LOCK: 'vault:lock',
    PIN_VERIFY: 'vault:pin:verify',
    PIN_CHANGE: 'vault:pin:change',
    CONTACT_ADD: 'vault:contact:add',
    CONTACT_REMOVE: 'vault:contact:remove',
    CONTACT_LIST: 'vault:contact:list',
    ENCRYPT: 'vault:encrypt',
    DECRYPT: 'vault:decrypt'
};

export const CONTACT_EVENTS = {
    ADD: 'contact:add',
    REMOVE: 'contact:remove',
    SEARCH: 'contact:search',
    LIST: 'contact:list',
    ADDED: 'contact:added',
    REMOVED: 'contact:removed'
};

export const MEDIA_EVENTS = {
    UPLOAD_START: 'media:upload:start',
    UPLOAD_PROGRESS: 'media:upload:progress',
    UPLOAD_COMPLETE: 'media:upload:complete',
    UPLOAD_ERROR: 'media:upload:error',
    PREVIEW: 'media:preview',
    VIEW: 'media:view',
    CAPTURE: 'media:capture'
};

export const STORAGE_EVENTS = {
    UPLOAD: 'storage:upload',
    DELETE: 'storage:delete',
    GET_URL: 'storage:get-url'
};

export const REALTIME_EVENTS = {
    SUBSCRIBE: 'realtime:subscribe',
    UNSUBSCRIBE: 'realtime:unsubscribe',
    SET: 'realtime:set',
    UPDATE: 'realtime:update',
    MESSAGE: 'realtime:message'
};

export default {
    SYSTEM_EVENTS,
    DATA_EVENTS,
    AUTH_EVENTS,
    UI_EVENTS,
    MODULE_EVENTS,
    CHAT_EVENTS,
    CALL_EVENTS,
    VOICE_EVENTS,
    VAULT_EVENTS,
    CONTACT_EVENTS,
    MEDIA_EVENTS,
    STORAGE_EVENTS,
    REALTIME_EVENTS
};
