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
       PRODUCT SLIDERS (SWIPER)
       این بخش قبلاً وجود نداشت و باعث می‌شد
       اسلایدرهای محصولات به‌صورت لیست بهم‌ریخته
       (زیر هم / تمام‌عرض) نمایش داده بشن.
    ========================================= */

    if (typeof Swiper !== "undefined") {

        // تنظیمات مشترک برای اسلایدرهای محصول
        // دسکتاپ: 4 محصول کنار هم
        // تبلت:   3 محصول
        // موبایل: 2 محصول
        const productSliderBreakpoints = {

            0: {
                slidesPerView: 2,
                spaceBetween: 12
            },

            600: {
                slidesPerView: 3,
                spaceBetween: 16
            },

            992: {
                slidesPerView: 4,
                spaceBetween: 20
            }

        };


        // اسلایدر گردنبند (بخش اول)

        if (document.querySelector(".necklace-swiper")) {

            new Swiper(".necklace-swiper", {

                slidesPerView: 2,
                spaceBetween: 12,
                breakpoints: productSliderBreakpoints,

                navigation: {
                    nextEl: ".necklace-next",
                    prevEl: ".necklace-prev"
                }

            });

        }


        // اسلایدر دستبند

        if (document.querySelector(".bracelet-swiper")) {

            new Swiper(".bracelet-swiper", {

                slidesPerView: 2,
                spaceBetween: 12,
                breakpoints: productSliderBreakpoints,

                navigation: {
                    nextEl: ".bracelet-next",
                    prevEl: ".bracelet-prev"
                }

            });

        }


        // اسلایدر گردنبند (بخش دوم)

        if (document.querySelector(".necklace-swiper-2")) {

            new Swiper(".necklace-swiper-2", {

                slidesPerView: 2,
                spaceBetween: 12,
                breakpoints: productSliderBreakpoints,

                navigation: {
                    nextEl: ".necklace-next-2",
                    prevEl: ".necklace-prev-2"
                }

            });

        }

    } else {

        console.warn(
            "Swiper بارگذاری نشده — کتابخانه swiper-bundle.min.js را قبل از home.js اضافه کنید."
        );

    }



    /* =========================================
       FAVORITE PRODUCTS
    ========================================= */

    const favoriteButtons =
        document.querySelectorAll(".product-like");


    favoriteButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            event.stopPropagation();


            button.classList.toggle("active");


            const icon =
                button.querySelector("i");


            if (button.classList.contains("active")) {

                if (icon) {

                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");

                }

                button.setAttribute(
                    "aria-label",
                    "حذف از علاقه‌مندی‌ها"
                );

            } else {

                if (icon) {

                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");

                }

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
        document.querySelectorAll(".add-cart");


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
                event.target.closest(".product-like") ||
                event.target.closest(".add-cart")
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