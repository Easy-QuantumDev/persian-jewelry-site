document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ADDRESS SELECTION
    ========================================= */

    const addressCards =
        document.querySelectorAll(".address-card");


    addressCards.forEach(card => {

        card.addEventListener("click", () => {

            addressCards.forEach(item => {

                item.classList.remove("selected");

            });


            card.classList.add("selected");

        });

    });



    /* =========================================
       SHIPPING
    ========================================= */

    const shippingOptions =
        document.querySelectorAll(".shipping-option");


    shippingOptions.forEach(option => {

        option.addEventListener("click", () => {

            shippingOptions.forEach(item => {

                item.classList.remove("active");

            });


            option.classList.add("active");

            const radio =
                option.querySelector("input");

            radio.checked = true;

        });

    });



    /* =========================================
       DISCOUNT
    ========================================= */

    const discountInput =
        document.getElementById("discountCode");


    const discountBtn =
        document.getElementById("discountBtn");


    const discountMessage =
        document.getElementById("discountMessage");


    const discountRow =
        document.getElementById("discountRow");


    discountBtn.addEventListener("click", () => {

        const code =
            discountInput.value.trim();


        if (!code) {

            discountMessage.textContent =
                "لطفاً کد تخفیف را وارد کنید.";

            discountMessage.style.color =
                "#bd5c5c";

            return;

        }


        /*
            فعلاً کد نمونه

            بعداً این قسمت را
            به Django وصل می‌کنیم.
        */

        if (code === "JEWELRY10") {

            discountMessage.textContent =
                "کد تخفیف با موفقیت اعمال شد.";

            discountMessage.style.color =
                "#5b8762";


            discountRow.classList.add("show");


            discountRow.querySelector("strong")
                .textContent =
                "- ۱۱۰,۰۰۰ تومان";


        } else {

            discountMessage.textContent =
                "کد تخفیف معتبر نیست.";

            discountMessage.style.color =
                "#bd5c5c";


            discountRow.classList.remove("show");

        }

    });



    /* =========================================
       PAYMENT
    ========================================= */

    const paymentBtn =
        document.getElementById("paymentBtn");


    paymentBtn.addEventListener("click", () => {

        const requiredInputs =
            document.querySelectorAll(
                ".form-group input"
            );


        let valid = true;


        requiredInputs.forEach(input => {

            if (!input.value.trim()) {

                input.classList.add("input-error");

                valid = false;

            } else {

                input.classList.remove("input-error");

            }

        });


        if (!valid) {

            showMessage(
                "لطفاً اطلاعات گیرنده را کامل کنید.",
                "error"
            );

            return;

        }


        /*
            در Django:

            اینجا فرم checkout
            به View ارسال می‌شود.

            فعلاً فقط شبیه‌سازی است.
        */

        paymentBtn.classList.add("loading");


        paymentBtn.innerHTML =
            "در حال انتقال به درگاه...";


        setTimeout(() => {

            console.log(
                "Redirect to payment gateway"
            );

            /*
                بعداً:

                window.location.href =
                    "/payment/";
            */

        }, 1000);

    });



    /* =========================================
       MESSAGE
    ========================================= */

    function showMessage(message, type) {

        let messageBox =
            document.querySelector(".checkout-message");


        if (!messageBox) {

            messageBox =
                document.createElement("div");

            messageBox.className =
                "checkout-message";

            document.body.appendChild(messageBox);

        }


        messageBox.textContent =
            message;


        messageBox.classList.add("show");


        if (type === "error") {

            messageBox.classList.add("error");

        }


        setTimeout(() => {

            messageBox.classList.remove("show");

        }, 2500);

    }

});