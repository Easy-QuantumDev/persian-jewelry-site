document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Elements
    // =========================

    const signupForm = document.getElementById("signupForm");

    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");

    // Step 1
    const nextStep = document.getElementById("nextStep");
    const nameInput = document.getElementById("name");

    // Step 2
    const phoneInput = document.getElementById("phone");
    const otpInput = document.getElementById("otpCode");

    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const resendBtn = document.getElementById("resendBtn");
    const resendTimer = document.getElementById("resendTimer");

    const otpGroup = document.getElementById("otpGroup");

    const backToStep1 = document.getElementById("backToStep1");
    const nextStep2 = document.getElementById("nextStep2");

    // Step 3
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const backStep = document.getElementById("backStep");
    const createAccountBtn = document.getElementById("createAccount");

    // Password visibility
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // Password strength
    const strengthBar = document.querySelector(".strength-bar span");
    const strengthText = document.getElementById("strengthText");


    // =========================
    // URLs
    // =========================

    const CHECK_EMAIL_URL = signupForm.dataset.checkEmailUrl;
    const SEND_OTP_URL = signupForm.dataset.sendOtpUrl;
    const VERIFY_OTP_URL = signupForm.dataset.verifyOtpUrl;


    // =========================
    // CSRF
    // =========================

    const csrfToken = signupForm.querySelector(
        'input[name="csrfmiddlewaretoken"]'
    )?.value;


    // =========================
    // State
    // =========================

    let currentStep = 1;

    let phoneVerified = false;
    let codeSent = false;

    let timerInterval = null;
    let remainingSeconds = 0;


    // =========================
    // Change Step
    // =========================

    function changeStep(step) {

        currentStep = step;

        formSteps.forEach((formStep) => {
            formStep.classList.remove("active");
        });

        const targetStep = document.querySelector(
            `.form-step[data-step="${step}"]`
        );

        if (targetStep) {
            targetStep.classList.add("active");
        }


        // Progress
        progressSteps.forEach((progressStep, index) => {

            const stepNumber = index + 1;

            progressStep.classList.remove("active");

            if (stepNumber <= step) {
                progressStep.classList.add("active");
            }

        });
    }


    // =========================
    // Helpers
    // =========================

    function normalizePhone(phone) {

        phone = phone.trim();

        // تبدیل اعداد فارسی به انگلیسی
        phone = phone.replace(/[۰-۹]/g, (digit) => {
            return "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
        });

        // حذف فاصله و -
        phone = phone.replace(/[\s-]/g, "");

        return phone;
    }


    function isValidPhone(phone) {

        return /^09\d{9}$/.test(phone);

    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    function isValidOTP(code) {

        return /^\d{5}$/.test(code);

    }


    // =========================
    // STEP 1
    // Name
    // =========================

    nextStep.addEventListener("click", () => {

        const name = nameInput.value.trim();

        if (name === "") {

            alert("لطفاً نام و نام خانوادگی خود را وارد کنید.");

            nameInput.focus();

            return;
        }


        if (name.length < 3) {

            alert("نام و نام خانوادگی را کامل وارد کنید.");

            nameInput.focus();

            return;
        }


        changeStep(2);

    });


    // =========================
    // STEP 2
    // Phone Input
    // =========================

    phoneInput.addEventListener("input", () => {

        phoneVerified = false;
        codeSent = false;

        const phone = normalizePhone(phoneInput.value);

        phoneInput.value = phone;

    });


    // =========================
    // Send OTP
    // =========================

    async function sendOTP() {

        const phone = normalizePhone(phoneInput.value);

        phoneInput.value = phone;


        if (!isValidPhone(phone)) {

            alert("شماره موبایل معتبر وارد کنید.\nمثال: 09123456789");

            phoneInput.focus();

            return;
        }


        sendCodeBtn.disabled = true;

        sendCodeBtn.textContent = "در حال ارسال...";


        try {

            const response = await fetch(SEND_OTP_URL, {

                method: "POST",

                headers: {
                    "X-CSRFToken": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    phone: phone
                })

            });


            const data = await response.json();


            if (!response.ok || !data.ok) {

                alert(data.error || "ارسال کد تایید انجام نشد.");

                sendCodeBtn.disabled = false;

                sendCodeBtn.textContent = "ارسال کد تایید";

                return;
            }


            // موفق
            codeSent = true;
            phoneVerified = false;


            otpGroup.style.display = "block";

            otpInput.value = "";

            otpInput.focus();


            sendCodeBtn.textContent = "کد ارسال شد";


            startResendTimer(120);


        } catch (error) {

            console.error("SEND OTP ERROR:", error);

            alert("خطا در ارتباط با سرور. دوباره تلاش کنید.");

            sendCodeBtn.disabled = false;

            sendCodeBtn.textContent = "ارسال کد تایید";

        }

    }


    sendCodeBtn.addEventListener("click", sendOTP);


    // =========================
    // Resend Timer
    // =========================

    function startResendTimer(seconds) {

        clearInterval(timerInterval);

        remainingSeconds = seconds;

        resendBtn.disabled = true;

        sendCodeBtn.disabled = true;


        updateTimer();


        timerInterval = setInterval(() => {

            remainingSeconds--;

            updateTimer();


            if (remainingSeconds <= 0) {

                clearInterval(timerInterval);

                resendTimer.textContent = "می‌توانید دوباره کد بفرستید";

                resendBtn.disabled = false;

                sendCodeBtn.disabled = false;

                sendCodeBtn.textContent = "ارسال کد تایید";

            }

        }, 1000);

    }


    function updateTimer() {

        const minutes = Math.floor(remainingSeconds / 60);

        const seconds = remainingSeconds % 60;


        resendTimer.textContent =
            `ارسال مجدد تا ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }


    resendBtn.addEventListener("click", () => {

        if (!resendBtn.disabled) {
            sendOTP();
        }

    });


    // =========================
    // Verify OTP
    // =========================

    async function verifyOTP() {

        const phone = normalizePhone(phoneInput.value);
        const code = otpInput.value.trim();


        if (!codeSent) {

            alert("ابتدا کد تایید را برای شماره موبایل ارسال کنید.");

            return;
        }


        if (!isValidOTP(code)) {

            alert("کد تایید باید ۵ رقم باشد.");

            otpInput.focus();

            return;
        }


        nextStep2.disabled = true;
        nextStep2.textContent = "در حال بررسی...";


        try {

            const response = await fetch(VERIFY_OTP_URL, {

                method: "POST",

                headers: {
                    "X-CSRFToken": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    phone: phone,
                    code: code
                })

            });


            const data = await response.json();


            if (!response.ok || !data.ok) {

                alert(data.error || "کد تایید صحیح نیست.");

                nextStep2.disabled = false;
                nextStep2.textContent = "ادامه";

                return;
            }


            // OTP verified
            phoneVerified = true;


            clearInterval(timerInterval);


            resendBtn.disabled = true;

            sendCodeBtn.disabled = true;


            changeStep(3);


        } catch (error) {

            console.error("VERIFY OTP ERROR:", error);

            alert("خطا در ارتباط با سرور.");

        }


        nextStep2.disabled = false;
        nextStep2.textContent = "ادامه";

    }


    nextStep2.addEventListener("click", verifyOTP);


    // =========================
    // Back to Step 1
    // =========================

    backToStep1.addEventListener("click", () => {

        changeStep(1);

    });


    // =========================
    // STEP 3
    // Email
    // =========================

    async function checkEmail() {

        const email = emailInput.value.trim();


        // Email optional
        if (email === "") {

            emailError.style.display = "none";

            return true;

        }


        if (!isValidEmail(email)) {

            emailError.textContent = "فرمت ایمیل صحیح نیست.";

            emailError.style.display = "block";

            return false;

        }


        try {

            const response = await fetch(
                `${CHECK_EMAIL_URL}?email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );


            const data = await response.json();


            if (!data.available) {

                emailError.textContent =
                    data.error || "این ایمیل قبلاً ثبت شده است.";

                emailError.style.display = "block";

                return false;
            }


            emailError.style.display = "none";

            return true;


        } catch (error) {

            console.error("CHECK EMAIL ERROR:", error);

            emailError.textContent =
                "بررسی ایمیل انجام نشد. دوباره تلاش کنید.";

            emailError.style.display = "block";

            return false;

        }

    }


    emailInput.addEventListener("input", () => {

        emailError.style.display = "none";

    });


    // =========================
    // Password Strength
    // =========================

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        let strength = 0;


        if (password.length >= 8) {
            strength++;
        }


        if (/[A-Z]/.test(password)) {
            strength++;
        }


        if (/[a-z]/.test(password)) {
            strength++;
        }


        if (/\d/.test(password)) {
            strength++;
        }


        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }


        if (strengthBar) {

            const width = Math.min(strength * 20, 100);

            strengthBar.style.width = `${width}%`;

        }


        if (!strengthText) {
            return;
        }


        if (password.length === 0) {

            strengthText.textContent = "قدرت رمز عبور";

        } else if (strength <= 2) {

            strengthText.textContent = "رمز عبور ضعیف";

        } else if (strength === 3 || strength === 4) {

            strengthText.textContent = "رمز عبور متوسط";

        } else {

            strengthText.textContent = "رمز عبور قوی";

        }

    });


    // =========================
    // Password Visibility
    // =========================

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

            }

        });

    }


    if (toggleConfirmPassword) {

        toggleConfirmPassword.addEventListener("click", () => {

            if (confirmPasswordInput.type === "password") {

                confirmPasswordInput.type = "text";

                toggleConfirmPassword.textContent = "🙈";

            } else {

                confirmPasswordInput.type = "password";

                toggleConfirmPassword.textContent = "👁";

            }

        });

    }


    // =========================
    // Back to Step 2
    // =========================

    backStep.addEventListener("click", () => {

        changeStep(2);

    });


    // =========================
    // Final Signup
    // =========================

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // -------------------------
        // Phone verification
        // -------------------------

        if (!phoneVerified) {

            alert("ابتدا شماره موبایل خود را تایید کنید.");

            changeStep(2);

            return;
        }


        // -------------------------
        // Password
        // -------------------------

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        if (password.length < 8) {

            alert("رمز عبور باید حداقل ۸ کاراکتر باشد.");

            passwordInput.focus();

            return;
        }


        if (password !== confirmPassword) {

            alert("تکرار رمز عبور با رمز عبور یکسان نیست.");

            confirmPasswordInput.focus();

            return;
        }


        // -------------------------
        // Email
        // -------------------------

        const emailValid = await checkEmail();

        if (!emailValid) {

            emailInput.focus();

            return;
        }


        // -------------------------
        // Loading
        // -------------------------

        createAccountBtn.disabled = true;

        createAccountBtn.textContent = "در حال ساخت حساب...";


        try {

            const formData = new FormData(signupForm);


            const response = await fetch(
                signupForm.action,
                {
                    method: "POST",

                    headers: {
                        "X-CSRFToken": csrfToken,
                        "X-Requested-With": "XMLHttpRequest"
                    },

                    body: formData
                }
            );


            const data = await response.json();


            if (!response.ok || !data.ok) {

                alert(data.error || "ساخت حساب انجام نشد.");

                createAccountBtn.disabled = false;

                createAccountBtn.textContent = "ایجاد حساب";

                return;
            }


            // -------------------------
            // Success
            // -------------------------

            changeStep(4);


            setTimeout(() => {

                if (data.redirect_url) {

                    window.location.href = data.redirect_url;

                }

            }, 1500);


        } catch (error) {

            console.error("SIGNUP ERROR:", error);

            alert("خطا در ارتباط با سرور. دوباره تلاش کنید.");

            createAccountBtn.disabled = false;

            createAccountBtn.textContent = "ایجاد حساب";

        }

    });


});