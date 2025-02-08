// utilities/functions.js

/**
 * Utility functions for the site.
 */

/**
 * Switching design themes
 * @param {string} stylePath path to the css file 
 */
function switchStyle(stylePath) {
  const themeStylesheet = document.getElementById('themeStylesheet');
  if (themeStylesheet) {
    themeStylesheet.href = stylePath;
    console.log(`Switched style to: ${stylePath}`);
  } else {
    console.error('Theme stylesheet element with id "themeStylesheet" not found.');
  }
}



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