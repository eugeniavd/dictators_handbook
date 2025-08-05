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
    })
}

document.querySelectorAll('.dropend').forEach(el => {
    el.addEventListener("click", function(e) {
        e.stopPropagation()
    })
})
