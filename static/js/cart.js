function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

document.addEventListener('DOMContentLoaded', function () {
    const list = document.getElementById('products-list');
    if (!list) return;

    list.addEventListener('click', function (e) {
        const plusBtn = e.target.closest('.quantity-plus');
        const minusBtn = e.target.closest('.quantity-minus');
        const removeBtn = e.target.closest('.remove-product');

        if (plusBtn) handleQuantity(plusBtn.dataset.item, 'increase');
        if (minusBtn) handleQuantity(minusBtn.dataset.item, 'decrease');
        if (removeBtn) handleRemove(removeBtn.dataset.item);
    });
});

function handleQuantity(itemId, action) {
    fetch(`${CART_UPDATE_BASE}${itemId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=${action}`,
    })
        .then((res) => res.json())
        .then((data) => {
            const row = document.querySelector(`.cart-item[data-id="${itemId}"]`);
            if (!row) return;

            if (data.deleted) {
                row.remove();
            } else {
                row.querySelector('.quantity-value').textContent = data.quantity;
            }

            updateSummary(data);
        })
        .catch((err) => console.error('cart update failed', err));
}

function handleRemove(itemId) {
    fetch(`${CART_REMOVE_BASE}${itemId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            const row = document.querySelector(`.cart-item[data-id="${itemId}"]`);
            if (row) row.remove();
            updateSummary(data);
        })
        .catch((err) => console.error('cart remove failed', err));
}

function updateSummary(data) {
    const count = document.getElementById('products-list').children.length;

    document.getElementById('cart-count').textContent = `${count} محصول`;
    document.getElementById('summary-count').textContent = count;
    document.getElementById('subtotal').textContent = `${formatNumber(data.cart_total)} تومان`;
    document.getElementById('total').textContent = `${formatNumber(data.cart_total)} تومان`;

    if (count === 0) {
        document.querySelector('.cart-container').style.display = 'none';
        document.getElementById('empty-cart').style.display = 'flex';
    }
}