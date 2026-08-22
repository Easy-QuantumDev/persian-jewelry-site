const products = [

    {
        id: 1,
        name: "انگشتر نگین دار",
        category: "ring",
        categoryName: "انگشتر",
        price: 890000,
        image: "images/ring-1.jpg",
        label: "جدید"
    },

    {
        id: 2,
        name: "گردنبند ظریف",
        category: "necklace",
        categoryName: "گردنبند",
        price: 1250000,
        image: "images/necklace-1.jpg",
        label: "محبوب"
    },

    {
        id: 3,
        name: "دستبند زنجیری",
        category: "bracelet",
        categoryName: "دستبند",
        price: 750000,
        image: "images/bracelet-1.jpg"
    },

    {
        id: 4,
        name: "گوشواره نگین دار",
        category: "earring",
        categoryName: "گوشواره",
        price: 690000,
        image: "images/earring-1.jpg"
    },

    {
        id: 5,
        name: "انگشتر کلاسیک",
        category: "ring",
        categoryName: "انگشتر",
        price: 950000,
        image: "images/ring-2.jpg"
    },

    {
        id: 6,
        name: "گردنبند کلاسیک",
        category: "necklace",
        categoryName: "گردنبند",
        price: 1450000,
        image: "images/necklace-2.jpg",
        label: "جدید"
    }

];


const grid =
    document.getElementById("productsGrid");

const count =
    document.getElementById("productCount");

const empty =
    document.getElementById("emptyProducts");

const sortSelect =
    document.getElementById("sortSelect");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");


let selectedCategory = "all";


/* =========================================
   RENDER
========================================= */

function renderProducts(items) {

    grid.innerHTML = "";

    count.textContent =
        `${items.length.toLocaleString("fa-IR")} محصول`;


    if (items.length === 0) {

        empty.style.display = "block";

        return;

    }


    empty.style.display = "none";


    items.forEach(product => {

        const card = document.createElement("article");

        card.className =
            "store-product-card";


        card.innerHTML = `

            <div class="store-product-image">

                ${
                    product.label
                    ?
                    `<span class="product-label ${
                        product.label === "محبوب"
                        ? "popular"
                        : ""
                    }">
                        ${product.label}
                    </span>`
                    :
                    ""
                }

                <button class="wishlist-btn">

                    <i class="fa-regular fa-heart"></i>

                </button>


                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <a
                    href="product-detail.html?id=${product.id}"
                    class="quick-view"
                >
                    مشاهده محصول
                </a>

            </div>


            <div class="store-product-info">

                <span class="product-type">
                    ${product.categoryName}
                </span>

                <h3>
                    ${product.name}
                </h3>


                <div class="product-card-bottom">

                    <strong>
                        ${product.price.toLocaleString("fa-IR")}
                        تومان
                    </strong>


                    <button
                        class="cart-btn"
                        data-id="${product.id}"
                    >

                        <i class="fa-solid fa-bag-shopping"></i>

                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


renderProducts(products);



/* =========================================
   CATEGORY FILTER
========================================= */

document
    .querySelectorAll(
        'input[name="category"]'
    )
    .forEach(input => {

        input.addEventListener("change", () => {

            selectedCategory =
                input.value;

            filterProducts();

        });

    });



/* =========================================
   FILTER
========================================= */

document
    .getElementById("applyFilter")
    .addEventListener("click", filterProducts);


function filterProducts() {

    let result =
        [...products];


    if (selectedCategory !== "all") {

        result =
            result.filter(product =>
                product.category === selectedCategory
            );

    }


    const min =
        Number(minPrice.value) || 0;

    const max =
        Number(maxPrice.value) || Infinity;


    result =
        result.filter(product =>
            product.price >= min &&
            product.price <= max
        );


    sortProducts(result);

}



/* =========================================
   SORT
========================================= */

sortSelect.addEventListener(
    "change",
    filterProducts
);


function sortProducts(items) {

    const type =
        sortSelect.value;


    if (type === "cheap") {

        items.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (type === "expensive") {

        items.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    renderProducts(items);

}



/* =========================================
   MOBILE FILTER
========================================= */

const sidebar =
    document.querySelector(
        ".filter-sidebar"
    );


document
    .getElementById("openFilter")
    .addEventListener("click", () => {

        sidebar.classList.add("active");

        document.body.style.overflow =
            "hidden";

    });


document
    .getElementById("closeFilter")
    .addEventListener("click", () => {

        sidebar.classList.remove("active");

        document.body.style.overflow =
            "";

    });