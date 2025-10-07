const navbar = document.querySelector('#navbar');
const bsOffcanvas = new bootstrap.Offcanvas(navbar);
const main = document.querySelector('main');
const popupBlock = document.querySelector('.popup_container');
const popupClose = document.querySelector('.popup_close');

function openDisc() {
  popupBlock.classList.add("active");
}
if (popupBlock) {
  popupBlock.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) popupBlock.classList.remove("active");
  });
}
if (popupClose) {
  popupClose.addEventListener("click", () => popupBlock.classList.remove("active"));
}

/* Change theme start */
let theme = localStorage.getItem("theme");
if (!theme) {
  theme = "gzhel";
  localStorage.setItem("theme", theme);
}
document.body.className = theme;


function applyThemeToBody(name) {
  document.body.className = name;
  window.scrollTo(0, 0);
}

const themeBtns = document.querySelectorAll('[data-action="theme"]');
for (let i = 0; i < themeBtns.length; i++) {
  themeBtns[i].addEventListener("click", function () {
    theme = this.dataset.value; 
    applyThemeToBody(theme);
    localStorage.setItem("theme", theme);

   
    if (window.switchTheme) window.switchTheme(theme);
  });
}
/* Change theme end */

/* Offcanvas scripts start*/
document.querySelectorAll('.nav-link').forEach(el => {
  if (!el.nextElementSibling) {
    el.addEventListener("click", () => bsOffcanvas.hide());
  }
});

document.querySelectorAll('.dropend').forEach(el => {
  el.addEventListener("click", (e) => e.stopPropagation());
});

navbar.addEventListener('show.bs.offcanvas', () => main.classList.add("show"));
navbar.addEventListener('hide.bs.offcanvas', () => main.classList.remove("show"));
/* Offcanvas scripts end*/
