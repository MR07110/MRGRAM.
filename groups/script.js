document.addEventListener('DOMContentLoaded', () => {
    // Header yuklash
    if (typeof renderHeader === 'function') {
        renderHeader("MR GROUPS");
    }

    const groupsList = document.getElementById('groups-list');

    // Demo guruhlar ma'lumoti
    const myGroups = [
        { name: "Frontend Masters", members: "1.2k", lastMsg: "Kimda Glassmorphism bo'yicha tayyor kod bor?", initial: "FM" },
        { name: "Pentium Linux Users", members: "850", lastMsg: "i3wm configini optimallashtirdik.", initial: "PL" },
        { name: "MR AI Community", members: "5.4k", lastMsg: "Yangi model 2026-yilda chiqadi.", initial: "MA" },
        { name: "Uzbekistan Developers", members: "12k", lastMsg: "Startup uchun grantlar e'lon qilindi.", initial: "UD" },
        { name: "UI/UX Design Lab", members: "3.1k", lastMsg: "Minimalizm - bu kamchilik emas, bu san'at.", initial: "DL" }
    ];

    const renderGroups = () => {
        groupsList.innerHTML = myGroups.map(group => `
            <div class="group-item glass">
                <div class="group-avatar">${group.initial}</div>
                <div class="group-info">
                    <h3>${group.name}</h3>
                    <p>${group.lastMsg}</p>
                </div>
                <div class="group-meta">
                    <span class="member-count">${group.members}</span>
                </div>
            </div>
        `).join('');
    };

    renderGroups();
});
