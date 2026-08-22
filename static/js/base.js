const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");
const overlay = document.querySelector(".overlay");


function openMenu() {

    mobileMenu.classList.add("active");
    overlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeMobileMenu() {

    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");

    document.body.style.overflow = "";

}


menuBtn?.addEventListener("click", openMenu);

closeMenu?.addEventListener("click", closeMobileMenu);

overlay?.addEventListener("click", closeMobileMenu);


document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


/* =========================================
   SEARCH
========================================= */

const searchTrigger =
    document.getElementById("searchTrigger");

const searchOverlay =
    document.getElementById("searchOverlay");

const searchClose =
    document.getElementById("searchClose");

const searchInput =
    document.getElementById("searchInput");

const searchClear =
    document.getElementById("searchClear");

const popularSearch =
    document.getElementById("popularSearch");

const searchResults =
    document.getElementById("searchResults");

const searchEmpty =
    document.getElementById("searchEmpty");


/* =========================================
   OPEN
========================================= */

searchTrigger.addEventListener("click", () => {

    searchOverlay.classList.add("active");

    document.body.classList.add("search-open");

    setTimeout(() => {

        searchInput.focus();

    }, 300);

});


/* =========================================
   CLOSE
========================================= */

function closeSearch() {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("search-open");

    searchInput.value = "";

    searchClear.classList.remove("active");

    popularSearch.style.display = "block";

    searchResults.style.display = "block";

    searchEmpty.classList.remove("active");

}


searchClose.addEventListener(
    "click",
    closeSearch
);


/* =========================================
   CLICK OUTSIDE
========================================= */

searchOverlay.addEventListener("click", (e) => {

    if (e.target === searchOverlay) {

        closeSearch();

    }

});


/* =========================================
   ESC
========================================= */

document.addEventListener("keydown", (e) => {

    if (
        e.key === "Escape" &&
        searchOverlay.classList.contains("active")
    ) {

        closeSearch();

    }

});


/* =========================================
   INPUT
========================================= */

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value.trim();

    if (value.length > 0) {

        searchClear.classList.add("active");

        popularSearch.style.display = "none";

        /*
         * اینجا بعداً API / Django Search
         * وصل می‌کنیم.
         */

        searchResults.style.display = "block";

    } else {

        searchClear.classList.remove("active");

        popularSearch.style.display = "block";

        searchResults.style.display = "block";

        searchEmpty.classList.remove("active");

    }

});


/* =========================================
   CLEAR
========================================= */

searchClear.addEventListener("click", () => {

    searchInput.value = "";

    searchInput.focus();

    searchClear.classList.remove("active");

    popularSearch.style.display = "block";

    searchResults.style.display = "block";

    searchEmpty.classList.remove("active");

});


/* =========================================
   POPULAR SEARCH
========================================= */

const searchTags =
    document.querySelectorAll(
        ".search-tags button"
    );


searchTags.forEach(tag => {

    tag.addEventListener("click", () => {

        const value =
            tag.dataset.search;

        searchInput.value = value;

        searchInput.dispatchEvent(
            new Event("input")
        );

        searchInput.focus();

    });

});