// ========================================
// ORDER SUCCESS PAGE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTS
    // ========================================

    const orderNumber =
        document.querySelector("#order-number");

    const orderDate =
        document.querySelector("#order-date");

    const orderTotal =
        document.querySelector("#order-total");

    const orderItemsCount =
        document.querySelector("#order-items-count");

    const trackingCode =
        document.querySelector("#tracking-code");

    const customerName =
        document.querySelector("#customer-name");

    const customerPhone =
        document.querySelector("#customer-phone");

    const customerAddress =
        document.querySelector("#customer-address");

    const continueShoppingBtn =
        document.querySelector("#continue-shopping");

    const viewOrderBtn =
        document.querySelector("#view-order");

    const copyTrackingBtn =
        document.querySelector("#copy-tracking");

    const printOrderBtn =
        document.querySelector("#print-order");

    // ========================================
    // LOAD ORDER DATA
    // ========================================

    function loadOrderData() {

        const savedOrder =
            localStorage.getItem("lastOrder");

        if (!savedOrder) {

            setDefaultData();

            return;
        }

        try {

            const order =
                JSON.parse(savedOrder);

            // Order number
            if (orderNumber && order.orderNumber) {

                orderNumber.textContent =
                    order.orderNumber;

            }

            // Date
            if (orderDate && order.date) {

                orderDate.textContent =
                    order.date;

            }

            // Total
            if (orderTotal && order.total) {

                orderTotal.textContent =
                    formatPrice(order.total) + " تومان";

            }

            // Items count
            if (
                orderItemsCount &&
                order.itemsCount !== undefined
            ) {

                orderItemsCount.textContent =
                    order.itemsCount + " محصول";

            }

            // Tracking code
            if (
                trackingCode &&
                order.trackingCode
            ) {

                trackingCode.textContent =
                    order.trackingCode;

            }

            // Customer
            if (
                customerName &&
                order.name
            ) {

                customerName.textContent =
                    order.name;

            }

            if (
                customerPhone &&
                order.phone
            ) {

                customerPhone.textContent =
                    order.phone;

            }

            if (
                customerAddress &&
                order.address
            ) {

                customerAddress.textContent =
                    order.address;

            }

        }

        catch (error) {

            console.error(
                "خطا در خواندن اطلاعات سفارش:",
                error
            );

            setDefaultData();

        }

    }


    // ========================================
    // DEFAULT DATA
    // ========================================

    function setDefaultData() {

        if (orderNumber) {

            orderNumber.textContent =
                generateOrderNumber();

        }

        if (orderDate) {

            orderDate.textContent =
                getCurrentDate();

        }

        if (orderTotal) {

            orderTotal.textContent =
                "۲,۳۵۰,۰۰۰ تومان";

        }

        if (orderItemsCount) {

            orderItemsCount.textContent =
                "۴ محصول";

        }

        if (trackingCode) {

            trackingCode.textContent =
                generateTrackingCode();

        }

        const savedUser =
            localStorage.getItem("userProfile");

        if (!savedUser) return;

        try {

            const user =
                JSON.parse(savedUser);

            if (
                customerName &&
                user.name
            ) {

                customerName.textContent =
                    user.name;

            }

            if (
                customerPhone &&
                user.phone
            ) {

                customerPhone.textContent =
                    user.phone;

            }

            if (
                customerAddress &&
                user.address
            ) {

                customerAddress.textContent =
                    user.address;

            }

        }

        catch (error) {

            console.error(error);

        }

    }


    // ========================================
    // FORMAT PRICE
    // ========================================

    function formatPrice(price) {

        return Number(price)
            .toLocaleString("fa-IR");

    }


    // ========================================
    // GENERATE ORDER NUMBER
    // ========================================

    function generateOrderNumber() {

        const random =
            Math.floor(
                100000 + Math.random() * 900000
            );

        return "#" + random;

    }


    // ========================================
    // GENERATE TRACKING CODE
    // ========================================

    function generateTrackingCode() {

        const random =
            Math.floor(
                1000000000 +
                Math.random() * 9000000000
            );

        return random.toString();

    }


    // ========================================
    // CURRENT DATE
    // ========================================

    function getCurrentDate() {

        const date =
            new Date();

        return date.toLocaleDateString(
            "fa-IR"
        );

    }


    // ========================================
    // CONTINUE SHOPPING
    // ========================================

    if (continueShoppingBtn) {

        continueShoppingBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../index.html";

            }
        );

    }


    // ========================================
    // VIEW ORDER
    // ========================================

    if (viewOrderBtn) {

        viewOrderBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../profile/profile.html";

            }
        );

    }


    // ========================================
    // COPY TRACKING CODE
    // ========================================

    if (copyTrackingBtn) {

        copyTrackingBtn.addEventListener(
            "click",
            async () => {

                if (!trackingCode) return;

                const code =
                    trackingCode.textContent.trim();

                try {

                    await navigator.clipboard.writeText(
                        code
                    );

                    showNotification(
                        "کد پیگیری کپی شد ✓"
                    );

                    copyTrackingBtn.classList.add(
                        "copied"
                    );

                    setTimeout(() => {

                        copyTrackingBtn.classList.remove(
                            "copied"
                        );

                    }, 1500);

                }

                catch (error) {

                    // Fallback
                    const textarea =
                        document.createElement("textarea");

                    textarea.value = code;

                    document.body.appendChild(
                        textarea
                    );

                    textarea.select();

                    document.execCommand("copy");

                    textarea.remove();

                    showNotification(
                        "کد پیگیری کپی شد ✓"
                    );

                }

            }
        );

    }


    // ========================================
    // PRINT ORDER
    // ========================================

    if (printOrderBtn) {

        printOrderBtn.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

    }


    // ========================================
    // NOTIFICATION
    // ========================================

    function showNotification(message) {

        const old =
            document.querySelector(
                ".success-notification"
            );

        if (old) {

            old.remove();

        }


        const notification =
            document.createElement("div");

        notification.className =
            "success-notification";

        notification.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;


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
    // SUCCESS ANIMATION
    // ========================================

    const successIcon =
        document.querySelector(".success-icon");

    if (successIcon) {

        setTimeout(() => {

            successIcon.classList.add(
                "animate"
            );

        }, 200);

    }


    // ========================================
    // SAVE ORDER IF NOT EXISTS
    // ========================================

    function createOrderIfNeeded() {

        const existingOrder =
            localStorage.getItem("lastOrder");

        if (existingOrder) return;


        const savedUser =
            localStorage.getItem("userProfile");

        let user = {};

        if (savedUser) {

            try {

                user =
                    JSON.parse(savedUser);

            }

            catch (error) {

                user = {};

            }

        }


        const newOrder = {

            orderNumber:
                generateOrderNumber(),

            trackingCode:
                generateTrackingCode(),

            date:
                getCurrentDate(),

            total:
                2350000,

            itemsCount:
                4,

            name:
                user.name || "سارا احمدی",

            phone:
                user.phone || "0912 123 4567",

            address:
                user.address ||
                "تهران، خیابان ولیعصر، کوچه ۱۲، پلاک ۲۴"

        };


        localStorage.setItem(
            "lastOrder",
            JSON.stringify(newOrder)
        );

    }


    // ========================================
    // START
    // ========================================

    createOrderIfNeeded();

    loadOrderData();


    console.log(
        "Order Success JS Loaded Successfully ✓"
    );

});