// js/site-components.js - Fixed Version
const SiteComponents = (function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  const config = {
    mobileBreakpoint: 900,          // Mobile menu breakpoint in pixels
  };

  // ===== MOBILE MENU INITIALIZATION =====
  function initMobileMenu() {
    console.log('Initializing mobile menu');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuToggle || !menu) {
      console.warn('Menu toggle or menu not found');
      return;
    }
    
    // Toggle main menu when menu-toggle button is clicked
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('open');
      console.log('Menu toggled:', menu.classList.contains('open') ? 'open' : 'closed');
    });

    // Handle dropdown menus on mobile devices
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= config.mobileBreakpoint) {
          e.preventDefault();
          e.stopPropagation();
          const dropdown = this.parentElement;
          dropdown.classList.toggle('open');
          console.log('Dropdown toggled');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= config.mobileBreakpoint) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
          menu.classList.remove('open');
          
          // Close all dropdowns
          document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > config.mobileBreakpoint) {
        menu.classList.remove('open');
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });
  }

  // ===== ACTIVE LINK HIGHLIGHTING =====
  function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ===== GO TO TOP BUTTON =====
  function initGoToTop() {
    const goTopBtn = document.getElementById('goTopBtn');
    
    if (!goTopBtn) return;
    
    window.onscroll = function() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goTopBtn.style.display = "block";
      } else {
        goTopBtn.style.display = "none";
      }
    };
    
    goTopBtn.addEventListener('click', function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  }

  // ===== PUBLIC API =====
  return {
    init: function() {
      console.log('🚀 Initializing SiteComponents...');
      
      // Initialize all features
      initMobileMenu();
      highlightActiveLink();
      initGoToTop();
      
      console.log('✅ SiteComponents initialized successfully');
    },

    // Manually refresh active link highlighting
    refreshActiveLink: function() {
      highlightActiveLink();
    }
  };
})();

// ===== AUTO-INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SiteComponents.init());
} else {
  SiteComponents.init();
}
