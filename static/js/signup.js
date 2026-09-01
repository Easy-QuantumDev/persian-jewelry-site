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
   STEP 2 - PHONE VERIFICATION
========================= */

const phoneInput =
    document.querySelector("#phone");

const sendCodeBtn =
    document.querySelector("#sendCodeBtn");

const otpGroup =
    document.querySelector("#otpGroup");

const otpCodeInput =
    document.querySelector("#otpCode");

const resendBtn =
    document.querySelector("#resendBtn");

const resendTimer =
    document.querySelector("#resendTimer");

const backToStep1 =
    document.querySelector("#backToStep1");

const nextStep2 =
    document.querySelector("#nextStep2");


let generatedCode = null;

let codeVerified = false;

let resendInterval = null;


function isValidPhone(value) {

    return /^09\d{9}$/.test(value.trim());

}


function startResendCountdown() {

    let seconds = 60;

    sendCodeBtn.disabled = true;

    resendBtn.disabled = true;


    clearInterval(resendInterval);

    resendInterval = setInterval(() => {

        seconds--;

        const mm =
            String(Math.floor(seconds / 60)).padStart(2, "0");

        const ss =
            String(seconds % 60).padStart(2, "0");

        resendTimer.textContent =
            `ارسال مجدد تا ${mm}:${ss}`;


        if (seconds <= 0) {

            clearInterval(resendInterval);

            resendBtn.disabled = false;

            resendTimer.textContent =
                "کد رو دریافت نکردید؟";

        }

    }, 1000);

}


function sendCode() {

    if (!isValidPhone(phoneInput.value)) {

        alert("شماره موبایل معتبر نیست. مثال: 09123456789");

        return;

    }

    // TODO: به‌جای این بخش، باید یک درخواست واقعی به بک‌اند/سرویس پیامک زده بشه
    // مثال: fetch("/accounts/send-code/", { method: "POST", body: ... })
    generatedCode =
        String(Math.floor(10000 + Math.random() * 90000));

    codeVerified = false;

    alert(`(نسخه‌ی تستی) کد ارسال‌شده: ${generatedCode}`);

    otpGroup.classList.add("visible");

    otpCodeInput.value = "";

    otpCodeInput.focus();

    startResendCountdown();

}


sendCodeBtn.addEventListener("click", sendCode);


resendBtn.addEventListener("click", sendCode);


nextStep2.addEventListener("click", () => {

    if (!isValidPhone(phoneInput.value)) {

        alert("لطفاً یک شماره موبایل معتبر وارد کنید.");

        return;

    }


    if (generatedCode === null) {

        alert("ابتدا روی «ارسال کد تایید» بزنید.");

        return;

    }


    if (otpCodeInput.value.trim() !== generatedCode) {

        alert("کد وارد شده صحیح نیست.");

        return;

    }


    codeVerified = true;

    changeStep(3);

});


backToStep1.addEventListener("click", () => {

    changeStep(1);

});


/* =========================
   BACK (from password step)
========================= */

backStep.addEventListener("click", () => {

    changeStep(2);

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

createAccount.addEventListener("click", (event) => {

    event.preventDefault();

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


    changeStep(4);

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