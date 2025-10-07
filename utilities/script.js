const navbar = document.querySelector('#navbar');
const bsOffcanvas = new bootstrap.Offcanvas(navbar)
const main = document.querySelector('main');
const popupBlock = document.querySelector('.popup_container');
const popupClose = document.querySelector('.popup_close');

function openDisc() {
    popupBlock.classList.add("active")
}
popupBlock.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
        popupBlock.classList.remove("active")
    }
})
popupClose.addEventListener("click", (e) => {
    popupBlock.classList.remove("active")
})

/* Change theme start */
let theme = localStorage.getItem("theme");
if (!theme) {
    theme = "gzhel"
    localStorage.setItem("theme", theme);
}
document.body.className = theme;

const switchTheme = function(name) {
    document.body.className = name;
    window.scrollTo(0, 0)
}

const createPopup = (data, home = false) => {
    const popup = document.createElement("div")
    popup.className = "popup"
    const mainBlock = document.createElement("div")
    mainBlock.className = "popup_main"
    const caption = document.createElement("h2")
    caption.innerText = data.name;
    if (data.name.split(" ").length > 2) {
        caption.style.fontSize = "16px"
    }
    
    const link = document.createElement("a")
    link.className = "custom_btn"
    link.innerText = "Read more";
    link.href = data.wiki;
    link.target = "_blank";
    mainBlock.append(caption, link)
    popup.append(mainBlock)
    if (data.articles.length) {
        const artBlock = document.createElement("div")
        artBlock.className = "popup_art"
        const listCaption = document.createElement("h3")
        listCaption.innerText = "Appears in:";
        const list = document.createElement("ul")
        data.articles.forEach((el) => {
            const line = document.createElement("li")
            const text = document.createElement("a")
            text.innerText = articles[el].title
            text.href = (home ? "." : "..") + articles[el].link
            line.append(text)
            list.appendChild(line)
        })
        artBlock.append(listCaption, list)
        popup.append(artBlock)
    }
    return popup.outerHTML
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
    main.classList.add("show")
});

navbar.addEventListener('hide.bs.offcanvas', function () {
    main.classList.remove("show")
});
/* Offcanvas scripts end*/