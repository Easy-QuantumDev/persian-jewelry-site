document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       CATEGORY SWIPER
    ========================================== */

    const categorySwiper = new Swiper(".category-swiper", {

        slidesPerView: 4,

        spaceBetween: 18,

        speed: 600,

        grabCursor: true,

        navigation: {

            nextEl: ".category-next",

            prevEl: ".category-prev"

        },

        breakpoints: {

            0: {

                slidesPerView: "auto",

                spaceBetween: 12

            },

            700: {

                slidesPerView: 2,

                spaceBetween: 15

            },

            1000: {

                slidesPerView: 3,

                spaceBetween: 16

            },

            1200: {

                slidesPerView: 4,

                spaceBetween: 18

            }

        }

    });



    /* =========================================
       PRODUCT SWIPER
    ========================================== */

    const productSwiper = new Swiper(".product-swiper", {

        slidesPerView: 4,

        spaceBetween: 18,

        speed: 600,

        grabCursor: true,

        navigation: {

            nextEl: ".product-next",

            prevEl: ".product-prev"

        },

        breakpoints: {

            0: {

                slidesPerView: "auto",

                spaceBetween: 12

            },

            700: {

                slidesPerView: 2,

                spaceBetween: 15

            },

            1000: {

                slidesPerView: 3,

                spaceBetween: 17

            },

            1200: {

                slidesPerView: 4,

                spaceBetween: 18

            }

        }

    });



    /* =========================================
       WISHLIST
    ========================================== */

    const likeButtons =
        document.querySelectorAll(".product-like");


    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("active");


            const icon =
                button.querySelector("i");


            if (button.classList.contains("active")) {

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

            } else {

                icon.classList.remove(
                    "fa-solid"
                );

                icon.classList.add(
                    "fa-regular"
                );

            }

        });

    });



    /* =========================================
       ADD TO CART
    ========================================== */

    const cartButtons =
        document.querySelectorAll(".add-cart");


    cartButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("added");


            const icon =
                button.querySelector("i");

            const text =
                button.querySelector("span");


            icon.classList.remove(
                "fa-cart-shopping"
            );

            icon.classList.add(
                "fa-check"
            );


            text.textContent = "اضافه شد";


            setTimeout(() => {

                button.classList.remove(
                    "added"
                );


                icon.classList.remove(
                    "fa-check"
                );

                icon.classList.add(
                    "fa-cart-shopping"
                );


                text.textContent = "افزودن";

            }, 1500);

        });

    });



    /* =========================================
       HERO BUTTON SMOOTH SCROLL
    ========================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    targetId === "#" ||
                    !document.querySelector(targetId)
                ) {
                    return;
                }


                event.preventDefault();


                document
                    .querySelector(targetId)
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });

});