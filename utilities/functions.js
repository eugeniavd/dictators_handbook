// utilities/functions.js

/**
 * Utility functions for the site.
 */

/**
 * Switches the design theme by updating the stylesheet link.
/**
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

// Applying the choosen theme to other pages
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


document.addEventListener('DOMContentLoaded', () => {
  // Add hover functionality for dropdown submenus
  const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');

  dropdownSubmenus.forEach((submenu) => {
    submenu.addEventListener('mouseover', () => {
      const submenuDropdown = submenu.querySelector('.submenu');
      if (submenuDropdown) {
        submenuDropdown.style.display = 'block';
      }
    });

    submenu.addEventListener('mouseout', () => {
      const submenuDropdown = submenu.querySelector('.submenu');
      if (submenuDropdown) {
        submenuDropdown.style.display = 'none';
      }
    });
  });
});