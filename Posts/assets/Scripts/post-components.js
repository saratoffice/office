/**
 * Post Components - Handles loading of header and footer
 * Updated with correct paths for your GitHub structure
 */

const SiteComponents = (function () {

  // Configuration - Using absolute paths from root (recommended)
  const config = {
    headerUrl: '/header.html',
    footerUrl: '/footer.html'
  };

  // Calculate how many levels deep we are from root
  function getBasePath() {
    const path = window.location.pathname;
    // Remove leading and trailing slashes, then split
    const parts = path.split('/').filter(p => p.length > 0);
    
    // If we're at root (e.g., /index.html), parts.length = 1
    // If we're in /Posts/something.html, parts.length = 2
    const depth = Math.max(0, parts.length - 1);
    
    // Return '../' repeated 'depth' times
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  async function loadTemplate(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found`);
      return;
    }

    // Show loading placeholder
    element.innerHTML = '<div style="text-align: center; padding: 20px;">Loading...</div>';

    try {
      // Try absolute path first (from root)
      let response = await fetch(url).catch(() => null);
      
      // If absolute path fails, try relative path based on current depth
      if (!response || !response.ok) {
        const basePath = getBasePath();
        // Remove leading slash for relative path
        const relativeUrl = basePath + url.substring(1);
        console.log(`Trying relative path: ${relativeUrl}`);
        response = await fetch(relativeUrl);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      
      // Process the HTML to fix any remaining relative paths
      const processedHtml = fixRelativePathsInContent(html);
      
      element.innerHTML = processedHtml;
      
      // Dispatch success event
      window.dispatchEvent(new CustomEvent('templateLoaded', { 
        detail: { elementId } 
      }));

    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
      
      // Show user-friendly error with retry button
      element.innerHTML = `
        <div style="background: #fee2e2; color: #b91c1c; padding: 20px; text-align: center; border-radius: 8px; margin: 10px;">
          <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
          Failed to load site content.
          <button onclick="location.reload()" style="background: #ef4444; color: white; border: none; padding: 8px 20px; border-radius: 20px; margin-left: 10px; cursor: pointer;">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  }

  // Fix relative paths in loaded content (images, links, iframes)
  function fixRelativePathsInContent(html) {
    const basePath = getBasePath();
    
    // Create a temporary container to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Fix all anchor tags
    temp.querySelectorAll('a[href]').forEach(a => {
      let href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        a.setAttribute('href', basePath + href);
      }
    });
    
    // Fix all image tags
    temp.querySelectorAll('img[src]').forEach(img => {
      let src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
        img.setAttribute('src', basePath + src);
      }
    });
    
    // Fix all iframe src attributes (for Facebook/YouTube embeds)
    temp.querySelectorAll('iframe[src]').forEach(iframe => {
      let src = iframe.getAttribute('src');
      // External URLs (YouTube, Facebook) should remain as-is
      if (src && !src.startsWith('http')) {
        iframe.setAttribute('src', basePath + src);
      }
    });
    
    return temp.innerHTML;
  }

  function initMobileMenu() {
    setTimeout(() => {
      const menuToggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.menu');

      if (!menuToggle || !menu) {
        console.log('Menu elements not found - this is normal if header has no menu');
        return;
      }

      // Toggle menu on hamburger click
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

      // Handle dropdowns for mobile
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
            
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
            });
          }
        }, 250);
      });

    }, 200);
  }

  function setActiveMenuItem() {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const currentPage = currentPath.split('/').pop() || 'index.html';
      
      const menuLinks = document.querySelectorAll('.menu a');
      
      menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkPage = href.split('/').pop();
          
          if (currentPage === linkPage || 
              (currentPage === '' && linkPage === 'index.html') ||
              currentPath.includes(linkPage)) {
            
            link.classList.add('active');
            
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
              const parentLink = parentDropdown.querySelector('> a');
              if (parentLink) {
                parentLink.classList.add('active');
              }
            }
          }
        }
      });
    }, 300);
  }

  // Public API
  return {
    init: async function () {
      console.log('Initializing site components...');
      console.log('Current path:', window.location.pathname);
      console.log('Base path:', getBasePath());
      
      try {
        // Load header and footer
        await Promise.all([
          loadTemplate(config.headerUrl, 'site-header'),
          loadTemplate(config.footerUrl, 'site-footer')
        ]);
        
        // Initialize menu functionality
        initMobileMenu();
        
        // Set active menu item
        setActiveMenuItem();
        
        console.log('Site components initialized successfully');
        
        window.dispatchEvent(new CustomEvent('siteComponentsLoaded'));
        
      } catch (error) {
        console.error('Failed to initialize site components:', error);
        window.dispatchEvent(new CustomEvent('siteComponentsError'));
      }
    },
    
    reload: function() {
      this.init();
    }
  };

})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => SiteComponents.init(), 100);
  });
} else {
  setTimeout(() => SiteComponents.init(), 100);
}
