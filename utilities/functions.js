// ==============================
// 📁 utilities/functions.js
// ==============================

// ==============================
// Force scroll on initial load (mobile fix)
// ==============================
(function fixScrollBug() {
  const restoreScrollEarly = () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.classList.remove('modal-open', 'offcanvas-open', 'overflow-hidden');
  };

  restoreScrollEarly();
  window.addEventListener('load', restoreScrollEarly);
  window.addEventListener('resize', restoreScrollEarly);
  window.addEventListener('orientationchange', restoreScrollEarly);
})();

// ==============================
// Set real viewport height
// ==============================
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setRealVh);
window.addEventListener('orientationchange', setRealVh);
setRealVh();

// ==============================
// Theme switching logic
// ==============================
function switchStyle(stylePath) {
  const themeStylesheet = document.getElementById('themeStylesheet');
  if (themeStylesheet) {
    themeStylesheet.href = stylePath;
    localStorage.setItem('selectedTheme', stylePath);
    console.log(`Switched style to: ${stylePath}`);
  } else {
    console.error('Theme stylesheet not found.');
  }
}

// ==============================
// Document Ready
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (themeStylesheet) {
      themeStylesheet.href = savedTheme;
      console.log(`Applied saved theme: ${savedTheme}`);
    }
  }

  // Load header
  fetch('/components/header.html')
    .then(res => {
      if (!res.ok) throw new Error('Header load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;

      // After header is injected:
      setTimeout(() => {
        const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElements.forEach(el => new bootstrap.Dropdown(el));

        initializeSubmenuListeners();

        const collapseEl = document.querySelector('#navbarSupportedContent');
        if (collapseEl) {
          new bootstrap.Collapse(collapseEl, { toggle: false });
        }

        // Restore scroll after toggling navbar
        const navbarToggler = document.querySelector('.navbar-toggler');
        const restoreScroll = () => {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          document.body.classList.remove('modal-open', 'offcanvas-open', 'overflow-hidden');
        };

        if (navbarToggler) {
          navbarToggler.addEventListener('click', () => {
            setTimeout(restoreScroll, 350);
          });
        }

        window.addEventListener('resize', restoreScroll);
        window.addEventListener('orientationchange', restoreScroll);
      }, 0);
    })
    .catch(err => console.error('Header error:', err));

  // Load footer
  fetch('/components/footer.html')
    .then(res => {
      if (!res.ok) throw new Error('Footer load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Footer error:', err));

  // Load map metadata and enrich markers
  fetch('/utilities/map.json')
    .then(res => res.json())
    .then(meta => {
      const enrichedLocations = locations.map(loc => {
        const metaEntry = meta.find(m => m.slug === loc.slug);
        return {
          ...loc,
          wikipedia: metaEntry?.wikipedia || null,
          articles: metaEntry?.articles || []
        };
      });

      addMapMarkers(map, enrichedLocations);
    })
    .catch(err => console.error('Map load error:', err));
});

// ==============================
// Add location markers to map
// ==============================
function addMapMarkers(map, locations) {
  locations.forEach(loc => {
    let popupContent = `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <strong style="font-size: 14px;">${loc.name}</strong>
        ${loc.wikipedia ? `
          <a href="${loc.wikipedia}" target="_blank" style="
            display: inline-flex;
            align-items: center;
            padding: 2px 6px;
            background-color: transparent;
            color: #333;
            border: 1px solid #ccc;
            text-decoration: none;
            border-radius: 3px;
            font-size: 9px;
            line-height: 1.1;
            gap: 4px;
            transition: all 0.2s ease-in-out;"
            onmouseover="this.style.borderColor='#666'; this.style.color='#000'"
            onmouseout="this.style.borderColor='#ccc'; this.style.color='#333'">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
              alt="Wikipedia" width="10" height="10" />
            Read more
          </a>` : ''}
      </div><br>
    `;

    if (loc.articles.length > 0) {
      popupContent += `<span><em>Appears in:</em></span><ul>`;
      loc.articles.forEach(article => {
        popupContent += `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`;
      });
      popupContent += `</ul>`;
    } else {
      popupContent += `<em>We haven't any article about this place</em>`;
    }

    L.marker(loc.coords).addTo(map).bindPopup(popupContent);
  });
}
window.addMapMarkers = addMapMarkers;

// ==============================
// Submenu toggle 
// ==============================
function handleSubmenuClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const subMenu = this.nextElementSibling;

  document.querySelectorAll('.dropdown-submenu .dropdown-menu.show').forEach(menu => {
    if (menu !== subMenu) menu.classList.remove('show');
  });

  if (subMenu) {
    subMenu.classList.toggle('show');
  }
}

function initializeSubmenuListeners() {
  document.querySelectorAll('.dropdown-submenu > a').forEach(el => {
    el.removeEventListener('click', handleSubmenuClick);
    el.addEventListener('click', handleSubmenuClick);
  });
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.dropdown-submenu .dropdown-menu.show')
      .forEach(menu => menu.classList.remove('show'));
  }
});

// ==============================
// Theme switch via dropdown
// ==============================
document.addEventListener('click', e => {
  const target = e.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    e.preventDefault();
    switchStyle(target.getAttribute('data-style'));
  }
});

// ==============================
// Toggle for Sidebar Metadata Sections
// ==============================

document.querySelectorAll('.sidebar-section h5').forEach(header => {
  header.addEventListener('click', () => {
    const section = header.parentElement;
    section.classList.toggle('active');
  });
});

// ==============================
// Menu For Article Page
// ==============================

function toggleNavbar() {
  if (!document.body.classList.contains("article-page")) return;

  const navbar = document.getElementById('navbarSupportedContent');
  if (!navbar) return;

  const bsCollapse = bootstrap.Collapse.getInstance(navbar)
    || new bootstrap.Collapse(navbar, { toggle: false });

  bsCollapse.toggle();
}
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("article-page")) return;

  const waitForHeader = setInterval(() => {
    const header = document.querySelector('.article-header');
    const image = document.querySelector('.article-header-image');
    const navbar = document.getElementById('navbarSupportedContent');

    if (header && image && navbar && !document.querySelector('.article-burger-fixed')) {
      const burger = document.createElement("button");
      burger.className = "article-burger-fixed";
      burger.innerHTML = "☰";

      const menu = document.createElement("div");
      menu.className = "article-flyout-menu";
      menu.innerHTML = navbar.innerHTML;

      burger.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target)) {
          menu.classList.remove("show");
        }
      });

      header.insertBefore(burger, image);
      header.appendChild(menu);
      clearInterval(waitForHeader);
    }
  }, 100);
});

const burger = document.querySelector('.article-burger-fixed');
const menu = document.querySelector('.article-flyout-menu');

burger.addEventListener('click', () => {
  menu.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
  const paragraphs = document.querySelectorAll(".article-content p");

  for (const p of paragraphs) {
    const html = p.innerHTML.trim();
    if (!html) continue;

    
    const updatedHTML = html.replace(
      /^(\s*(<[^>]+>\s*)*)?([A-Za-zА-Яа-яЁё])/u,
      function (match, prefix = '', _, firstChar) {
        const upperChar = firstChar.toUpperCase();
        return `${prefix || ''}<span class="dropcap-wrapper"><img src="images/ghzel/letters/${upperChar}.png" alt="${upperChar}" class="dropcap-image"></span>`;
      }
    );

    p.innerHTML = updatedHTML;
    break; 
  }
});

