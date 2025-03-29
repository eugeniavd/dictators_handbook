// utilities/functions.js

/**
 * Switches the design theme by updating the stylesheet link.
 * @param {string} stylePath - Path to the CSS file.
 */
function switchStyle(stylePath) {
  const themeStylesheet = document.getElementById('themeStylesheet');
  if (themeStylesheet) {
    themeStylesheet.href = stylePath;
    // Saving design theme in the local storage
    localStorage.setItem('selectedTheme', stylePath);
    console.log(`Switched style to: ${stylePath}`);
  } else {
    console.error('Theme stylesheet element with id "themeStylesheet" not found.');
  }
}

// Applying the chosen theme to other pages
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

// Load header and footer via fetch
document.addEventListener("DOMContentLoaded", function() {
  // Load header.html
  fetch('/components/header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('You have an error with header.html');
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;
      // Initialize Bootstrap dropdowns after header load
      var dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.forEach(function(el) {
        new bootstrap.Dropdown(el);
      });

      // Reinitialize submenu event listeners after header is loaded
      initializeSubmenuListeners();
    })
    .catch(error => console.error('Error:', error));

  // Load footer.html
  fetch('/components/footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('You have an error with footer.html');
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
});

// Function to initialize submenu hover and click behavior
function initializeSubmenuListeners() {
  document.querySelectorAll('.dropdown-submenu .dropdown-toggle').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let submenu = this.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle('show');
      }
    });
  });

  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(function(submenu) {
      if (!submenu.contains(e.target)) {
        submenu.classList.remove('show');
      }
    });
  });

  // Hover support
  document.querySelectorAll('.dropdown-submenu').forEach(function(submenu) {
    submenu.addEventListener('mouseenter', function() {
      let dropdownMenu = this.querySelector('.submenu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'block';
      }
    });

    submenu.addEventListener('mouseleave', function() {
      let dropdownMenu = this.querySelector('.submenu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
      }
    });
  });
}

// Call submenu listener function after DOM is loaded
document.addEventListener("DOMContentLoaded", initializeSubmenuListeners);

// Delegated click event for design switching
document.addEventListener('click', function(event) {
  const target = event.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    event.preventDefault(); // Prevent href navigation
    const stylePath = target.getAttribute('data-style');
    if (stylePath) {
      switchStyle(stylePath);
    }
  }
});

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
    .catch(err => {
      console.error("Error loading map.json:", err);
    });

  function addMapMarkers(map, locations) {
    locations.forEach(loc => {
      let popupContent = `<strong>${loc.name}</strong><br>`;

      if (loc.wikipedia) {
        popupContent += `
          <div style="margin: 4px 0;">
            <a href="${loc.wikipedia}" target="_blank" style="
              display: inline-flex;
              align-items: center;
              padding: 4px 8px;
              background-color: #000;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-size: 13px;
              line-height: 1.2;
              gap: 6px;
            ">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
                alt="Wikipedia" width="16" height="16" />
              Wikipedia
            </a>
          </div>
        `;
      }

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

      L.marker(loc.coords)
        .addTo(map)
        .bindPopup(popupContent);
    });
  }

  window.addMapMarkers = addMapMarkers;
  
