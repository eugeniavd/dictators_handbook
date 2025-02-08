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
      // Inizialize Bootstrap dropdown for element with dynamic loading:
      var dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.forEach(function(el) {
        new bootstrap.Dropdown(el);
      });
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

// Delegated event listeners for dropdown submenus 
document.addEventListener('mouseover', function(event) {
  const submenuElement = event.target.closest('.dropdown-submenu');
  if (submenuElement) {
    const submenuDropdown = submenuElement.querySelector('.submenu');
    if (submenuDropdown) {
      submenuDropdown.style.display = 'block';
    }
  }
});

document.addEventListener('mouseout', function(event) {
  const submenuElement = event.target.closest('.dropdown-submenu');
  if (submenuElement) {
    const submenuDropdown = submenuElement.querySelector('.submenu');
    if (submenuDropdown) {
      submenuDropdown.style.display = 'none';
    }
  }
});

// Delegated click event for design switching
document.addEventListener('click', function(event) {
  // Checking click for .dropdown-item
  const target = event.target;
  if (target.matches('.dropdown-item') && target.hasAttribute('data-style')) {
    event.preventDefault(); // Prevent href
    const stylePath = target.getAttribute('data-style');
    if (stylePath) {
      switchStyle(stylePath);
    }
  }
});


