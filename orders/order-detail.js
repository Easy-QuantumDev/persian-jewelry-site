// ========================================
// ORDER DETAIL JS
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const orderIdElement =
    document.querySelector("#order-id");

const orderDateElement =
    document.querySelector("#order-date");

const orderStatusElement =
    document.querySelector("#order-status");

const productsContainer =
    document.querySelector("#order-products");

const subtotalElement =
    document.querySelector("#subtotal");

const shippingElement =
    document.querySelector("#shipping");

const totalElement =
    document.querySelector("#total");

const cancelOrderBtn =
    document.querySelector("#cancel-order");

const backBtn =
    document.querySelector("#back-btn");

const shopBtn =
    document.querySelector("#shop-btn");

const supportBtn =
    document.querySelector("#support-btn");

const copyOrderBtn =
    document.querySelector("#copy-order");


// ========================================
// DEFAULT ORDER DATA
// ========================================

const defaultOrder = {

    id: "1236",

    date: "۱۴۰۵/۰۵/۲۰",

    status: "shipping",

    shippingCost: 0,

    address: {
        title: "منزل",
        text: "تهران، خیابان ولیعصر، کوچه ۱۲، پلاک ۲۴",
        phone: "0912 123 4567"
    },

    products: [

        {
            id: 1,
            title: "گردنبند مرواریدی",
            englishTitle: "Pearl Necklace",
            price: 850000,
            quantity: 1,
            image: "./image/necklace-1.jpg"
        },

        {
            id: 2,
            title: "انگشتر ظریف طلایی",
            englishTitle: "Golden Ring",
            price: 620000,
            quantity: 1,
            image: "./image/ring-1.jpg"
        },

        {
            id: 3,
            title: "دستبند زنجیری",
            englishTitle: "Chain Bracelet",
            price: 490000,
            quantity: 2,
            image: "./image/bracelet-1.jpg"
        }

    ]

};


// ========================================
// LOAD ORDER
// ========================================

function loadOrder() {

    const savedOrder =
        localStorage.getItem("selectedOrder");

    let order = defaultOrder;


    if (savedOrder) {

        try {

            order =
                JSON.parse(savedOrder);

        } catch (error) {

            console.error(
                "خطا در خواندن سفارش:",
                error
            );

            order =
                defaultOrder;

        }

    }


    renderOrder(order);

}


// ========================================
// RENDER ORDER
// ========================================

function renderOrder(order) {

    renderOrderInfo(order);

    renderProducts(order);

    renderSummary(order);

    renderAddress(order);

    renderStatus(order);

}


// ========================================
// ORDER INFORMATION
// ========================================

function renderOrderInfo(order) {

    if (orderIdElement) {

        orderIdElement.textContent =
            `#${order.id}`;

    }


    if (orderDateElement) {

        orderDateElement.textContent =
            order.date;

    }

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(order) {

    if (!productsContainer) return;


    productsContainer.innerHTML = "";


    if (
        !order.products ||
        order.products.length === 0
    ) {

        productsContainer.innerHTML = `

            <div class="empty-order">

                <i class="fa-solid fa-box-open"></i>

                <h3>
                    محصولی در این سفارش وجود ندارد
                </h3>

            </div>

        `;

        return;

    }


    order.products.forEach(product => {

        const item =
            document.createElement("div");


        item.className =
            "order-product";


        const productTotal =
            product.price *
            product.quantity;


        item.innerHTML = `

                <div class="fallback-icon">

                    <i class="fa-solid fa-gem"></i>

                </div>

            </div>


            <div class="order-product-info">

                <strong>
                    ${product.title}
                </strong>

                <span>
                    ${product.englishTitle || ""}
                </span>

                <small>
                    تعداد: ${toPersianNumber(product.quantity)}
                </small>

            </div>


            <div class="order-product-price">

                <strong>
                    ${formatPrice(productTotal)}
                </strong>

                <span>
                    تومان
                </span>

            </div>

        `;


        productsContainer.appendChild(item);

    });

}


// ========================================
// CALCULATE SUBTOTAL
// ========================================

function calculateSubtotal(order) {

    if (
        !order.products ||
        order.products.length === 0
    ) {

        return 0;

    }


    return order.products.reduce(
        (total, product) => {

            return total +
                (
                    Number(product.price) *
                    Number(product.quantity)
                );

        },
        0
    );

}


// ========================================
// RENDER SUMMARY
// ========================================

function renderSummary(order) {

    const subtotal =
        calculateSubtotal(order);


    const shipping =
        Number(order.shippingCost || 0);


    const total =
        subtotal + shipping;


    if (subtotalElement) {

        subtotalElement.textContent =
            `${formatPrice(subtotal)} تومان`;

    }


    if (shippingElement) {

        if (shipping === 0) {

            shippingElement.textContent =
                "رایگان";

            shippingElement.classList.add(
                "free"
            );

        } else {

            shippingElement.textContent =
                `${formatPrice(shipping)} تومان`;

            shippingElement.classList.remove(
                "free"
            );

        }

    }


    if (totalElement) {

        totalElement.textContent =
            `${formatPrice(total)} تومان`;

    }

}


// ========================================
// RENDER ADDRESS
// ========================================

function renderAddress(order) {

    if (!order.address) return;


    const addressTitle =
        document.querySelector("#address-title");

    const addressText =
        document.querySelector("#address-text");

    const addressPhone =
        document.querySelector("#address-phone");


    if (addressTitle) {

        addressTitle.textContent =
            order.address.title || "آدرس ارسال";

    }


    if (addressText) {

        addressText.textContent =
            order.address.text || "";

    }


    if (addressPhone) {

        addressPhone.textContent =
            order.address.phone || "";

    }

}


// ========================================
// ORDER STATUS
// ========================================

function renderStatus(order) {

    if (!orderStatusElement) return;


    const status =
        order.status || "processing";


    const statusData = {

        pending: {
            text: "در انتظار پرداخت",
            className: "pending"
        },

        processing: {
            text: "در حال پردازش",
            className: "processing"
        },

        shipping: {
            text: "در حال ارسال",
            className: "shipping"
        },

        delivered: {
            text: "تحویل شده",
            className: "delivered"
        },

        cancelled: {
            text: "لغو شده",
            className: "cancelled"
        }

    };


    const current =
        statusData[status] ||
        statusData.processing;


    orderStatusElement.textContent =
        current.text;


    orderStatusElement.className =
        `order-status ${current.className}`;


    updateTimeline(status);

}


// ========================================
// UPDATE ORDER TIMELINE
// ========================================

function updateTimeline(status) {

    const steps =
        document.querySelectorAll(
            ".timeline-step"
        );


    if (!steps.length) return;


    const statusOrder = {

        pending: 0,

        processing: 1,

        shipping: 2,

        delivered: 3,

        cancelled: -1

    };


    const currentStep =
        statusOrder[status] ?? 1;


    steps.forEach((step, index) => {

        step.classList.remove(
            "completed",
            "active",
            "cancelled"
        );


        if (status === "cancelled") {

            step.classList.add(
                "cancelled"
            );

            return;

        }


        if (index < currentStep) {

            step.classList.add(
                "completed"
            );

        }


        else if (index === currentStep) {

            step.classList.add(
                "active"
            );

        }

    });

}


// ========================================
// CANCEL ORDER
// ========================================

if (cancelOrderBtn) {

    cancelOrderBtn.addEventListener(
        "click",
        () => {

            const order =
                getCurrentOrder();


            if (!order) return;


            if (
                order.status === "delivered" ||
                order.status === "cancelled"
            ) {

                showNotification(
                    "این سفارش قابل لغو نیست."
                );

                return;

            }


            const confirmCancel =
                confirm(
                    "آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟"
                );


            if (!confirmCancel) return;


            order.status =
                "cancelled";


            localStorage.setItem(
                "selectedOrder",
                JSON.stringify(order)
            );


            renderOrder(order);


            showNotification(
                "سفارش با موفقیت لغو شد."
            );

        }
    );

}


// ========================================
// GET CURRENT ORDER
// ========================================

function getCurrentOrder() {

    const savedOrder =
        localStorage.getItem(
            "selectedOrder"
        );


    if (!savedOrder) {

        return defaultOrder;

    }


    try {

        return JSON.parse(savedOrder);

    } catch {

        return defaultOrder;

    }

}


// ========================================
// BACK BUTTON
// ========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            if (
                document.referrer &&
                document.referrer !==
                window.location.href
            ) {

                history.back();

            } else {

                window.location.href =
                    "../profile/profile.html";

            }

        }
    );

}


// ========================================
// SHOP BUTTON
// ========================================

if (shopBtn) {

    shopBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "../index.html";

        }
    );

}


// ========================================
// SUPPORT BUTTON
// ========================================

if (supportBtn) {

    supportBtn.addEventListener(
        "click",
        () => {

            showNotification(
                "پشتیبانی به زودی با شما تماس می‌گیرد. 💬"
            );

        }
    );

}


// ========================================
// COPY ORDER ID
// ========================================

if (copyOrderBtn) {

    copyOrderBtn.addEventListener(
        "click",
        async () => {

            const order =
                getCurrentOrder();


            const orderId =
                order.id;


            try {

                await navigator.clipboard.writeText(
                    String(orderId)
                );


                showNotification(
                    "شماره سفارش کپی شد ✓"
                );

            } catch (error) {

                console.error(error);


                showNotification(
                    `شماره سفارش: ${orderId}`
                );

            }

        }
    );

}


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

    const number =
        Number(price) || 0;


    return number
        .toLocaleString("fa-IR");

}


// ========================================
// PERSIAN NUMBERS
// ========================================

function toPersianNumber(value) {

    return String(value)
        .replace(
            /\d/g,
            digit =>
                "۰۱۲۳۴۵۶۷۸۹"[digit]
        );

}


// ========================================
// NOTIFICATION
// ========================================

function showNotification(message) {

    const old =
        document.querySelector(
            ".order-notification"
        );


    if (old) {

        old.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "order-notification";


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 50);


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}


// ========================================
// PRODUCT IMAGE ERROR
// ========================================

document.addEventListener(
    "error",
    function (event) {

        if (
            event.target.tagName ===
            "IMG"
        ) {

            event.target.style.display =
                "none";

        }

    },
    true
);


// ========================================
// STARTUP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOrder();

        console.log(
            "Order Detail JS Loaded Successfully ✓"
        );

    }
);