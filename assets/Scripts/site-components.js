// js/site-components.js - Enhanced Version with Fixed Mobile Menu
const SiteComponents = (function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  const config = {
    headerUrl: 'header.html',
    navUrl: 'nav.html',
    footerUrl: 'footer.html',
    mobileBreakpoint: 900,
    cache: true,
    cacheBuster: false
  };

  // ===== CACHE STORAGE =====
  const templateCache = new Map();

  // ===== LOAD TEMPLATE FUNCTION =====
  async function loadTemplate(url, elementId) {
    try {
      if (config.cache && templateCache.has(url)) {
        console.log(`Loading ${url} from cache`);
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = templateCache.get(url);
          if (elementId === 'main-nav') {
            setTimeout(initializeMobileMenu, 150);
          }
          return;
        }
      }

      const fetchUrl = config.cacheBuster ? url + '?v=' + Date.now() : url;
      console.log(`Fetching ${fetchUrl}`);
      
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      if (config.cache) {
        templateCache.set(url, html);
      }
      
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
        if (elementId === 'main-nav') {
          setTimeout(initializeMobileMenu, 150);
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
    
    const menuToggle = document.querySelector('.site-header .menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuToggle) {
      console.warn('Menu toggle button not found in header');
      return;
    }
    
    if (!menu) {
      console.warn('Menu element with class "menu" not found in navigation');
      return;
    }
    
    // Remove all existing event listeners by cloning
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Main menu toggle click handler
    newMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      menu.classList.toggle('open');
      
      // Update button icon
      if (menu.classList.contains('open')) {
        newMenuToggle.textContent = '✕';
        newMenuToggle.setAttribute('aria-label', 'Close navigation');
      } else {
        newMenuToggle.textContent = '☰';
        newMenuToggle.setAttribute('aria-label', 'Open navigation');
        
        // Close all dropdowns when closing main menu
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });
    
    // Handle dropdown toggles - FIXED VERSION
    function setupDropdowns() {
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (!link) return;
        
        // Remove any existing listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add click handler for mobile
        newLink.addEventListener('click', function(e) {
          // Only handle on mobile
          if (window.innerWidth <= config.mobileBreakpoint) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentDropdown = this.closest('.dropdown');
            
            // Check if this dropdown is already open
            const isOpen = currentDropdown.classList.contains('open');
            
            // OPTION 1: Close other dropdowns (uncomment if you want this behavior)
            // if (!isOpen) {
            //   dropdowns.forEach(d => {
            //     if (d !== currentDropdown) {
            //       d.classList.remove('open');
            //     }
            //   });
            // }
            
            // OPTION 2: Just toggle current dropdown (simpler, fewer glitches)
            currentDropdown.classList.toggle('open');
            
            console.log('Dropdown toggled:', currentDropdown.classList.contains('open') ? 'open' : 'closed');
          }
        });
      });
    }
    
    // Run dropdown setup
    setupDropdowns();
    
    // Close menu when clicking outside - IMPROVED VERSION
    document.addEventListener('click', function(e) {
      // Only on mobile
      if (window.innerWidth > config.mobileBreakpoint) return;
      
      const menu = document.querySelector('.menu');
      const menuToggle = document.querySelector('.site-header .menu-toggle');
      
      // If menu is open and click is outside menu AND outside toggle
      if (menu && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && !menuToggle?.contains(e.target)) {
          menu.classList.remove('open');
          
          // Reset toggle button
          if (menuToggle) {
            menuToggle.textContent = '☰';
            menuToggle.setAttribute('aria-label', 'Open navigation');
          }
          
          // DON'T close dropdowns automatically when clicking outside
          // Let the user decide when to close dropdowns
          // This prevents the glitch where dropdowns close unexpectedly
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
        
        if (menuToggle) {
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-label', 'Open navigation');
        }
        
        // Don't force close dropdowns on resize to desktop
        // This preserves desktop hover functionality
      }
    });
    
    console.log('Mobile menu initialized successfully');
  }

  // ===== PUBLIC API =====
  return {
    init: async function() {
      console.log('🚀 Initializing SiteComponents...');
      
      try {
        await loadTemplate(config.headerUrl, 'site-header');
        await loadTemplate(config.footerUrl, 'site-footer');
        await loadTemplate(config.navUrl, 'main-nav');
        
        console.log('✅ SiteComponents initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize SiteComponents:', error);
      }
    },

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

    clearCache: function() {
      templateCache.clear();
      console.log('🧹 Cache cleared');
    },

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
