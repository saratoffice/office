const SiteComponents = (function () {

  // FIXED: Use absolute paths from root
  const config = {
    headerUrl: '/header.html',
    footerUrl: '/footer.html'
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
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">
          Failed to load content. Please refresh the page.
        </div>`;
      }
    }
  }

  function initMobileMenu() {
    setTimeout(() => {
      const menuToggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.menu');

      if (!menuToggle || !menu) {
        console.warn('Menu elements not found');
        return;
      }

      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('open');
        
        if (menu.classList.contains('open')) {
          menuToggle.innerHTML = '✕';
          menuToggle.setAttribute('aria-label', 'Close menu');
        } else {
          menuToggle.innerHTML = '☰';
          menuToggle.setAttribute('aria-label', 'Open menu');
        }
      });

      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        if (link) {
          link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
              e.preventDefault();
              e.stopPropagation();
              
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

      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
          }
        }
      });

      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.innerWidth > 900) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
            });
          }
        }, 250);
      });

    }, 100);
  }

  function setActiveMenuItem() {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const menuLinks = document.querySelectorAll('.menu a');
      
      menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
          link.classList.add('active');
          
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
        
        initMobileMenu();
        setActiveMenuItem();
        
        console.log('Site components initialized successfully');
      } catch (error) {
        console.error('Failed to initialize site components:', error);
      }
    }
  };

})();

document.addEventListener('DOMContentLoaded', () => {
  SiteComponents.init();
});
