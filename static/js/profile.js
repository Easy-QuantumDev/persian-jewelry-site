// =====================================================
// PROFILE.JS
// Jewelry Store
//
// NOTE: the previous version of this file managed
// everything (nav switching, editing personal info,
// editing address, statistics) with localStorage and
// hijacked clicks with event.preventDefault(). Now that
// the sidebar links, edit buttons and address edit link
// to real Django pages/views, all of that was removed —
// it would have blocked real navigation and real form
// submissions. Only harmless cosmetic bits are kept.
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------------------------------------------------
    // LOGOUT CONFIRMATION
    // Uses the real accounts:logout link — only cancels
    // navigation if the user says "no".
    // ---------------------------------------------------
    const logoutBtn = document.querySelector('.logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (event) {
            const confirmLogout = confirm('آیا مطمئن هستید که می‌خواهید از حساب خارج شوید؟');
            if (!confirmLogout) {
                event.preventDefault();
            }
        });
    }

    // ---------------------------------------------------
    // RECENT ORDERS — cosmetic highlight only
    // ---------------------------------------------------
    document.querySelectorAll('.order-item').forEach(function (order) {
        order.addEventListener('click', function () {
            document.querySelectorAll('.order-item').forEach(function (item) {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // ---------------------------------------------------
    // NOTIFICATION BELL — no real notifications backend yet
    // ---------------------------------------------------
    const notificationBtn = document.querySelector('.notification-btn');

    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            showNotification('اعلان جدیدی ندارید ✨');
        });
    }

});

// =====================================================
// NOTIFICATION SYSTEM (kept — purely cosmetic toast)
// =====================================================

function showNotification(message) {

    const oldNotification = document.querySelector('.profile-notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'profile-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(function () {
        notification.classList.add('show');
    }, 50);

    setTimeout(function () {
        notification.classList.remove('show');
        setTimeout(function () {
            notification.remove();
        }, 300);
    }, 2500);
}