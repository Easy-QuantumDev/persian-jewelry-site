
new Swiper(".necklace-swipper", {

    slidesPerView: 4,

    spaceBetween: 20,

    
    grabCursor: true,
    
    navigation:{
        nextEl: ".necklace-next",
        prevEl: ".necklace-prev"
    },


    breakpoints: {

        0:{
            slidesPerView:1.2
        },

        576:{
            slidesPerView:2
        },

        768:{
            slidesPerView:3
        },

        992:{
            slidesPerView:5
        }

    }

});
