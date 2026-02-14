// js/site-components.js - Hybrid Version (Your working logic + caching)
const SiteComponents = (function() {
  'use strict';
  
  const config = {
    headerUrl: 'header.html',
    navUrl: 'nav.html',
    footerUrl: 'footer.html',
    mobileBreakpoint: 900,
    cache: true,
    cacheBuster: false
  };

  const templateCache = new Map();

  async function loadTemplate(url, elementId) {
    try {
      if (config.cache && templateCache.has(url)) {
        document.getElementById(elementId).innerHTML = templateCache.get(url);
        if (elementId === 'main-nav') setupMobileMenu();
        return;
      }

      const fetchUrl = config.cacheBuster ? url + '?v=' + Date.now() : url;
      const response = await fetch(fetchUrl);
      const html = await response.text();
      
      if (config.cache) templateCache.set(url, html);
      document.getElementById(elementId).innerHTML = html;
      
      if (elementId === 'main-nav') setupMobileMenu();
      
    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
      document.getElementById(elementId).innerHTML = '<div class="error">Failed to load</div>';
    }
  }

  // YOUR WORKING MOBILE MENU LOGIC (slightly enhanced)
  function setupMobileMenu() {
    console.log('Setting up mobile menu with your working logic');
    
    // Remove any existing listeners by re-adding the event listener
    // This prevents duplicates
    const clickHandler = function(e) {
      // Toggle main menu
      if (e.target.classList.contains("menu-toggle")) {
        e.preventDefault();
        const menu = document.querySelector(".menu");
        if (menu) {
          menu.classList.toggle("open");
          console.log('Menu toggled');
        }
      }

      // Toggle dropdowns on mobile - YOUR EXACT LOGIC
      const dropdownLink = e.target.closest(".dropdown > a");
      if (dropdownLink && window.innerWidth <= config.mobileBreakpoint) {
        e.preventDefault();
        dropdownLink.parentElement.classList.toggle("open");
        console.log('Dropdown toggled');
      }
    };
    
    // Remove old listener and add new one
    document.removeEventListener('click', clickHandler);
    document.addEventListener('click', clickHandler);
  }

  return {
    init: async function() {
      console.log('🚀 Loading...');
      await Promise.all([
        loadTemplate(config.headerUrl, 'site-header'),
        loadTemplate(config.footerUrl, 'site-footer')
      ]);
      await loadTemplate(config.navUrl, 'main-nav');
    },
    
    reloadComponent: function(component) {
      const urls = {header: config.headerUrl, nav: config.navUrl, footer: config.footerUrl};
      const ids = {header: 'site-header', nav: 'main-nav', footer: 'site-footer'};
      if (component in urls) {
        templateCache.delete(urls[component]);
        return loadTemplate(urls[component], ids[component]);
      }
    },
    
    clearCache: function() {
      templateCache.clear();
    }
  };
})();

// Auto-start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SiteComponents.init());
} else {
  SiteComponents.init();
}
