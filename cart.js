// ========================================
// CART
// ========================================

const productsList =
    document.getElementById("products-list");

const cartCount =
    document.getElementById("cart-count");

const summaryCount =
    document.getElementById("summary-count");

const subtotal =
    document.getElementById("subtotal");

const total =
    document.getElementById("total");

const emptyCart =
    document.getElementById("empty-cart");


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(number) {

    return new Intl.NumberFormat("fa-IR")
        .format(number);

}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    const items =
        document.querySelectorAll(".cart-item");


    let totalPrice = 0;

    let totalProducts = 0;


    items.forEach((item) => {

        const price =
            Number(item.dataset.price);


        const quantity =
            Number(
                item.querySelector(".quantity-value").textContent
            );


        totalPrice += price * quantity;

        totalProducts += quantity;

    });


    // Count

    cartCount.textContent =
        `${totalProducts.toLocaleString("fa-IR")} محصول`;


    summaryCount.textContent =
        totalProducts.toLocaleString("fa-IR");


    // Price

    const priceText =
        `${formatPrice(totalPrice)} تومان`;


    subtotal.textContent =
        priceText;


    total.textContent =
        priceText;


    // Empty

    if (items.length === 0) {

        document.querySelector(".cart-container")
            .style.display = "none";

        emptyCart.style.display = "block";

    }

}


// ========================================
// QUANTITY
// ========================================

document.querySelectorAll(".cart-item")
    .forEach((item) => {

        const plus =
            item.querySelector(".quantity-plus");

        const minus =
            item.querySelector(".quantity-minus");

        const value =
            item.querySelector(".quantity-value");


        plus.addEventListener("click", () => {

            let quantity =
                Number(value.textContent);

            quantity++;

            value.textContent =
                quantity.toLocaleString("fa-IR");

            updateCart();

        });


        minus.addEventListener("click", () => {

            let quantity =
                Number(value.textContent);


            if (quantity <= 1) {

                return;

            }


            quantity--;

            value.textContent =
                quantity.toLocaleString("fa-IR");

            updateCart();

        });

    });


// ========================================
// REMOVE PRODUCT
// ========================================

document.querySelectorAll(".remove-product")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const item =
                button.closest(".cart-item");


            if (!item) return;


            item.style.opacity = "0";

            item.style.transform =
                "translateX(20px)";


            setTimeout(() => {

                item.remove();

                updateCart();

            }, 150);

        });

    });


// ========================================
// CHECKOUT
// ========================================

const checkoutBtn =
    document.querySelector(".checkout-btn");


checkoutBtn.addEventListener("click", () => {

    const items =
        document.querySelectorAll(".cart-item");


    if (items.length === 0) {

        return;

    }


    showNotification(
        "در حال انتقال به صفحه پرداخت..."
    );

});


// ========================================
// CLOSE CART
// ========================================

const closeCart =
    document.querySelector(".close-cart");


closeCart.addEventListener("click", () => {

    window.history.back();

});


// ========================================
// NOTIFICATION
// ========================================

function showNotification(message) {

    const old =
        document.querySelector(".cart-notification");


    if (old) {

        old.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "cart-notification";


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    Object.assign(
        notification.style,
        {
            position: "fixed",
            bottom: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3a291e",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: "10px",
            fontSize: "12px",
            zIndex: "9999",
            boxShadow: "0 10px 30px rgba(0,0,0,.15)"
        }
    );


    setTimeout(() => {

        notification.remove();

    }, 2500);

}


// ========================================
// START
// ========================================

updateCart();
