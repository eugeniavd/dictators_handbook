// ==============================
// 📁 utilities/functions.js
// ==============================

/**
 * Switch design theme
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

// ==============================
// 🌐 Apply saved theme
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (themeStylesheet) {
      themeStylesheet.href = savedTheme;
      console.log(`Applied saved theme: ${savedTheme}`);
    }
  }

  // ==============================
  // 🔗 Load Header
  // ==============================
  fetch('/components/header.html')
    .then(res => {
      if (!res.ok) throw new Error('Header load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;

      // Init Bootstrap dropdowns
      const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.forEach(el => new bootstrap.Dropdown(el));

      initializeSubmenuListeners();

      const collapseEl = document.querySelector('#navbarSupportedContent');
      if (collapseEl) {
        new bootstrap.Collapse(collapseEl, { toggle: false });
      }
    })
    .catch(err => console.error('Header error:', err));

  // ==============================
  // 🔗 Load Footer
  // ==============================
  fetch('/components/footer.html')
    .then(res => {
      if (!res.ok) throw new Error('Footer load error');
      return res.text();
    })
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Footer error:', err));

  // ==============================
  // 🧭 Map Markers
  // ==============================
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
// 🎯 Add Markers to Map
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
// 🧠 Submenu & Dropdown logic
// ==============================
function initializeSubmenuListeners() {
  document.querySelectorAll('.dropdown-submenu > a').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const subMenu = this.nextElementSibling;
      if (subMenu && subMenu.classList.contains('dropdown-menu')) {
        const isVisible = subMenu.classList.contains('show');

        // Hide all other submenus
        document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(menu => {
          menu.classList.remove('show');
        });

        // Show current
        if (!isVisible) {
          subMenu.classList.add('show');
        }
      }
    });
  });

  // Global click closes all submenus
  document.addEventListener('click', e => {
    document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(menu => {
      if (!menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  });
}

// ==============================
// 🎨 Handle Design Switch
// ==============================
document.addEventListener('click', e => {
  const target = e.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    e.preventDefault();
    switchStyle(target.getAttribute('data-style'));
  }
});
