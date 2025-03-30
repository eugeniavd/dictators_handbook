// utilities/functions.js

/**
 * Switches the design theme by updating the stylesheet link.
 * @param {string} stylePath - Path to the CSS file.
 */
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

// Apply previously selected theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (themeStylesheet) {
      themeStylesheet.href = savedTheme;
      console.log(`Applied saved theme: ${savedTheme}`);
    }
  }
});

// Load header and footer
document.addEventListener("DOMContentLoaded", function () {
  fetch('/components/header.html')
    .then(response => {
      if (!response.ok) throw new Error('Header load error');
      return response.text();
    })
    .then(html => {
      const headerEl = document.getElementById('header-placeholder');
      if (!headerEl) return;
      headerEl.innerHTML = html;

      // Init Bootstrap dropdowns
      const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.forEach(el => new bootstrap.Dropdown(el));

      // Init submenu and collapse
      initializeSubmenuListeners();
      const collapseEl = document.querySelector('#navbarSupportedContent');
      if (collapseEl) {
        new bootstrap.Collapse(collapseEl, { toggle: false });
      }
    })
    .catch(error => console.error('Header error:', error));

  fetch('/components/footer.html')
    .then(response => {
      if (!response.ok) throw new Error('Footer load error');
      return response.text();
    })
    .then(html => {
      const footerEl = document.getElementById('footer-placeholder');
      if (footerEl) {
        footerEl.innerHTML = html;
      }
    })
    .catch(error => console.error('Footer error:', error));
});

// Submenu toggle (mobile and hover)
function initializeSubmenuListeners() {
  // Mobile click toggle
  document.querySelectorAll('.dropdown-submenu > a').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const subMenu = this.nextElementSibling;
      if (subMenu?.classList.contains('dropdown-menu')) {
        subMenu.classList.toggle('show');
      }

      // Close other submenus
      document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(menu => {
        if (menu !== subMenu) menu.classList.remove('show');
      });
    });
  });

  // Global close on outside click
  document.addEventListener('click', e => {
    document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(submenu => {
      if (!submenu.contains(e.target)) submenu.classList.remove('show');
    });
  });
}

// Handle theme switching
document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    event.preventDefault();
    const stylePath = target.getAttribute('data-style');
    if (stylePath) {
      switchStyle(stylePath);
    }
  }
});

// Load and enrich map markers
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
  .catch(err => console.error("Map load error:", err));

// Add markers to map
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
            transition: all 0.2s ease-in-out;
          "
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
        popupContent += `
          <li><a href="${article.url}" target="_blank">${article.title}</a></li>
        `;
      });
      popupContent += `</ul>`;
    } else {
      popupContent += `<em>We haven't any article about this place</em>`;
    }

    L.marker(loc.coords).addTo(map).bindPopup(popupContent);
  });
}

window.addMapMarkers = addMapMarkers;
