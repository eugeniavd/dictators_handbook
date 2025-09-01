const navbar = document.querySelector('#navbar');
const bsOffcanvas = new bootstrap.Offcanvas(navbar)
const main = document.querySelector('main');


/* Change theme start */
let theme = localStorage.getItem("theme");
if (!theme) {
    theme = "gzhel"
    localStorage.setItem("theme", theme);
}
document.body.className = theme;

const switchTheme = function(name) {
    document.body.className = name;
}

const themeBtns = document.querySelectorAll('[data-action=\"theme\"]');
for (let i = 0; i < themeBtns.length; i++) {
    themeBtns[i].addEventListener("click", function () {
        theme = this.dataset.value;
        switchTheme(theme);
        localStorage.setItem("theme", theme);
        if (theme === "gzhel") {
            mtSu.removeFrom(map)
            mtGz.addTo(map)
        } else {
            mtGz.removeFrom(map)
            mtSu.addTo(map)
            
        }
    })
}

/* Change theme end */


/* Offcanvas scripts start*/
document.querySelectorAll('.nav-link').forEach(el => {
    if (!el.nextElementSibling) {
        el.addEventListener("click", function (e) {
            bsOffcanvas.hide()
        })
    }
})

document.querySelectorAll('.dropend').forEach(el => {
    el.addEventListener("click", function(e) {
        e.stopPropagation()
    })
})

navbar.addEventListener('show.bs.offcanvas', function () {
    console.log("click")
    main.classList.add("show")
});

navbar.addEventListener('hide.bs.offcanvas', function () {
    main.classList.remove("show")
});
/* Offcanvas scripts end*/

