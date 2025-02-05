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
  