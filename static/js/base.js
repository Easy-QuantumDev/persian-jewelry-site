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

const searchProductList =
    document.getElementById("searchProductList");

const searchAllLink =
    document.getElementById("searchAllLink");

const SEARCH_URL = searchOverlay?.dataset.searchUrl;
const LIST_URL = searchOverlay?.dataset.listUrl;

let searchDebounce = null;
let searchAbortController = null;


/* =========================================
   OPEN
========================================= */

searchTrigger?.addEventListener("click", () => {

    searchOverlay.classList.add("active");

    document.body.classList.add("search-open");

    setTimeout(() => {

        searchInput.focus();

    }, 300);

});


/* =========================================
   CLOSE
========================================= */

function resetSearchState() {

    popularSearch.style.display = "block";

    searchResults.style.display = "none";

    searchEmpty.classList.remove("active");

    searchProductList.innerHTML = "";

}


function closeSearch() {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("search-open");

    searchInput.value = "";

    searchClear.classList.remove("active");

    clearTimeout(searchDebounce);

    resetSearchState();

}


searchClose?.addEventListener(
    "click",
    closeSearch
);


/* =========================================
   CLICK OUTSIDE
========================================= */

searchOverlay?.addEventListener("click", (e) => {

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
        searchOverlay?.classList.contains("active")
    ) {

        closeSearch();

    }

});


/* =========================================
   RENDER RESULTS
========================================= */

function renderSearchResults(results) {

    searchProductList.innerHTML = "";

    results.forEach(item => {

        const link = document.createElement("a");
        link.href = item.url;
        link.className = "search-product";

        link.innerHTML = `
            <div class="search-product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="search-product-info">
                <span>${item.category}</span>
                <h4>${item.name}</h4>
                <strong>${item.price} تومان</strong>
            </div>
            <i class="fa-solid fa-arrow-left"></i>
        `;

        searchProductList.appendChild(link);

    });

}


/* =========================================
   RUN SEARCH (Django endpoint)
========================================= */

function runSearch(value) {

    if (!SEARCH_URL) return;

    if (searchAbortController) {
        searchAbortController.abort();
    }

    searchAbortController = new AbortController();

    fetch(`${SEARCH_URL}?q=${encodeURIComponent(value)}`, {
        signal: searchAbortController.signal,
    })
        .then(res => res.json())
        .then(data => {

            if (searchAllLink) {
                searchAllLink.href = data.view_all_url || LIST_URL || "#";
            }

            if (data.results && data.results.length > 0) {

                renderSearchResults(data.results);

                searchResults.style.display = "block";
                searchEmpty.classList.remove("active");

            } else {

                searchProductList.innerHTML = "";

                searchResults.style.display = "none";
                searchEmpty.classList.add("active");

            }

        })
        .catch(err => {

            if (err.name !== "AbortError") {
                console.error("جستجو با خطا مواجه شد:", err);
            }

        });

}


/* =========================================
   INPUT
========================================= */

searchInput?.addEventListener("input", () => {

    const value =
        searchInput.value.trim();

    clearTimeout(searchDebounce);

    if (value.length > 0) {

        searchClear.classList.add("active");

        popularSearch.style.display = "none";

        searchDebounce = setTimeout(() => {

            runSearch(value);

        }, 300);

    } else {

        if (searchAbortController) {
            searchAbortController.abort();
        }

        searchClear.classList.remove("active");

        resetSearchState();

    }

});


/* =========================================
   CLEAR
========================================= */

searchClear?.addEventListener("click", () => {

    searchInput.value = "";

    searchInput.focus();

    searchClear.classList.remove("active");

    clearTimeout(searchDebounce);

    if (searchAbortController) {
        searchAbortController.abort();
    }

    resetSearchState();

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


/* =========================================
   ADD TO CART — POPUP + LIVE BADGE
   (روی هر فرم افزودن به سبد خرید تو کل سایت کار می‌کنه:
   home, category, single-category, product-list, single_product)
========================================= */

function updateCartBadge(count) {

    document.querySelectorAll(".cart-count").forEach(el => {

        el.textContent = count;

    });

}


function showCartToast(message, isError) {

    let toast = document.getElementById("cartToast");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "cartToast";

        toast.style.cssText = `
            position: fixed;
            bottom: 26px;
            left: 50%;
            transform: translateX(-50%) translateY(16px);
            background: #1c1c1c;
            color: #fff;
            padding: 13px 22px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 12px 30px rgba(0,0,0,.28);
            opacity: 0;
            transition: opacity .25s ease, transform .25s ease;
            pointer-events: none;
        `;

        document.body.appendChild(toast);

    }

    toast.style.background = isError ? "#c0392b" : "#1c1c1c";

    toast.innerHTML = `
        <i class="fa-solid ${isError ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
        <span>${message}</span>
    `;

    requestAnimationFrame(() => {

        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";

    });

    clearTimeout(toast._hideTimer);

    toast._hideTimer = setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(16px)";

    }, 2200);

}


document.addEventListener("submit", (event) => {

    const submitter = event.submitter;

    if (!submitter) return;

    const isAddToCart =
        submitter.classList.contains("add-cart") ||
        submitter.classList.contains("cart-btn") ||
        submitter.classList.contains("add-cart-btn");

    // دکمه‌ی «خرید فوری» باید عادی سابمیت بشه و بره صفحه‌ی چک‌اوت،
    // نه اینکه با AJAX قطع بشه
    const isBuyNow =
        submitter.name === "buy_now";

    if (!isAddToCart || isBuyNow) return;

    const form = event.target;

    if (form.method.toLowerCase() !== "post") return;

    event.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        body: formData,
    })
        .then(res => {

            if (!res.ok) throw new Error("request-failed");

            return res.json();

        })
        .then(data => {

            if (!data.ok) {

                showCartToast("اضافه کردن محصول با خطا مواجه شد", true);

                return;

            }

            updateCartBadge(data.item_count);

            if (data.limited) {

                showCartToast("موجودی محدوده — حداکثر تعداد ممکن اضافه شد", true);

            } else {

                showCartToast("محصول به سبد خرید اضافه شد ✓");

            }

        })
        .catch(() => {

            showCartToast("برای افزودن به سبد خرید ابتدا وارد حساب کاربری شوید", true);

        });

});