const cards = document.querySelectorAll(".wishlist-card");

const count = document.getElementById("wishlistCount");

const empty = document.getElementById("wishlistEmpty");

const clearBtn = document.getElementById("clearWishlist");


function updateWishlist() {

    const currentCards =
        document.querySelectorAll(".wishlist-card");

    count.textContent = currentCards.length;


    if (currentCards.length === 0) {

        empty.style.display = "block";

    } else {

        empty.style.display = "none";

    }

}


/* =========================
   REMOVE PRODUCT
========================= */

document.querySelectorAll(".remove-wishlist")
    .forEach(button => {

        button.addEventListener("click", function () {

            const card =
                this.closest(".wishlist-card");

            card.style.opacity = "0";

            card.style.transform = "scale(.9)";

            setTimeout(() => {

                card.remove();

                updateWishlist();

            }, 300);

        });

    });



/* =========================
   CLEAR ALL
========================= */

clearBtn.addEventListener("click", () => {

    const cards =
        document.querySelectorAll(".wishlist-card");

    cards.forEach((card, index) => {

        setTimeout(() => {

            card.style.opacity = "0";

            card.style.transform = "scale(.9)";

        }, index * 50);

    });


    setTimeout(() => {

        document.querySelector(".wishlist-products").innerHTML = "";

        updateWishlist();

    }, cards.length * 50 + 300);

});



/* =========================
   ADD TO CART
========================= */

document.querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener("click", () => {

            const oldText = button.innerHTML;

            button.innerHTML =
                '<i class="fa-solid fa-check"></i> اضافه شد';

            button.style.background = "#789b62";


            setTimeout(() => {

                button.innerHTML = oldText;

                button.style.background = "";

            }, 1500);

        });

    });


updateWishlist();