document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       AOS
    ========================================= */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 900,
            once: true,
            offset: 80,
            easing: "ease-out-cubic"
        });

    }



    /* =========================================
       FAVORITE PRODUCTS
    ========================================= */

    const favoriteButtons =
        document.querySelectorAll(".favorite");


    favoriteButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            event.stopPropagation();


            button.classList.toggle("active");


            if (button.classList.contains("active")) {

                button.innerHTML = "♥";

                button.setAttribute(
                    "aria-label",
                    "حذف از علاقه‌مندی‌ها"
                );

            } else {

                button.innerHTML = "♡";

                button.setAttribute(
                    "aria-label",
                    "افزودن به علاقه‌مندی‌ها"
                );

            }

        });

    });



    /* =========================================
       ADD TO CART
    ========================================= */

    const cartButtons =
        document.querySelectorAll(".cart-btn");


    cartButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            event.stopPropagation();


            // انیمیشن دکمه

            button.classList.add("added");


            setTimeout(() => {

                button.classList.remove("added");

            }, 500);


            // نمایش پیام

            showToast("محصول به سبد خرید اضافه شد 🛒");


            // بروزرسانی تعداد سبد خرید

            updateCartCount();

        });

    });



    /* =========================================
       CART COUNT
    ========================================= */

    function updateCartCount() {

        const cartCount =
            document.querySelector(".cart-count");


        if (!cartCount) return;


        let currentCount =
            parseInt(cartCount.textContent) || 0;


        currentCount++;


        cartCount.textContent =
            currentCount;


        cartCount.classList.add("cart-bump");


        setTimeout(() => {

            cartCount.classList.remove("cart-bump");

        }, 400);

    }



    /* =========================================
       TOAST
    ========================================= */

    function showToast(message) {

        let toast =
            document.querySelector(".shop-toast");


        if (!toast) {

            toast =
                document.createElement("div");


            toast.className =
                "shop-toast";


            document.body.appendChild(toast);

        }


        toast.textContent = message;


        toast.classList.add("show");


        clearTimeout(toast.timer);


        toast.timer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);

    }



    /* =========================================
       CATEGORY SMOOTH SCROLL
    ========================================= */

    const categoryLinks =
        document.querySelectorAll(".category-card");


    categoryLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const target =
                link.getAttribute("href");


            if (!target || target === "#") {

                event.preventDefault();

            }

        });

    });



    /* =========================================
       PRODUCT CARD CLICK
    ========================================= */

    const productCards =
        document.querySelectorAll(".product-card");


    productCards.forEach((card) => {

        card.addEventListener("click", (event) => {

            // اگر روی دکمه علاقه‌مندی یا سبد خرید
            // کلیک شده، وارد محصول نشو

            if (
                event.target.closest(".favorite") ||
                event.target.closest(".cart-btn")
            ) {

                return;

            }


            // بعداً اینجا URL محصول قرار می‌گیرد

            console.log("Product clicked");

        });

    });



    /* =========================================
       COLLECTION BANNER BUTTON
    ========================================= */

    const bannerButtons =
        document.querySelectorAll(
            ".collection-banner .main-btn"
        );


    bannerButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            if (
                button.getAttribute("href") === "#"
            ) {

                event.preventDefault();

            }

        });

    });



    /* =========================================
       HEADER SCROLL EFFECT
       اگر بعداً Header اضافه کردی
    ========================================= */

    window.addEventListener("scroll", () => {

        const header =
            document.querySelector("header");


        if (!header) return;


        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });



    /* =========================================
       IMAGE LAZY LOADING
    ========================================= */

    const images =
        document.querySelectorAll(
            ".product-image img"
        );


    images.forEach((image) => {

        image.setAttribute(
            "loading",
            "lazy"
        );

    });

});