const menuIcon = document.getElementById("menu__icon");
const mobileMenu = document.getElementById("mobileMenu");
const mainContain = document.querySelector(".mainContain");

// 🔹 Toggle mobile menu
menuIcon.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden"); // menu already open?

    mobileMenu.classList.toggle("hidden");
    mainContain.classList.toggle("blur-active");

    if (!isOpen) {
        menuIcon.classList.remove("fa-bars-staggered");
        menuIcon.classList.add("fa-xmark");
    } else {
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars-staggered");
    }
});

// 🔹 Close menu when clicking a link
document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mainContain.classList.remove("blur-active");
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars-staggered");
    });
});

