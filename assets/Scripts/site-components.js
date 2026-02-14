// js/site-components.js - Enhanced Version with Error Handling & Caching
const SiteComponents = (function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  // Change these settings based on your needs
  const config = {
    headerUrl: 'header.html',        // Path to your header file
    navUrl: 'nav.html',             // Path to your navigation file
    footerUrl: 'footer.html',       // Path to your footer file
    mobileBreakpoint: 768,          // Mobile menu breakpoint in pixels (changed to 768 for better mobile UX)
    cache: true,                    // Enable/disable caching
    cacheBuster: false              // Set to true in development, false in production
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
          
          // Re-initialize components after content is loaded
          setTimeout(() => {
            initMobileMenu();
            initDropdowns();
          }, 100);
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
        
        // Re-initialize components after content is loaded
        setTimeout(() => {
          initMobileMenu();
          initDropdowns();
        }, 100);
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

  // ===== DROPDOWN INITIALIZATION =====
  // Initialize dropdown functionality for desktop
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Remove any existing event listeners (to prevent duplicates)
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      if (link) {
        // For desktop, we want hover behavior
        if (window.innerWidth > config.mobileBreakpoint) {
          dropdown.removeEventListener('mouseenter', handleMouseEnter);
          dropdown.removeEventListener('mouseleave', handleMouseLeave);
          
          dropdown.addEventListener('mouseenter', handleMouseEnter);
          dropdown.addEventListener('mouseleave', handleMouseLeave);
        }
      }
    });
  }

  // Mouse enter handler for desktop dropdowns
  function handleMouseEnter(e) {
    const dropdown = e.currentTarget;
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      menu.style.display = 'block';
    }
  }

  // Mouse leave handler for desktop dropdowns
  function handleMouseLeave(e) {
    const dropdown = e.currentTarget;
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      menu.style.display = '';
    }
  }

  // ===== MOBILE MENU INITIALIZATION =====
  // Sets up click handlers for mobile menu
  function initMobileMenu() {
    console.log('Initializing mobile menu');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Remove existing listeners if any
    if (menuToggle) {
      menuToggle.replaceWith(menuToggle.cloneNode(true));
      const newMenuToggle = document.querySelector('.menu-toggle');
      
      if (newMenuToggle) {
        newMenuToggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const mainNav = document.getElementById('main-nav');
          if (mainNav) {
            mainNav.classList.toggle('active');
            this.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
            
            // Close all dropdowns when closing menu
            if (!mainNav.classList.contains('active')) {
              dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
              });
            }
          }
        });
      }
    }

    // Handle dropdown clicks on mobile
    if (window.innerWidth <= config.mobileBreakpoint) {
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
              if (d !== dropdown) {
                d.classList.remove('active');
              }
            });
            
            dropdown.classList.toggle('active');
          });
        }
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const mainNav = document.getElementById('main-nav');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (mainNav && menuToggle) {
        if (!event.target.closest('#main-nav') && !event.target.closest('.menu-toggle')) {
          mainNav.classList.remove('active');
          menuToggle.textContent = '☰';
          
          // Close all dropdowns on mobile
          if (window.innerWidth <= config.mobileBreakpoint) {
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('active');
            });
          }
        }
      }
    });

    // Prevent menu from closing when clicking inside
    if (mainNav) {
      mainNav.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      const mainNav = document.getElementById('main-nav');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (window.innerWidth > config.mobileBreakpoint) {
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) menuToggle.textContent = '☰';
        
        // Reset dropdowns and restore hover behavior
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          
          // Re-initialize desktop hover
          initDropdowns();
        });
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
        // Check if we have the necessary container elements
        const hasHeader = document.getElementById('site-header');
        const hasFooter = document.getElementById('site-footer');
        
        // Load components if their containers exist
        const loadPromises = [];
        
        if (hasHeader) {
          loadPromises.push(loadTemplate(config.headerUrl, 'site-header'));
        }
        
        if (hasFooter) {
          loadPromises.push(loadTemplate(config.footerUrl, 'site-footer'));
        }
        
        // Wait for header and footer to load
        await Promise.all(loadPromises);
        
        // Load navigation after header (if container exists)
        const hasNav = document.getElementById('main-nav');
        if (hasNav) {
          await loadTemplate(config.navUrl, 'main-nav');
        }
        
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
      
      // Re-initialize with new config
      this.init();
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
