const menu_btn = document.querySelector(".menu-btn")
const nav_list = document.querySelector(".nav-list")
const overlay = document.querySelector(".overlay")
menu_btn.addEventListener("click",()=>{
    nav_list.classList.toggle("active")
    menu_btn.classList.toggle("active")
    overlay.classList.toggle("active")
})
overlay.addEventListener("click",()=>{
        nav_list.classList.remove("active")
    menu_btn.classList.remove("active")
    overlay.classList.remove("active")
})