// js/site-components.js - Enhanced Version with Error Handling & Caching
const SiteComponents = (function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  // Change these settings based on your needs
  const config = {
    headerUrl: 'header.html',        // Path to your header file
    navUrl: 'nav.html',             // Path to your navigation file
    footerUrl: 'footer.html',       // Path to your footer file
    mobileBreakpoint: 900,          // Mobile menu breakpoint in pixels
    cache: true,                   // Enable/disable caching
    cacheBuster: false             // Set to true in development, false in production
  };

  // ===== CACHE STORAGE =====
  // Stores loaded templates to avoid repeated network requests
  const templateCache = new Map();

  // ===== LOAD TEMPLATE FUNCTION =====
  // Loads HTML templates with error handling and caching
  async function loadTemplate(url, elementId) {
    try {
      // Check cache first (if enabled)
      if (config.cache && templateCache.has(url)) {
        console.log(`Loading ${url} from cache`);
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = templateCache.get(url);
          return;
        }
      }

      // Add cache buster for development (prevents browser caching)
      const fetchUrl = config.cacheBuster ? url + '?v=' + Date.now() : url;
      console.log(`Fetching ${fetchUrl}`);
      
      const response = await fetch(fetchUrl);
      
      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Store in cache
      if (config.cache) {
        templateCache.set(url, html);
      }
      
      // Insert into the DOM
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
      } else {
        console.warn(`Element with id "${elementId}" not found`);
      }
      
    } catch (error) {
      // Handle all errors gracefully
      console.error(`❌ Failed to load ${url}:`, error.message);
      
      // Show fallback content to users
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div class="error-message">
          <p>⚠️ Failed to load content. Please refresh the page or try again later.</p>
        </div>`;
      }
    }
  }

  // ===== MOBILE MENU INITIALIZATION =====
  // Sets up click handlers for mobile menu
  function initMobileMenu() {
    console.log('Initializing mobile menu');
    
    document.addEventListener("click", function(e) {
      // Toggle main menu when menu-toggle button is clicked
      if (e.target.classList.contains("menu-toggle")) {
        e.preventDefault();
        const menu = document.querySelector(".menu");
        if (menu) {
          menu.classList.toggle("open");
          console.log('Menu toggled:', menu.classList.contains('open') ? 'open' : 'closed');
        }
      }

      // Handle dropdown menus on mobile devices
      const dropdownLink = e.target.closest(".dropdown > a");
      if (dropdownLink && window.innerWidth <= config.mobileBreakpoint) {
        e.preventDefault();
        dropdownLink.parentElement.classList.toggle("open");
        console.log('Dropdown toggled');
      }
    });
  }

  // ===== PUBLIC API =====
  // Return only what should be accessible from outside
  return {
    // Initialize everything
    init: async function() {
      console.log('🚀 Initializing SiteComponents...');
      
      try {
        // Load header and footer in parallel (faster!)
        await Promise.all([
          loadTemplate(config.headerUrl, 'site-header'),
          loadTemplate(config.footerUrl, 'site-footer')
        ]);
        
        // Load navigation after header (if needed)
        await loadTemplate(config.navUrl, 'main-nav');
        
        // Initialize mobile menu after all components are loaded
        initMobileMenu();
        
        console.log('✅ SiteComponents initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize SiteComponents:', error);
      }
    },

    // Manually reload a specific component
    reloadComponent: function(componentName) {
      const urls = {
        'header': config.headerUrl,
        'nav': config.navUrl,
        'footer': config.footerUrl
      };
      
      const elementIds = {
        'header': 'site-header',
        'nav': 'main-nav',
        'footer': 'site-footer'
      };
      
      if (componentName in urls) {
        // Clear cache for this component
        templateCache.delete(urls[componentName]);
        // Reload it
        return loadTemplate(urls[componentName], elementIds[componentName]);
      }
    },

    // Clear entire cache
    clearCache: function() {
      templateCache.clear();
      console.log('🧹 Cache cleared');
    },

    // Update configuration
    updateConfig: function(newConfig) {
      Object.assign(config, newConfig);
      console.log('⚙️ Configuration updated:', config);
    }
  };
})();

// ===== AUTO-INITIALIZATION =====
// Start everything when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SiteComponents.init());
} else {
  // DOM is already loaded
  SiteComponents.init();
}
