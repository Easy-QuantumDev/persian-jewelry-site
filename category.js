// ========================================
// CATEGORY PAGE
// ========================================

const cards = document.querySelectorAll(
    ".gender-card, .category-card"
);


// ========================================
// REVEAL ANIMATION
// ========================================

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add(
                    "show"
                );

                observer.unobserve(
                    entry.target
                );

            }

        });

    },
    {
        threshold: 0.15
    }
);


cards.forEach((card, index) => {

    card.style.transitionDelay =
        `${index * 1}ms`;

    observer.observe(card);

});


// ========================================
// CATEGORY CLICK
// ========================================

cards.forEach((card) => {

    card.addEventListener("click", () => {

        const category =
            card.querySelector("h3")?.textContent
                .trim();

        console.log(
            "Selected category:",
            category
        );

    });

})
const categorySwiper = new Swiper(".category-swiper", {

    direction: "horizontal",

    rtl: true,

    grabCursor: true,

    speed: 600,

    spaceBetween: 18,

    slidesPerView: 1.2,

    navigation: {
        nextEl: ".category-next",
        prevEl: ".category-prev",
    },

    breakpoints: {

        576: {
            slidesPerView: 2,
            spaceBetween: 18,
        },

        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },

        1024: {
            slidesPerView: 4,
            spaceBetween: 22,
        },

        1300: {
            slidesPerView: 4,
            spaceBetween: 24,
        }

    }

});