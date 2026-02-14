// js/site-components.js - Universal Version with Home Page Fix
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
  let menuInitialized = false;

  async function loadTemplate(url, elementId) {
    try {
      console.log(`Loading ${url} into #${elementId}`);
      
      if (config.cache && templateCache.has(url)) {
        document.getElementById(elementId).innerHTML = templateCache.get(url);
        if (elementId === 'main-nav') {
          setTimeout(() => setupMobileMenu(), 200);
        }
        return;
      }

      const fetchUrl = config.cacheBuster ? url + '?v=' + Date.now() : url;
      const response = await fetch(fetchUrl);
      const html = await response.text();
      
      if (config.cache) templateCache.set(url, html);
      document.getElementById(elementId).innerHTML = html;
      
      if (elementId === 'main-nav') {
        setTimeout(() => setupMobileMenu(), 200);
      }
      
    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
    }
  }

  // DIRECT DOM MANIPULATION APPROACH (Most Reliable)
  function setupMobileMenu() {
    console.log('Setting up mobile menu...');
    
    // Get elements
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    // Debug: Log what we found
    console.log('🔍 Menu toggle found:', menuToggle);
    console.log('🔍 Menu found:', menu);
    console.log('🔍 Window width:', window.innerWidth);
    console.log('🔍 Is mobile:', window.innerWidth <= config.mobileBreakpoint);
    
    if (!menuToggle) {
      console.error('❌ CRITICAL: Menu toggle button not found!');
      console.log('Available buttons:', document.querySelectorAll('button'));
      return;
    }
    
    if (!menu) {
      console.error('❌ CRITICAL: Menu element not found!');
      console.log('Available elements with class "menu":', document.querySelectorAll('.menu'));
      return;
    }
    
    // PREVENT MULTIPLE LISTENERS - Remove all existing listeners
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // DIRECT CLICK HANDLER - Most straightforward approach
    newMenuToggle.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('👆 Menu toggle clicked!');
      console.log('Before toggle - menu classes:', menu.className);
      
      // Toggle menu
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        this.textContent = '☰';
        console.log('Menu closed');
      } else {
        menu.classList.add('open');
        this.textContent = '✕';
        console.log('Menu opened');
      }
      
      console.log('After toggle - menu classes:', menu.className);
    };
    
    // DROPDOWN HANDLER - Direct approach
    function setupDropdowns() {
      const dropdownLinks = document.querySelectorAll('.dropdown > a');
      console.log('📋 Dropdown links found:', dropdownLinks.length);
      
      dropdownLinks.forEach((link, index) => {
        // Remove existing listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Direct onclick handler
        newLink.onclick = function(e) {
          if (window.innerWidth <= config.mobileBreakpoint) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.parentElement;
            console.log(`Dropdown ${index} clicked, was open:`, dropdown.classList.contains('open'));
            
            // Toggle this dropdown
            dropdown.classList.toggle('open');
            
            console.log('Dropdown now open:', dropdown.classList.contains('open'));
          }
        };
      });
    }
    
    // Run dropdown setup
    setupDropdowns();
    
    // Outside click handler
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= config.mobileBreakpoint) {
        const menu = document.querySelector('.menu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (menu && menu.classList.contains('open')) {
          if (!menu.contains(e.target) && !toggle?.contains(e.target)) {
            menu.classList.remove('open');
            if (toggle) toggle.textContent = '☰';
            
            // Close dropdowns
            document.querySelectorAll('.dropdown.open').forEach(d => {
              d.classList.remove('open');
            });
            
            console.log('Menu closed by outside click');
          }
        }
      }
    });
    
    menuInitialized = true;
    console.log('✅ Mobile menu setup complete!');
  }

  // Public API
  return {
    init: async function() {
      console.log('🚀 Initializing SiteComponents...');
      menuInitialized = false;
      
      try {
        await loadTemplate(config.headerUrl, 'site-header');
        await loadTemplate(config.footerUrl, 'site-footer');
        await loadTemplate(config.navUrl, 'main-nav');
        
        console.log('✅ SiteComponents initialized');
        
        // Extra check for home page
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
          console.log('🏠 Home page detected - applying extra fixes');
          setTimeout(() => {
            if (!document.querySelector('.menu')?.classList.contains('open')) {
              setupMobileMenu(); // Force re-setup
            }
          }, 500);
        }
        
      } catch (error) {
        console.error('Init failed:', error);
      }
    },
    
    // Manual reinit
    reinitMenu: function() {
      console.log('Manual menu reinit triggered');
      menuInitialized = false;
      setupMobileMenu();
    },
    
    reloadComponent: function(component) {
      const urls = {header: config.headerUrl, nav: config.navUrl, footer: config.footerUrl};
      const ids = {header: 'site-header', nav: 'main-nav', footer: 'site-footer'};
      if (component in urls) {
        templateCache.delete(urls[component]);
        menuInitialized = false;
        return loadTemplate(urls[component], ids[component]);
      }
    },
    
    clearCache: function() {
      templateCache.clear();
      menuInitialized = false;
      console.log('Cache cleared');
    }
  };
})();

// Multiple initialization attempts for reliability
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SiteComponents.init());
} else {
  SiteComponents.init();
}

// Backup initialization
window.addEventListener('load', () => {
  setTimeout(() => {
    SiteComponents.reinitMenu();
  }, 300);
});

// Emergency fallback - Direct handler if everything else fails
setTimeout(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (toggle && menu) {
    console.log('⚠️ Emergency fallback: Adding direct click handler');
    
    // Remove all previous handlers
    toggle.onclick = null;
    
    // Add direct handler
    toggle.onclick = function(e) {
      e.preventDefault();
      menu.classList.toggle('open');
      this.textContent = menu.classList.contains('open') ? '✕' : '☰';
      console.log('Emergency toggle worked!');
    };
  }
}, 1000);
