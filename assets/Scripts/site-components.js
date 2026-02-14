// js/site-components.js - Enhanced Version with Error Handling & Caching
const SiteComponents = (function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  const config = {
    headerUrl: 'header.html',        // Path to your header file
    navUrl: 'nav.html',             // Path to your navigation file
    footerUrl: 'footer.html',       // Path to your footer file
    mobileBreakpoint: 900,          // Mobile menu breakpoint in pixels
    cache: true,                    // Enable/disable caching
    cacheBuster: false              // Set to true in development, false in production
  };

  // ===== CACHE STORAGE =====
  const templateCache = new Map();

  // ===== LOAD TEMPLATE FUNCTION =====
  async function loadTemplate(url, elementId) {
    try {
      // Check cache first
      if (config.cache && templateCache.has(url)) {
        console.log(`Loading ${url} from cache`);
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = templateCache.get(url);
          // If we just loaded the navigation, initialize the mobile menu
          if (elementId === 'main-nav') {
            setTimeout(initializeMobileMenu, 100); // Small delay to ensure DOM is updated
          }
          return;
        }
      }

      // Add cache buster for development
      const fetchUrl = config.cacheBuster ? url + '?v=' + Date.now() : url;
      console.log(`Fetching ${fetchUrl}`);
      
      const response = await fetch(fetchUrl);
      
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
        // If we just loaded the navigation, initialize the mobile menu
        if (elementId === 'main-nav') {
          setTimeout(initializeMobileMenu, 100); // Small delay to ensure DOM is updated
        }
      } else {
        console.warn(`Element with id "${elementId}" not found`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to load ${url}:`, error.message);
      
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div class="error-message">
          <p>⚠️ Failed to load content. Please refresh the page or try again later.</p>
        </div>`;
      }
    }
  }

  // ===== INITIALIZE MOBILE MENU =====
  function initializeMobileMenu() {
    console.log('Initializing mobile menu...');
    
    // Get the menu toggle button from header
    const menuToggle = document.querySelector('.site-header .menu-toggle');
    
    // Get the menu that was loaded into main-nav
    const menu = document.querySelector('.menu');
    
    if (!menuToggle) {
      console.warn('Menu toggle button not found in header');
      return;
    }
    
    if (!menu) {
      console.warn('Menu element with class "menu" not found in navigation');
      return;
    }
    
    // Remove any existing event listeners by cloning and replacing
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Add click event to toggle main menu
    newMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle the menu
      menu.classList.toggle('open');
      
      // Change button text/icon based on state (optional)
      if (menu.classList.contains('open')) {
        newMenuToggle.textContent = '✕'; // Close icon
        newMenuToggle.setAttribute('aria-label', 'Close navigation');
      } else {
        newMenuToggle.textContent = '☰'; // Hamburger icon
        newMenuToggle.setAttribute('aria-label', 'Open navigation');
      }
      
      console.log('Menu toggled:', menu.classList.contains('open') ? 'open' : 'closed');
    });
    
    // Handle dropdown clicks on mobile
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    dropdownLinks.forEach(link => {
      // Remove existing listeners
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add click handler for mobile
      newLink.addEventListener('click', function(e) {
        if (window.innerWidth <= config.mobileBreakpoint) {
          e.preventDefault();
          e.stopPropagation();
          
          const dropdown = this.parentElement;
          
          // Toggle current dropdown
          dropdown.classList.toggle('open');
          console.log('Dropdown toggled:', dropdown.classList.contains('open') ? 'open' : 'closed');
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= config.mobileBreakpoint) {
        const menu = document.querySelector('.menu');
        const menuToggle = document.querySelector('.site-header .menu-toggle');
        
        if (menu && menu.classList.contains('open')) {
          // If click is outside menu and not on toggle button
          if (!menu.contains(e.target) && !menuToggle?.contains(e.target)) {
            menu.classList.remove('open');
            
            // Change toggle button back to hamburger
            if (menuToggle) {
              menuToggle.textContent = '☰';
              menuToggle.setAttribute('aria-label', 'Open navigation');
            }
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown.open').forEach(dropdown => {
              dropdown.classList.remove('open');
            });
            
            console.log('Menu closed by outside click');
          }
        }
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > config.mobileBreakpoint) {
        // Reset mobile menu state when switching to desktop
        const menu = document.querySelector('.menu');
        const menuToggle = document.querySelector('.site-header .menu-toggle');
        
        if (menu) {
          menu.classList.remove('open');
        }
        
        // Reset toggle button
        if (menuToggle) {
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-label', 'Open navigation');
        }
        
        // Close all dropdowns
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });
    
    console.log('Mobile menu initialized successfully');
  }

  // ===== PUBLIC API =====
  return {
    // Initialize everything
    init: async function() {
      console.log('🚀 Initializing SiteComponents...');
      
      try {
        // Load header first (it contains the menu toggle button)
        await loadTemplate(config.headerUrl, 'site-header');
        
        // Load footer
        await loadTemplate(config.footerUrl, 'site-footer');
        
        // Load navigation (this will trigger mobile menu initialization)
        await loadTemplate(config.navUrl, 'main-nav');
        
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
        templateCache.delete(urls[componentName]);
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SiteComponents.init());
} else {
  SiteComponents.init();
}
