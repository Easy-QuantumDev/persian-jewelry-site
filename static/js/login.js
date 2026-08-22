const passwordInput =
    document.querySelector("#password");

const showPassword =
    document.querySelector("#showPassword");


showPassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        showPassword.innerText = "◉";

    } else {

        passwordInput.type = "password";

        showPassword.innerText = "◉";

    }

});


const loginForm =
    document.querySelector("#loginForm");


loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    console.log("Login submitted");

});