document.addEventListener('DOMContentLoaded', () => {
    // 1. Yangilangan Headerni chaqiramiz
    if (typeof renderHeader === 'function') {
        renderHeader("MR CHATS");
    }

    const chatsList = document.getElementById('chats-list');

    // Chatlar uchun realistik ma'lumotlar
    const chatsData = [
        { name: "Fazlulloh", msg: "Aka, i3wm-da terminal ranglarini to'g'irladim.", time: "14:25", unread: 2, online: true },
        { name: "MR AI", msg: "Loyiha kodi 100% tayyor. Fayllarni tekshiring.", time: "13:10", unread: 0, online: true },
        { name: "Opam", msg: "Dars jadvalini rasm qilib tashlab yuboring.", time: "Bugun", unread: 0, online: false },
        { name: "Ustoz (Mentor)", msg: "Grant loyihasi bo'yicha ertaga uchrashamiz.", time: "Kecha", unread: 1, online: false },
        { name: "Telegram Team", msg: "Sizning MRGRAM hisobingiz tasdiqlandi.", time: "12 Apr", unread: 0, online: true }
    ];

    const renderChats = () => {
        chatsList.innerHTML = chatsData.map(chat => `
            <div class="chat-item glass">
                <div class="avatar-wrapper">
                    <div class="chat-avatar">${chat.name[0]}</div>
                    ${chat.online ? '<div class="online-badge"></div>' : ''}
                </div>
                <div class="chat-details">
                    <div class="chat-header">
                        <h3>${chat.name}</h3>
                        <span class="chat-time">${chat.time}</span>
                    </div>
                    <div class="chat-msg-row">
                        <p class="chat-msg">${chat.msg}</p>
                        ${chat.unread > 0 ? `<span class="unread-count">${chat.unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    };

    renderChats();
});
