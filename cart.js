// ========================================
// CART
// ========================================

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [

    {
        id: 1,
        name: "گردنبند مرواریدی",
        category: "گردنبند",
        price: 450000,
        quantity: 1,
        icon: "fa-gem"
    },

    {
        id: 2,
        name: "انگشتر ظریف طلایی",
        category: "انگشتر",
        price: 380000,
        quantity: 1,
        icon: "fa-ring"
    },

    {
        id: 3,
        name: "دستبند زنجیری",
        category: "دستبند",
        price: 420000,
        quantity: 1,
        icon: "fa-link"
    }

];


// ========================================
// ELEMENTS
// ========================================

const cartItems =
    document.getElementById("cart-items");

const emptyCart =
    document.getElementById("empty-cart");

const cartCount =
    document.getElementById("cart-count");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const shippingElement =
    document.getElementById("shipping");

const totalElement =
    document.getElementById("total");

const checkoutBtn =
    document.getElementById("checkout-btn");

const couponInput =
    document.getElementById("coupon-input");

const couponBtn =
    document.getElementById("coupon-btn");

const couponMessage =
    document.getElementById("coupon-message");


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

    return new Intl.NumberFormat("fa-IR")
        .format(price) + " تومان";

}


// ========================================
// SAVE CART
// ========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ========================================
// RENDER CART
// ========================================

function renderCart() {

    cartItems.innerHTML = "";


    // EMPTY

    if (cart.length === 0) {

        emptyCart.style.display = "block";

        checkoutBtn.disabled = true;

        updateSummary();

        return;

    }


    emptyCart.style.display = "none";

    checkoutBtn.disabled = false;


    // PRODUCTS

    cart.forEach((product) => {

        const item =
            document.createElement("div");

        item.className = "cart-item";

        item.dataset.id = product.id;


        item.innerHTML = `

            <div class="product-image">

                <i class="fa-solid ${product.icon}"></i>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>


                <div class="quantity">

                    <button
                        class="increase"
                        data-id="${product.id}">
                        +
                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        class="decrease"
                        data-id="${product.id}">
                        −
                    </button>

                </div>

            </div>


            <div class="product-side">

                <strong class="item-total">
                    ${formatPrice(
                        product.price *
                        product.quantity
                    )}
                </strong>


                <button
                    class="remove-item"
                    data-id="${product.id}">

                    <i class="fa-regular fa-trash-can"></i>

                    حذف

                </button>

            </div>

        `;


        cartItems.appendChild(item);

    });


    updateSummary();

}


// ========================================
// QUANTITY
// ========================================

cartItems.addEventListener(
    "click",
    (e) => {

        const button =
            e.target.closest("button");

        if (!button) return;


        const id =
            Number(button.dataset.id);


        const product =
            cart.find(item => item.id === id);


        if (!product) return;


        // INCREASE

        if (
            button.classList.contains(
                "increase"
            )
        ) {

            product.quantity++;

        }


        // DECREASE

        if (
            button.classList.contains(
                "decrease"
            )
        ) {

            if (product.quantity > 1) {

                product.quantity--;

            }

        }


        // REMOVE

        if (
            button.classList.contains(
                "remove-item"
            )
        ) {

            removeProduct(id);

            return;

        }


        saveCart();

        renderCart();

    }
);


// ========================================
// REMOVE PRODUCT
// ========================================

function removeProduct(id) {

    const item =
        document.querySelector(
            `.cart-item[data-id="${id}"]`
        );


    if (item) {

        item.style.opacity = "0";

        item.style.transform =
            "translateX(30px)";

    }


    setTimeout(() => {

        cart =
            cart.filter(
                product => product.id !== id
            );

        saveCart();

        renderCart();

    }, 250);

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    let subtotal = 0;

    let totalQuantity = 0;


    cart.forEach((product) => {

        subtotal +=
            product.price *
            product.quantity;

        totalQuantity +=
            product.quantity;

    });


    let discount = 0;


    // Example discount

    if (subtotal >= 1000000) {

        discount =
            Math.round(subtotal * 0.10);

    }


    // Free shipping over 800k

    const shipping =
        subtotal === 0 || subtotal >= 800000
            ? 0
            : 60000;


    const total =
        subtotal -
        discount +
        shipping;


    cartCount.textContent =
        `${new Intl.NumberFormat("fa-IR")
            .format(totalQuantity)} محصول`;


    subtotalElement.textContent =
        formatPrice(subtotal);


    discountElement.textContent =
        discount > 0
            ? `-${formatPrice(discount)}`
            : "۰ تومان";


    shippingElement.textContent =
        shipping === 0
            ? "رایگان"
            : formatPrice(shipping);


    totalElement.textContent =
        formatPrice(total);

}


// ========================================
// COUPON
// ========================================

couponBtn.addEventListener(
    "click",
    () => {

        const code =
            couponInput.value
                .trim()
                .toUpperCase();


        if (!code) {

            couponMessage.textContent =
                "لطفاً کد تخفیف را وارد کنید.";

            return;

        }


        if (code === "JEWELRY10") {

            couponMessage.textContent =
                "کد تخفیف با موفقیت اعمال شد ✓";


            couponMessage.style.color =
                "#9ed8a5";


            return;

        }


        couponMessage.textContent =
            "کد تخفیف معتبر نیست.";

        couponMessage.style.color =
            "#e5a29c";

    }
);


// ========================================
// CHECKOUT
// ========================================

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            return;

        }


        localStorage.setItem(
            "checkoutCart",
            JSON.stringify(cart)
        );


        window.location.href =
            "../checkout/checkout.html";

    }
);


// ========================================
// START
// ========================================

renderCart();