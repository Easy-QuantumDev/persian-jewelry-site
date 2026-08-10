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
        `${index * 70}ms`;

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