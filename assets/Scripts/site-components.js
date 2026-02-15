// assets/Scripts/site-components.js

const SiteComponents = (function () {
  'use strict';

  const config = {
    headerUrl: 'header.html',
    footerUrl: 'footer.html'
  };

  async function loadTemplate(url, elementId) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const element = document.getElementById(elementId);

      if (element) {
        element.innerHTML = html;
      }

    } catch (error) {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `
          <div style="padding:20px;color:red;">
            ⚠️ Failed to load content. Please refresh the page.
          </div>`;
      }
      console.error("Load error:", error);
    }
  }

  function initMobileMenu() {
    document.addEventListener("click", function (e) {

      // Toggle main menu
      if (e.target.classList.contains("menu-toggle")) {
        const menu = document.querySelector(".menu");
        if (menu) {
          menu.classList.toggle("open");
        }
      }

      // Toggle dropdown on mobile
      const dropdownLink = e.target.closest(".dropdown > a");
      if (dropdownLink && window.innerWidth <= 900) {
        e.preventDefault();
        dropdownLink.parentElement.classList.toggle("open");
      }
    });
  }

  return {
    init: async function () {
      await Promise.all([
        loadTemplate(config.headerUrl, 'site-header'),
        loadTemplate(config.footerUrl, 'site-footer')
      ]);

      initMobileMenu();
    }
  };

})();

document.addEventListener('DOMContentLoaded', () => {
  SiteComponents.init();
});
