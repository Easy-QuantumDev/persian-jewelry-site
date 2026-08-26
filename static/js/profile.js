// =====================================================
// PROFILE.JS
// Jewelry Store
// =====================================================


// =====================================================
// DOM ELEMENTS
// =====================================================

const navItems = document.querySelectorAll(".profile-nav .nav-item");


// Main sections
const welcomeCard = document.querySelector(".welcome-card");
const statsGrid = document.querySelector(".stats-grid");


// Content cards
const informationCard = document.querySelector(".information-card");
const ordersCard = document.querySelector(".orders-card");
const addressCard = document.querySelector(".address-card");
const securityCard = document.querySelector(".security-card");


// All content cards
const allCards = document.querySelectorAll(".content-card");


// Buttons
const shopBtn = document.querySelector(".shop-btn");
const cartBtn = document.querySelector(".cart-btn");
const notificationBtn = document.querySelector(".notification-btn");
const logoutBtn = document.querySelector(".logout");
const changePasswordBtn = document.querySelector(".change-password");


// =====================================================
// PROFILE NAVIGATION
// =====================================================

navItems.forEach((item, index) => {

    item.addEventListener("click", function (event) {

        event.preventDefault();


        // Remove active from all nav items
        navItems.forEach(nav => {

            nav.classList.remove("active");

        });


        // Add active to clicked item
        this.classList.add("active");


        // =============================================
        // ACCOUNT
        // =============================================

        if (index === 0) {

            showAccount();

        }


        // =============================================
        // ORDERS
        // =============================================

        else if (index === 1) {

            showOrders();

        }


        // =============================================
        // FAVORITES
        // =============================================

        else if (index === 2) {

            showFavorites();

        }


        // =============================================
        // ADDRESS
        // =============================================

        else if (index === 3) {

            showAddress();

        }


        // =============================================
        // SETTINGS
        // =============================================

        else if (index === 4) {

            showSettings();

        }

    });

});


// =====================================================
// HIDE ALL SECTIONS
// =====================================================

function hideAllSections() {

    // Hide welcome
    if (welcomeCard) {

        welcomeCard.style.display = "none";

    }


    // Hide statistics
    if (statsGrid) {

        statsGrid.style.display = "none";

    }


    // Hide all content cards
    allCards.forEach(card => {

        card.style.display = "none";

    });

}


// =====================================================
// SHOW ACCOUNT
// =====================================================

function showAccount() {

    // Show welcome
    if (welcomeCard) {

        welcomeCard.style.display = "";

    }


    // Show statistics
    if (statsGrid) {

        statsGrid.style.display = "";

    }


    // Show all profile cards
    allCards.forEach(card => {

        card.style.display = "";

    });


    // Scroll to top
    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// SHOW ORDERS
// =====================================================

function showOrders() {

    hideAllSections();


    if (!ordersCard) return;


    ordersCard.style.display = "";


    ordersCard.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =====================================================
// SHOW FAVORITES
// =====================================================

function showFavorites() {

    /*
        اگر صفحه favorite جدا داری،
        مسیر را مطابق پروژه خودت تغییر بده.
    */

    window.location.href = "../favorite/favorite.html";

}


// =====================================================
// SHOW ADDRESS
// =====================================================

function showAddress() {

    hideAllSections();


    if (!addressCard) return;


    addressCard.style.display = "";


    addressCard.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =====================================================
// SHOW SETTINGS
// =====================================================

function showSettings() {

    hideAllSections();


    if (!securityCard) return;


    securityCard.style.display = "";


    securityCard.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =====================================================
// EDIT PERSONAL INFORMATION
// =====================================================

const editButtons =
    document.querySelectorAll(".information-card .edit-btn");


editButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (!informationCard) return;


        const isEditing =
            informationCard.classList.contains("editing");


        if (!isEditing) {

            enableEditMode(informationCard);

        } else {

            saveProfileInformation(informationCard);

        }

    });

});


// =====================================================
// ENABLE PROFILE EDIT MODE
// =====================================================

function enableEditMode(card) {

    const items =
        card.querySelectorAll(".information-item");


    items.forEach(item => {

        const strong =
            item.querySelector("strong");


        if (!strong) return;


        const currentValue =
            strong.textContent.trim();


        const input =
            document.createElement("input");


        input.type = "text";

        input.value = currentValue;

        input.className = "profile-edit-input";


        strong.textContent = "";

        strong.appendChild(input);

    });


    card.classList.add("editing");


    const button =
        card.querySelector(".edit-btn");


    if (button) {

        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
            ذخیره
        `;

    }

}


// =====================================================
// SAVE PROFILE INFORMATION
// =====================================================

function saveProfileInformation(card) {

    const inputs =
        card.querySelectorAll(".profile-edit-input");


    const values = [];


    inputs.forEach(input => {

        values.push(
            input.value.trim()
        );

    });


    // Validation
    if (!values[0]) {

        showNotification(
            "لطفاً نام و نام خانوادگی را وارد کنید."
        );

        return;

    }


    if (!values[1]) {

        showNotification(
            "لطفاً شماره موبایل را وارد کنید."
        );

        return;

    }


    if (!values[2]) {

        showNotification(
            "لطفاً ایمیل را وارد کنید."
        );

        return;

    }


    // Get strong elements
    const strongElements =
        card.querySelectorAll(".information-item strong");


    strongElements.forEach((strong, index) => {

        if (values[index]) {

            strong.textContent =
                values[index];

        }

    });


    // User data
    const userData = {

        name: values[0],

        phone: values[1],

        email: values[2],

        date: values[3] || "",

        address: getSavedAddress(),

    };


    // Save
    localStorage.setItem(
        "userProfile",
        JSON.stringify(userData)
    );


    // Exit edit mode
    card.classList.remove("editing");


    const button =
        card.querySelector(".edit-btn");


    if (button) {

        button.innerHTML = `
            <i class="fa-solid fa-pen"></i>
            ویرایش
        `;

    }


    // Update sidebar
    updateSidebarUser(
        userData
    );


    // Update welcome
    updateWelcomeUser(
        userData
    );


    showNotification(
        "اطلاعات با موفقیت ذخیره شد ✓"
    );

}


// =====================================================
// LOAD USER PROFILE
// =====================================================

function loadUserProfile() {

    const savedUser =
        localStorage.getItem("userProfile");


    if (!savedUser) return;


    try {

        const userData =
            JSON.parse(savedUser);


        if (!informationCard) return;


        const values =
            informationCard.querySelectorAll(
                ".information-item strong"
            );


        // Name
        if (userData.name && values[0]) {

            values[0].textContent =
                userData.name;

        }


        // Phone
        if (userData.phone && values[1]) {

            values[1].textContent =
                userData.phone;

        }


        // Email
        if (userData.email && values[2]) {

            values[2].textContent =
                userData.email;

        }


        // Date
        if (userData.date && values[3]) {

            values[3].textContent =
                userData.date;

        }


        // Load address
        loadAddress(
            userData
        );


        // Update sidebar
        updateSidebarUser(
            userData
        );


        // Update welcome
        updateWelcomeUser(
            userData
        );

    }

    catch (error) {

        console.error(
            "خطا در خواندن اطلاعات کاربر:",
            error
        );

    }

}


// =====================================================
// UPDATE SIDEBAR USER
// =====================================================

function updateSidebarUser(userData) {

    const sidebarName =
        document.querySelector(".sidebar-user strong");


    const sidebarEmail =
        document.querySelector(".sidebar-user small");


    if (sidebarName && userData.name) {

        sidebarName.textContent =
            userData.name;

    }


    if (sidebarEmail && userData.email) {

        sidebarEmail.textContent =
            userData.email;

    }


    // Avatar first character
    const avatar =
        document.querySelector(".user-avatar span");


    if (avatar && userData.name) {

        avatar.textContent =
            userData.name.charAt(0);

    }

}


// =====================================================
// UPDATE WELCOME USER
// =====================================================

function updateWelcomeUser(userData) {

    const welcomeTitle =
        document.querySelector(".welcome-content h2");


    if (!welcomeTitle) return;


    if (userData.name) {

        welcomeTitle.textContent =
            `سلام ${userData.name} 👋`;

    }

}


// =====================================================
// GET SAVED ADDRESS
// =====================================================

function getSavedAddress() {

    const savedUser =
        localStorage.getItem("userProfile");


    if (!savedUser) return "";


    try {

        const userData =
            JSON.parse(savedUser);


        return userData.address || "";

    }

    catch {

        return "";

    }

}


// =====================================================
// LOAD ADDRESS
// =====================================================

function loadAddress(userData) {

    if (!addressCard) return;


    const addressText =
        addressCard.querySelector(".address-content p");


    const phoneText =
        addressCard.querySelector(".address-content span");


    if (addressText && userData.address) {

        addressText.textContent =
            userData.address;

    }


    if (phoneText && userData.phone) {

        phoneText.textContent =
            userData.phone;

    }

}


// =====================================================
// EDIT DEFAULT ADDRESS
// =====================================================

const addressEditBtn =
    document.querySelector(
        ".address-card .edit-btn"
    );


const addressContent =
    document.querySelector(
        ".address-content"
    );


if (addressEditBtn && addressContent) {

    addressEditBtn.addEventListener(
        "click",
        function () {

            const addressText =
                addressContent.querySelector("p");


            const phoneText =
                addressContent.querySelector("span");


            if (!addressText || !phoneText) return;


            const isEditing =
                addressContent.classList.contains(
                    "editing"
                );


            // =========================================
            // ENTER EDIT MODE
            // =========================================

            if (!isEditing) {

                addressContent.classList.add(
                    "editing"
                );


                const currentAddress =
                    addressText.textContent.trim();


                const currentPhone =
                    phoneText.textContent.trim();


                addressText.innerHTML = `

                    <input
                        type="text"
                        class="address-input profile-edit-input"
                        id="address-input"
                        value="${escapeHTML(currentAddress)}"
                    >

                `;


                phoneText.innerHTML = `

                    <input
                        type="text"
                        class="address-input profile-edit-input"
                        id="phone-input"
                        value="${escapeHTML(currentPhone)}"
                    >

                `;


                addressEditBtn.innerHTML = `

                    <i class="fa-solid fa-check"></i>

                    ذخیره

                `;

            }


            // =========================================
            // SAVE ADDRESS
            // =========================================

            else {

                const addressInput =
                    document.querySelector(
                        "#address-input"
                    );


                const phoneInput =
                    document.querySelector(
                        "#phone-input"
                    );


                if (!addressInput || !phoneInput) return;


                const newAddress =
                    addressInput.value.trim();


                const newPhone =
                    phoneInput.value.trim();


                // Validation
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


                // Get existing data
                let userData = {};


                const savedUser =
                    localStorage.getItem(
                        "userProfile"
                    );


                if (savedUser) {

                    try {

                        userData =
                            JSON.parse(
                                savedUser
                            );

                    }

                    catch {

                        userData = {};

                    }

                }


                // Update data
                userData.address =
                    newAddress;


                userData.phone =
                    newPhone;


                // Save
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


                // Update sidebar/profile
                updateSidebarUser(
                    userData
                );


                showNotification(
                    "آدرس با موفقیت ذخیره شد ✓"
                );

            }

        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "آیا مطمئن هستید که می‌خواهید از حساب خارج شوید؟"
                );


            if (!confirmLogout) return;


            // Remove login state
            localStorage.removeItem(
                "isLoggedIn"
            );


            // Optional:
            // اطلاعات پروفایل را پاک نمی‌کنیم
            // تا بعد از ورود دوباره باقی بماند.


            showNotification(
                "با موفقیت از حساب خارج شدید ✓"
            );


            setTimeout(() => {

                window.location.href =
                    "../login/login.html";

            }, 1200);

        }
    );

}


// =====================================================
// SHOP BUTTON
// =====================================================

if (shopBtn) {

    shopBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../index.html";

        }
    );

}




// =====================================================
// NOTIFICATION BUTTON
// =====================================================

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function () {

            showNotification(
                "اعلان جدیدی ندارید ✨"
            );

        }
    );

}


// =====================================================
// CHANGE PASSWORD
// =====================================================

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        function () {

            showNotification(
                "بخش تغییر رمز عبور به زودی اضافه می‌شود 🔐"
            );

        }
    );

}


// =====================================================
// RECENT ORDERS
// =====================================================

const orderItems =
    document.querySelectorAll(".order-item");


orderItems.forEach(order => {

    order.addEventListener(
        "click",
        function () {

            orderItems.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            this.classList.add(
                "selected"
            );

        }
    );

});


// =====================================================
// ORDERS VIEW ALL
// =====================================================

const ordersViewAll =
    document.querySelector(
        ".orders-card .card-header a"
    );


if (ordersViewAll) {

    ordersViewAll.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showNotification(
                "در حال نمایش تمام سفارش‌ها..."
            );

        }
    );

}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    const ordersCount =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(1) strong"
        );


    const favoritesCount =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(2) strong"
        );


    const addressCount =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(4) strong"
        );


    // Count orders
    if (ordersCount) {

        ordersCount.textContent =
            orderItems.length;

    }


    // Favorites
    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            ) || "[]"
        );


    if (favoritesCount) {

        favoritesCount.textContent =
            favorites.length;

    }


    // Address
    if (addressCount) {

        addressCount.textContent =
            getSavedAddress() ? "1" : "0";

    }

}


// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

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


// =====================================================
// INITIAL PAGE
// =====================================================

function initializeProfile() {

    // Load saved user
    loadUserProfile();


    // Update statistics
    updateStatistics();


    // Account is default section
    showAccount();


    console.log(
        "Profile JS Loaded Successfully ✓"
    );

}


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProfile
);