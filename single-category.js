// ========================================
// CATEGORY DATA
// ========================================

const categories = {

    men: {

        title: "مردانه",

        subtitle: "استایل قدرتمند، جزئیات ماندگار",

        description:
            "مجموعه‌ای از اکسسوری‌های مینیمال و خاص برای آقایانی که به جزئیات اهمیت می‌دهند."

    },

    women: {

        title: "زنانه",

        subtitle: "ظرافتی که دیده می‌شود",

        description:
            "مجموعه‌ای ظریف و چشم‌نواز برای ساختن استایلی خاص، متفاوت و فراموش‌نشدنی."

    }

};


// ========================================
// ELEMENTS
// ========================================

const categoryButtons =
    document.querySelectorAll(".category-option");

const title =
    document.getElementById("category-title");

const subtitle =
    document.getElementById("category-subtitle");

const description =
    document.getElementById("category-description");

const character =
    document.querySelector(".character");


// ========================================
// CHANGE CATEGORY
// ========================================

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const category =
            button.dataset.category;

        changeCategory(category);

    });

});


// ========================================
// CHANGE CATEGORY FUNCTION
// ========================================

function changeCategory(category) {

    const data =
        categories[category];

    if (!data) return;


    // Active button

    categoryButtons.forEach((button) => {

        button.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `[data-category="${category}"]`
        );


    if (activeButton) {

        activeButton.classList.add("active");

    }


    // Animation out

    title.style.opacity = "0";
    subtitle.style.opacity = "0";
    description.style.opacity = "0";

    character.style.opacity = "0";


    setTimeout(() => {

        // Update content

        title.textContent =
            data.title;

        subtitle.textContent =
            data.subtitle;

        description.textContent =
            data.description;


        // Change character style

        if (category === "women") {

            character.classList.add("female");

        } else {

            character.classList.remove("female");

        }


        // Animation in

        title.style.opacity = "1";
        subtitle.style.opacity = "1";
        description.style.opacity = "1";

        character.style.opacity = "1";

    }, 250);

}


// ========================================
// URL CATEGORY
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const urlCategory =
    params.get("category");


if (urlCategory && categories[urlCategory]) {

    changeCategory(urlCategory);

}


// ========================================
// FAVORITES
// ========================================

const favoriteButtons =
    document.querySelectorAll(".favorite");


favoriteButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.preventDefault();

        const icon =
            button.querySelector("i");


        button.classList.toggle("active");


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