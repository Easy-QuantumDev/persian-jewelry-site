const necklaceSwiper = new Swiper(".necklace-swiper", {

    slidesPerView: 4,

    spaceBetween: 20,

    speed: 600,

    navigation: {
        nextEl: ".necklace-next",
        prevEl: ".necklace-prev",
    },

    breakpoints: {

        0: {
            slidesPerView: 2,
            spaceBetween: 10,
        },

        576: {
            slidesPerView: 2,
            spaceBetween: 15,
        },

        768: {
            slidesPerView: 3,
            spaceBetween: 18,
        },

        992: {
            slidesPerView: 4,
            spaceBetween: 20,
        }

    }

});



const braceletSwiper = new Swiper(".bracelet-swiper", {

    slidesPerView: 4,

    spaceBetween: 20,

    speed: 600,

    navigation: {
        nextEl: ".bracelet-next",
        prevEl: ".bracelet-prev",
    },

    breakpoints: {

        0: {
            slidesPerView: 2,
            spaceBetween: 10,
        },

        576: {
            slidesPerView: 2,
            spaceBetween: 15,
        },

        768: {
            slidesPerView: 3,
            spaceBetween: 18,
        },

        992: {
            slidesPerView: 4,
            spaceBetween: 20,
        }

    }

});