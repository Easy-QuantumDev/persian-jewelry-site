document.addEventListener("DOMContentLoaded", () => {

    /*
     * فیلتر دسته‌بندی، قیمت و سورت همگی از قبل با فرم‌های واقعی
     * GET (که خودشون روی onchange/submit صفحه رو با query
     * params جدید ریلود می‌کنن) توی product-list.html پیاده شدن
     * و مستقیماً با ویوی product_list هماهنگن — نیازی به فیلتر
     * جاوااسکریپتی جداگونه نیست.
     *
     * اینجا فقط کاری که خالص UI هست رو انجام میدیم: باز/بسته
     * کردن سایدبار فیلتر تو حالت موبایل.
     */

    const sidebar =
        document.querySelector(".filter-sidebar");

    document
        .getElementById("openFilter")
        ?.addEventListener("click", () => {

            sidebar.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    document
        .getElementById("closeFilter")
        ?.addEventListener("click", () => {

            sidebar.classList.remove("active");

            document.body.style.overflow = "";

        });

});