// ==============================
// 📁 utilities/functions.js
// ==============================

// Set custom CSS variable --vh to match real viewport height
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setRealVh);
window.addEventListener('orientationchange', setRealVh);
setRealVh();

// Switch active design theme
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
// Apply saved theme + load header/footer
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Load previously selected theme if saved
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (themeStylesheet) {
      themeStylesheet.href = savedTheme;
      console.log(`Applied saved theme: ${savedTheme}`);
    }
  }

  // Load header from external HTML
  fetch('/components/header.html')
    .then(res => {
      if (!res.ok) throw new Error('Header load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;

      // Wait for DOM to update
      setTimeout(() => {
        const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElements.forEach(el => new bootstrap.Dropdown(el));

        initializeSubmenuListeners();

        const collapseEl = document.querySelector('#navbarSupportedContent');
        if (collapseEl) {
          new bootstrap.Collapse(collapseEl, { toggle: false });
        }

        // ==============================
        // Fix mobile scroll lock on page load
        // ==============================

        const body = document.body;
        const html = document.documentElement;

        // Always allow scroll on initial load
        body.style.overflow = 'auto';
        html.style.overflow = 'auto';
        body.classList.remove('modal-open', 'offcanvas-open', 'overflow-hidden');

        // Fix scroll after toggling navbar
        const navbarToggler = document.querySelector('.navbar-toggler');

        function restoreScroll() {
          body.style.overflow = 'auto';
          html.style.overflow = 'auto';
          body.classList.remove('modal-open', 'offcanvas-open', 'overflow-hidden');
        }

        if (navbarToggler) {
          navbarToggler.addEventListener('click', () => {
            setTimeout(() => {
              restoreScroll(); // Allow scroll again after menu animation
            }, 350);
          });
        }

        // Re-enable scroll on viewport resize / orientation change
        window.addEventListener('resize', restoreScroll);
        window.addEventListener('orientationchange', restoreScroll);
      }, 0);
    })
    .catch(err => console.error('Header error:', err));

  // Load footer from external HTML
  fetch('/components/footer.html')
    .then(res => {
      if (!res.ok) throw new Error('Footer load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Footer error:', err));

  // Load map metadata and enrich locations
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
// Add location markers to Leaflet map
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
// Submenu toggle logic (dropdown inside dropdown)
// ==============================
function handleSubmenuClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const subMenu = this.nextElementSibling;
  if (subMenu && subMenu.classList.contains('dropdown-menu')) {
    const isVisible = subMenu.classList.contains('show');

    document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(menu => {
      if (menu !== subMenu) menu.classList.remove('show');
    });

    if (!isVisible) subMenu.classList.add('show');
  }
}

// Init submenu listeners
function initializeSubmenuListeners() {
  document.querySelectorAll('.dropdown-submenu > a').forEach(el => {
    el.removeEventListener('click', handleSubmenuClick);
    el.addEventListener('click', handleSubmenuClick);
  });

  // Hide submenu on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-menu')) {
      document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
}

// ==============================
// Handle clicking theme switch items
// ==============================
document.addEventListener('click', e => {
  const target = e.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    e.preventDefault();
    switchStyle(target.getAttribute('data-style'));
  }
});
