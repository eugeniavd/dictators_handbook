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
      console.log(html)
      document.getElementById('header-placeholder').innerHTML = html;

      // After header is injected:
  setTimeout(() => {
    // Toggle header items based on page type
    if (document.body.classList.contains('article-page')) {
      document.querySelectorAll('.main-only').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.article-only').forEach(el => el.style.display = 'list-item');
    } else {
      document.querySelectorAll('.main-only').forEach(el => el.style.display = 'list-item');
      document.querySelectorAll('.article-only').forEach(el => el.style.display = 'none');
    }

    const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElements.forEach(el => new bootstrap.Dropdown(el));

    initializeSubmenuListeners();

    const collapseEl = document.querySelector('#navbarSupportedContent');
    if (collapseEl) {
      new bootstrap.Collapse(collapseEl, { toggle: false });
    }

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
// Capital Letters For Article Page
// ==============================

document.addEventListener("DOMContentLoaded", function () {
  const articles = document.querySelectorAll(".article-content");

  articles.forEach((article) => {
    const firstParagraph = article.querySelector("p:first-of-type");
    if (!firstParagraph) return;

    const html = firstParagraph.innerHTML.trim();
    if (!html) return;

    const firstLetter = html[0];
    const rest = html.slice(1);

    const dropCapSpan = document.createElement("span");
    dropCapSpan.className = "drop-cap";
    dropCapSpan.style.backgroundImage = `url("/images/ghzel/letters/${firstLetter.toUpperCase()}.png")`;

    
    const wrapper = document.createElement("div");
    wrapper.innerHTML = rest;
    
    
    firstParagraph.innerHTML = "";
    firstParagraph.appendChild(dropCapSpan);

    
    [...wrapper.childNodes].forEach(node => firstParagraph.appendChild(node));
  });
});

// ==============================
// Metadata 
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const sidebarItems = document.querySelectorAll('.sidebar-list li');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const id = item.dataset.id;
      if (!id) return;

      const target = document.querySelector(`.main-article .tag[data-id="${id}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('highlight-entity');
        setTimeout(() => target.classList.remove('highlight-entity'), 1500);
      }
    });
  });

  const allTags = document.querySelectorAll('.tag.person, .tag.organization, .tag.event');
  allTags.forEach(tag => {
    const wikiUrl = tag.dataset.wiki;
    const id = tag.dataset.id;
    const text = tag.textContent;

    if (wikiUrl) {
      const link = document.createElement('a');
      link.href = wikiUrl;
      link.textContent = text;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = tag.className;
      link.dataset.id = id;
      link.style.cursor = 'pointer';

      tag.replaceWith(link);
    }
  });
});



