const SiteComponents = (function () {

  const config = {
    headerUrl: './header.html',
    footerUrl: './footer.html'
  };

  async function loadTemplate(url, elementId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

      const html = await response.text();
      const element = document.getElementById(elementId);

      if (element) {
        element.innerHTML = html;
      } else {
        console.warn(`Element with ID "${elementId}" not found`);
      }

    } catch (error) {
      console.error(`Failed to load ${url}:`, error.message);
      // Optional: Show fallback content
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">
          Failed to load content. Please refresh the page.
        </div>`;
      }
    }
  }

  function initMobileMenu() {
    // Wait a bit for DOM to be fully ready with loaded templates
    setTimeout(() => {
      const menuToggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.menu');

      if (!menuToggle || !menu) {
        console.warn('Menu elements not found');
        return;
      }

      // Toggle menu on hamburger click
      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('open');
        
        // Toggle between hamburger and close icon
        if (menu.classList.contains('open')) {
          menuToggle.innerHTML = '✕'; // Close icon
          menuToggle.setAttribute('aria-label', 'Close menu');
        } else {
          menuToggle.innerHTML = '☰'; // Hamburger icon
          menuToggle.setAttribute('aria-label', 'Open menu');
        }
      });

      // Handle dropdowns for mobile
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        if (link) {
          link.addEventListener('click', function(e) {
            // Only handle clicks on mobile
            if (window.innerWidth <= 900) {
              e.preventDefault();
              e.stopPropagation();
              
              // Close other open dropdowns (optional)
              dropdowns.forEach(d => {
                if (d !== dropdown && d.classList.contains('open')) {
                  d.classList.remove('open');
                }
              });
              
              dropdown.classList.toggle('open');
            }
          });
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
          }
        }
      });

      // Reset on window resize
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.innerWidth > 900) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
            });
          }
        }, 250);
      });

      // Prevent menu items with links from toggling dropdown on desktop
      window.addEventListener('click', function(e) {
        if (window.innerWidth > 900) {
          const dropdownLink = e.target.closest('.dropdown > a');
          if (dropdownLink) {
            // Let the default link behavior happen on desktop
            return;
          }
        }
      });

    }, 100); // Small delay to ensure DOM is updated after template loading
  }

  // Function to highlight active menu item based on current page
  function setActiveMenuItem() {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const menuLinks = document.querySelectorAll('.menu a');
      
      menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
          link.classList.add('active');
          
          // If in dropdown, highlight parent as well
          const parentDropdown = link.closest('.dropdown');
          if (parentDropdown) {
            const parentLink = parentDropdown.querySelector('> a');
            if (parentLink) {
              parentLink.classList.add('active');
            }
          }
        }
      });
    }, 200);
  }

  return {
    init: async function () {
      try {
        await Promise.all([
          loadTemplate(config.headerUrl, 'site-header'),
          loadTemplate(config.footerUrl, 'site-footer')
        ]);
        
        // Initialize mobile menu after templates are loaded
        initMobileMenu();
        
        // Set active menu item
        setActiveMenuItem();
        
        console.log('Site components initialized successfully');
      } catch (error) {
        console.error('Failed to initialize site components:', error);
      }
    }
  };

})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  SiteComponents.init();
});
