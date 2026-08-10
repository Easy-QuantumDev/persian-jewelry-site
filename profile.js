// ========================================
// PROFILE NAVIGATION
// ========================================

const navItems = document.querySelectorAll(".nav-item");

const informationCard = document.querySelector(".information-card");
const ordersCard = document.querySelector(".orders-card");
const addressCard = document.querySelector(".address-card");
const securityCard = document.querySelector(".security-card");


// ========================================
// SECTION MAP
// ========================================

const sections = {
    account: informationCard,
    orders: ordersCard,
    favorites: null,
    address: addressCard,
    settings: securityCard
};


// ========================================
// NAVIGATION
// ========================================

navItems.forEach((item, index) => {

    item.addEventListener("click", function (e) {

        e.preventDefault();

        // Remove active
        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        // Add active
        this.classList.add("active");


        // ====================================
        // ACCOUNT
        // ====================================

        if (index === 0) {

            showSection(informationCard);

        }


        // ====================================
        // ORDERS
        // ====================================

        else if (index === 1) {

            showSection(ordersCard);

        }


        // ====================================
        // FAVORITES
        // ====================================

        else if (index === 2) {

            showNotification(
                "بخش علاقه‌مندی‌ها به زودی اضافه می‌شود ❤️"
            );

        }


        // ====================================
        // ADDRESS
        // ====================================

        else if (index === 3) {

            showSection(addressCard);

        }


        // ====================================
        // SETTINGS
        // ====================================

        else if (index === 4) {

            showSection(securityCard);

        }

    });

});


// ========================================
// SHOW SECTION
// ========================================

function showSection(section) {

    if (!section) return;


    // Hide all content cards

    const cards = document.querySelectorAll(".content-card");

    cards.forEach((card) => {

        card.style.display = "none";

    });


    // Show selected card

    section.style.display = "block";


    // Smooth scroll

    section.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ========================================
// EDIT PROFILE
// ========================================

const editButtons =
    document.querySelectorAll(".edit-btn");

const informationItems =
    document.querySelectorAll(".information-item");


// Edit button

editButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const informationCard =
            button.closest(".information-card");

        if (!informationCard) return;


        informationCard.classList.toggle("editing");


        if (
            informationCard.classList.contains("editing")
        ) {

            enableEditMode(informationCard);

        } else {

            disableEditMode(informationCard);

        }

    });

});


// ========================================
// ENABLE EDIT MODE
// ========================================

function enableEditMode(card) {

    const items =
        card.querySelectorAll(".information-item");


    items.forEach((item) => {

        const strong =
            item.querySelector("strong");

        if (!strong) return;


        const oldValue =
            strong.textContent.trim();


        strong.innerHTML = "";


        const input =
            document.createElement("input");


        input.type = "text";

        input.value = oldValue;

        input.className = "profile-edit-input";


        strong.appendChild(input);

    });


    const button =
        card.querySelector(".edit-btn");


    if (button) {

        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
            ذخیره
        `;

    }

}


// ========================================
// DISABLE EDIT MODE
// ========================================

function disableEditMode(card) {

    const inputs =
        card.querySelectorAll(".profile-edit-input");


    const values = [];


    inputs.forEach((input) => {

        values.push(
            input.value.trim()
        );

    });


    const strongElements =
        card.querySelectorAll(".information-item strong");


    strongElements.forEach((strong, index) => {

        if (values[index]) {

            strong.textContent =
                values[index];

        }

    });


    // Save data

    const userData = {

        name: values[0] || "",
        phone: values[1] || "",
        email: values[2] || "",
        date: values[3] || ""

    };


    localStorage.setItem(
        "userProfile",
        JSON.stringify(userData)
    );


    const button =
        card.querySelector(".edit-btn");


    if (button) {

        button.innerHTML = `
            <i class="fa-solid fa-pen"></i>
            ویرایش
        `;

    }


    showNotification(
        "اطلاعات با موفقیت ذخیره شد ✓"
    );

}


// ========================================
// LOAD USER PROFILE
// ========================================

function loadUserProfile() {

    const savedUser =
        localStorage.getItem("userProfile");


    if (!savedUser) return;


    try {

        const userData =
            JSON.parse(savedUser);


        const informationCard =
            document.querySelector(".information-card");


        if (!informationCard) return;


        const values =
            informationCard.querySelectorAll(
                ".information-item strong"
            );


        if (userData.name && values[0]) {

            values[0].textContent =
                userData.name;

        }


        if (userData.phone && values[1]) {

            values[1].textContent =
                userData.phone;

        }


        if (userData.email && values[2]) {

            values[2].textContent =
                userData.email;

        }


    } catch (error) {

        console.error(
            "خطا در خواندن اطلاعات کاربر:",
            error
        );

    }

}


loadUserProfile();


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.querySelector(".logout");


if (logoutBtn) {

    logoutBtn.addEventListener("click", (e) => {

        e.preventDefault();


        const confirmLogout =
            confirm(
                "آیا مطمئن هستید که می‌خواهید خارج شوید؟"
            );


        if (!confirmLogout) return;


        localStorage.removeItem(
            "userProfile"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );


        showNotification(
            "با موفقیت از حساب خارج شدید."
        );


        setTimeout(() => {

            window.location.href =
                "../login/login.html";

        }, 1200);

    });

}


// ========================================
// SHOP BUTTON
// ========================================

const shopBtn =
    document.querySelector(".shop-btn");


if (shopBtn) {

    shopBtn.addEventListener("click", () => {

        window.location.href =
            "../index.html";

    });

}


// ========================================
// CART BUTTON
// ========================================

const cartBtn =
    document.querySelector(".cart-btn");


if (cartBtn) {

    cartBtn.addEventListener("click", () => {

        showNotification(
            "سبد خرید شما باز شد 🛍️"
        );

    });

}


// ========================================
// NOTIFICATION BUTTON
// ========================================

const notificationBtn =
    document.querySelector(".notification-btn");


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        () => {

            showNotification(
                "اعلان جدیدی ندارید ✨"
            );

        }
    );

}


// ========================================
// CHANGE PASSWORD
// ========================================

const changePasswordBtn =
    document.querySelector(".change-password");


if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        () => {

            showNotification(
                "بخش تغییر رمز عبور به زودی اضافه می‌شود 🔐"
            );

        }
    );

}


// ========================================
// RECENT ORDERS
// ========================================

const orderItems =
    document.querySelectorAll(".order-item");


orderItems.forEach((order) => {

    order.addEventListener("click", () => {

        orderItems.forEach((item) => {

            item.classList.remove(
                "selected"
            );

        });


        order.classList.add(
            "selected"
        );

    });

});


// ========================================
// ORDER LINKS
// ========================================

const ordersViewAll =
    document.querySelector(".orders-card .card-header a");


if (ordersViewAll) {

    ordersViewAll.addEventListener(
        "click",
        (e) => {

            e.preventDefault();


            showNotification(
                "در حال نمایش تمام سفارش‌ها..."
            );

        }
    );

}


// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message) {

    const oldNotification =
        document.querySelector(
            ".profile-notification"
        );


    if (oldNotification) {

        oldNotification.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "profile-notification";


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    // Show

    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 50);


    // Hide

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}


// ========================================
// ACTIVE ORDER
// ========================================

orderItems.forEach((order) => {

    order.addEventListener(
        "mouseenter",
        () => {

            order.style.cursor =
                "pointer";

        }
    );

});


// ========================================
// STARTUP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Profile JS Loaded Successfully ✓"
        );

    }
);

// ========================================
// EDIT DEFAULT ADDRESS
// ========================================

const addressEditBtn =
    document.querySelector(".address-card .edit-btn");

const addressContent =
    document.querySelector(".address-content");


if (addressEditBtn && addressContent) {

    addressEditBtn.addEventListener("click", () => {

        const addressText =
            addressContent.querySelector("p");

        const phoneText =
            addressContent.querySelector("span");


        // ================================
        // ENTER EDIT MODE
        // ================================

        if (!addressContent.classList.contains("editing")) {

            addressContent.classList.add("editing");

            const currentAddress =
                addressText.textContent.trim();

            const currentPhone =
                phoneText.textContent.trim();


            addressText.innerHTML = `
                <input
                    type="text"
                    class="address-input profile-edit-input"
                    id="address-input"
                    value="${currentAddress}"
                >
            `;


            phoneText.innerHTML = `
                <input
                    type="text"
                    class="address-input profile-edit-input"
                    id="phone-input"
                    value="${currentPhone}"
                    style="margin-bottom:10px;"
                >
            `;


            addressEditBtn.innerHTML = `
                <i class="fa-solid fa-check"></i>
                ذخیره
            `;

        }


        // ================================
        // SAVE
        // ================================

        else {

            const addressInput =
                document.getElementById("address-input");
            
            const phoneInput =
            document.getElementById("phone-input");
            

  
            const newAddress =
                addressInput.value.trim();

            const newPhone =
                phoneInput.value.trim();


            if (!newAddress) {

                showNotification(
                    "لطفاً آدرس را وارد کنید."
                );

                return;

            }


            if (!newPhone) {

                showNotification(
                    "لطفاً شماره موبایل را وارد کنید."
                );

                return;

            }


            // Update HTML

            addressText.textContent =
                newAddress;

            phoneText.textContent =
                newPhone;


            // Save localStorage

            const savedUser =
                localStorage.getItem("userProfile");


            let userData = {};


            if (savedUser) {

                try {

                    userData =
                        JSON.parse(savedUser);

                } catch (error) {

                    userData = {};

                }

            }


            userData.address =
                newAddress;

            userData.phone =
                newPhone;


            localStorage.setItem(
                "userProfile",
                JSON.stringify(userData)
            );


            // Exit edit mode

            addressContent.classList.remove(
                "editing"
            );


            addressEditBtn.innerHTML = `
                <i class="fa-solid fa-pen"></i>
            `;


            showNotification(
                "آدرس با موفقیت ذخیره شد ✓"
            );

        }

    });

}