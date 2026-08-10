const formSteps =
    document.querySelectorAll(".form-step");

const progressSteps =
    document.querySelectorAll(".progress-step");

const nextStep =
    document.querySelector("#nextStep");

const backStep =
    document.querySelector("#backStep");

const createAccount =
    document.querySelector("#createAccount");

const signupForm =
    document.querySelector("#signupForm");


let currentStep = 1;


/* =========================
   CHANGE STEP
========================= */

function changeStep(step) {

    currentStep = step;


    formSteps.forEach(item => {

        item.classList.remove("active");

    });


    progressSteps.forEach(item => {

        item.classList.remove("active");

    });


    const currentForm =
        document.querySelector(
            `.form-step[data-step="${step}"]`
        );


    currentForm.classList.add("active");


    for (let i = 0; i < step; i++) {

        progressSteps[i]
            .classList.add("active");

    }

}


/* =========================
   STEP 1
========================= */

nextStep.addEventListener("click", () => {

    const name =
        document.querySelector("#name");

    const email =
        document.querySelector("#email");


    if (
        name.value.trim() === "" ||
        email.value.trim() === ""
    ) {

        alert("لطفاً اطلاعات خود را کامل کنید.");

        return;

    }


    if (!email.value.includes("@")) {

        alert("ایمیل وارد شده معتبر نیست.");

        return;

    }


    changeStep(2);

});


/* =========================
   BACK
========================= */

backStep.addEventListener("click", () => {

    changeStep(1);

});


/* =========================
   PASSWORD
========================= */

const password =
    document.querySelector("#password");

const strengthBar =
    document.querySelector(
        ".strength-bar span"
    );

const strengthText =
    document.querySelector(
        "#strengthText"
    );


password.addEventListener("input", () => {

    const value = password.value;

    let strength = 0;


    if (value.length >= 6) {

        strength++;

    }


    if (/[A-Z]/.test(value)) {

        strength++;

    }


    if (/[0-9]/.test(value)) {

        strength++;

    }


    if (/[^A-Za-z0-9]/.test(value)) {

        strength++;

    }


    if (strength === 0) {

        strengthBar.style.width = "0%";

        strengthText.textContent =
            "قدرت رمز عبور";

    }

    else if (strength === 1) {

        strengthBar.style.width = "25%";

        strengthText.textContent =
            "رمز عبور ضعیف";

    }

    else if (strength === 2) {

        strengthBar.style.width = "50%";

        strengthText.textContent =
            "رمز عبور متوسط";

    }

    else if (strength === 3) {

        strengthBar.style.width = "75%";

        strengthText.textContent =
            "رمز عبور خوب";

    }

    else {

        strengthBar.style.width = "100%";

        strengthText.textContent =
            "رمز عبور بسیار قوی";

    }

});


/* =========================
   CREATE ACCOUNT
========================= */

createAccount.addEventListener("click", () => {

    const passwordValue =
        password.value;

    const confirmPassword =
        document.querySelector(
            "#confirmPassword"
        ).value;


    if (passwordValue.length < 6) {

        alert(
            "رمز عبور باید حداقل ۶ کاراکتر باشد."
        );

        return;

    }


    if (
        passwordValue !== confirmPassword
    ) {

        alert(
            "رمزهای عبور با یکدیگر مطابقت ندارند."
        );

        return;

    }


    changeStep(3);

});


/* =========================
   SHOW PASSWORD
========================= */

const showPasswordButtons =
    document.querySelectorAll(
        ".show-password"
    );


showPasswordButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.target;

        const input =
            document.querySelector(
                `#${targetId}`
            );


        if (input.type === "password") {

            input.type = "text";

            button.textContent = "◉";

        }

        else {

            input.type = "password";

            button.textContent = "◉";

        }

    });

});


/* =========================
   SUBMIT
========================= */

signupForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        console.log(
            "Account created successfully"
        );

        // اینجا بعداً API ثبت‌نام
        // یا بک‌اند Django/Node
        // را وصل می‌کنیم.

    }
);