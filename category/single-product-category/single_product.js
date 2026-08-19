

/* ============================================
   PRODUCT IMAGE GALLERY
============================================ */

const mainImage =
    document.getElementById("mainProductImage");

const thumbnails =
    document.querySelectorAll(".thumbnail");

const currentImage =
    document.getElementById("currentImage");


thumbnails.forEach((thumbnail, index) => {

    thumbnail.addEventListener("click", () => {


        const image =
            thumbnail.dataset.image;


        mainImage.src = image;


        thumbnails.forEach(item => {

            item.classList.remove("active");

        });


        thumbnail.classList.add("active");


        currentImage.textContent =
            String(index + 1).padStart(2, "0");

    });

});



/* ============================================
   QUANTITY
============================================ */

const plusBtn =
    document.getElementById("plusBtn");

const minusBtn =
    document.getElementById("minusBtn");

const quantity =
    document.getElementById("quantity");


let count = 1;


plusBtn.addEventListener("click", () => {

    if (count < 10) {

        count++;

        quantity.textContent = count;

    }

});


minusBtn.addEventListener("click", () => {

    if (count > 1) {

        count--;

        quantity.textContent = count;

    }

});



/* ============================================
   COLOR
============================================ */

const colorOptions =
    document.querySelectorAll(".color-option");

const selectedColor =
    document.getElementById("selectedColor");


colorOptions.forEach(option => {

    option.addEventListener("click", () => {


        colorOptions.forEach(item => {

            item.classList.remove("active");

        });


        option.classList.add("active");


        const input =
            option.querySelector("input");


        selectedColor.textContent =
            input.value;

    });

});



/* ============================================
   FAVORITE
============================================ */

const likeButtons =
    document.querySelectorAll(
        ".gallery-like, .similar-like"
    );


likeButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("liked");


        const icon =
            button.querySelector("i");


        if (button.classList.contains("liked")) {

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
