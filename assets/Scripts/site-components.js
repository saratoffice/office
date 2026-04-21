// MAIN SITE COMPONENTS MODULE - HANDLES HEADER, FOOTER, AND NAVIGATION
const SiteComponents = (function () {

  // FIXED: Use absolute paths from root
  // CONFIGURATION OBJECT FOR TEMPLATE FILE PATHS
  const config = {
    headerUrl: '/header.html',
    footerUrl: '/footer.html'
  };

  // SCROLL BEHAVIOR VARIABLES - TRACKS SCROLL POSITION FOR HEADER ANIMATIONS
  let lastScrollTop = 0;
  let scrollThreshold = 50;
  let isTopBarHidden = false;
  let isHeaderMinimized = false;
  let scrollTimeout;

  // FUNCTION TO LOAD HTML TEMPLATES (HEADER/FOOTER) VIA FETCH API
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

  // FUNCTION TO HANDLE SCROLL-BASED HEADER BEHAVIOR (HIDE/SHOW TOP BAR, MINIMIZE HEADER)
  function initScrollBehavior() {
    const topBar = document.querySelector('.top-bar');
    const siteHeader = document.querySelector('.site-header');
    const body = document.body;

    if (!topBar || !siteHeader) {
      console.warn('Top bar or site header not found for scroll behavior');
      return;
    }

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // DETERMINE SCROLL DIRECTION AND APPLY HEADER CHANGES
      if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          // SCROLLING DOWN - HIDE TOP BAR AND MINIMIZE HEADER
          if (!isTopBarHidden) {
            topBar.classList.add('hidden');
            siteHeader.classList.add('minimized');
            body.classList.add('header-minimized');
            isTopBarHidden = true;
            isHeaderMinimized = true;
          }
        } else {
          // SCROLLING UP - SHOW TOP BAR AND RESTORE HEADER (ONLY NEAR TOP)
          if (isTopBarHidden && scrollTop < 200) {
            topBar.classList.remove('hidden');
            siteHeader.classList.remove('minimized');
            body.classList.remove('header-minimized');
            isTopBarHidden = false;
            isHeaderMinimized = false;
          }
        }
        
        lastScrollTop = scrollTop;
      }
    }

    // THROTTLE SCROLL EVENTS FOR BETTER PERFORMANCE
    window.addEventListener('scroll', function() {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
          handleScroll();
          scrollTimeout = null;
        }, 10);
      }
    });

    // INITIAL CHECK ON PAGE LOAD
    handleScroll();
  }

  // FUNCTION TO INITIALIZE MOBILE MENU BEHAVIOR (HAMBURGER MENU, DROPDOWNS)
  function initMobileMenu() {
    setTimeout(() => {
      const menuToggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.menu');

      if (!menuToggle || !menu) {
        console.warn('Menu elements not found');
        return;
      }

      // TOGGLE MOBILE MENU OPEN/CLOSE ON BUTTON CLICK
      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('open');
        
        if (menu.classList.contains('open')) {
          menuToggle.innerHTML = '✕';
          menuToggle.setAttribute('aria-label', 'Close menu');
        } else {
          menuToggle.innerHTML = '☰';
          menuToggle.setAttribute('aria-label', 'Open menu');
          
          // CLOSE ALL DROPDOWNS WHEN CLOSING THE MENU
          const allDropdowns = document.querySelectorAll('.dropdown, .sub-dropdown');
          allDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      });

      // HANDLE BOTH DROPDOWN AND SUB-DROPDOWN CLICKS ON MOBILE
      const allDropdowns = document.querySelectorAll('.dropdown, .sub-dropdown');
      
      allDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        if (link) {
          link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
              e.preventDefault();
              e.stopPropagation();
              
              // CLOSE SIBLING DROPDOWNS AT THE SAME LEVEL
              const parent = dropdown.parentElement;
              
              if (parent) {
                Array.from(parent.children).forEach(sibling => {
                  if (sibling !== dropdown && 
                      (sibling.classList.contains('dropdown') || 
                       sibling.classList.contains('sub-dropdown')) && 
                      sibling.classList.contains('open')) {
                    sibling.classList.remove('open');
                  }
                });
              }
              
              // TOGGLE CURRENT DROPDOWN
              dropdown.classList.toggle('open');
            }
          });
        }
      });

      // CLOSE MENU WHEN CLICKING OUTSIDE ON MOBILE
      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            // CLOSE ALL DROPDOWNS WHEN CLICKING OUTSIDE
            allDropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
            });
          }
        }
      });

      // RESET MENU STATE WHEN RESIZING TO DESKTOP VIEW
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.innerWidth > 900) {
            menu.classList.remove('open');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            // CLOSE ALL DROPDOWNS WHEN SWITCHING TO DESKTOP
            allDropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
            });
          }
        }, 250);
      });

      // APPLY MOBILE-SPECIFIC CSS FIXES
      applyMobileFixes();

    }, 100);
  }

  // FUNCTION TO APPLY CSS FIXES FOR MOBILE MENU DISPLAY
  function applyMobileFixes() {
    if (window.innerWidth <= 900) {
      let styleEl = document.getElementById('mobile-menu-fixes');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'mobile-menu-fixes';
        document.head.appendChild(styleEl);
      }
      
      // CSS FIXES FOR SUBMENUS ON MOBILE
      styleEl.textContent = `
        @media (max-width: 900px) {
          /* FIX FOR GALLERY AND ALL SUBMENUS ON MOBILE */
          .dropdown-menu li:last-child .sub-menu,
          .sub-dropdown .sub-menu {
            left: 0 !important;
            right: auto !important;
            position: relative !important;
          }
          
          /* FIX FOR SUBMENU ARROWS */
          .dropdown-menu li:last-child .sub-menu a::after,
          .sub-dropdown > a::after {
            content: "▼" !important;
            transform: none !important;
          }
          
          .sub-dropdown.open > a::after {
            transform: rotate(180deg) !important;
          }
          
          /* ENSURE PROPER STACKING */
          .sub-dropdown .sub-menu {
            display: none;
            width: 100%;
            margin-left: 0 !important;
          }
          
          .sub-dropdown.open > .sub-menu {
            display: block !important;
          }
          
          /* FIX FOR NESTED SUBMENUS */
          .sub-menu .sub-dropdown .sub-menu {
            margin-left: 15px !important;
            width: calc(100% - 15px) !important;
          }
        }
      `;
    }
  }

  // FUNCTION TO HIGHLIGHT ACTIVE MENU ITEM BASED ON CURRENT URL
  function setActiveMenuItem() {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const menuLinks = document.querySelectorAll('.menu a');
      
      menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
          link.classList.add('active');
          
          // HIGHLIGHT PARENT DROPDOWN CONTAINERS
          const parentDropdown = link.closest('.dropdown');
          if (parentDropdown) {
            const parentLink = parentDropdown.querySelector('> a');
            if (parentLink) {
              parentLink.classList.add('active');
            }
          }
          
          // HIGHLIGHT PARENT SUB-DROPDOWN CONTAINERS
          const parentSubDropdown = link.closest('.sub-dropdown');
          if (parentSubDropdown) {
            const parentSubLink = parentSubDropdown.querySelector('> a');
            if (parentSubLink) {
              parentSubLink.classList.add('active');
            }
            
            const mainDropdown = parentSubDropdown.closest('.dropdown');
            if (mainDropdown) {
              const mainDropdownLink = mainDropdown.querySelector('> a');
              if (mainDropdownLink) {
                mainDropdownLink.classList.add('active');
              }
            }
          }
        }
      });
    }, 200);
  }

  
  // PUBLIC API - MAIN INITIALIZATION FUNCTION
  return {
    init: async function () {
      try {
        // LOAD HEADER AND FOOTER TEMPLATES IN PARALLEL
        await Promise.all([
          loadTemplate(config.headerUrl, 'site-header'),
          loadTemplate(config.footerUrl, 'site-footer')
        ]);
        
        // INITIALIZE ALL FEATURES AFTER TEMPLATES ARE LOADED
        setTimeout(() => {
          initScrollBehavior();    // HANDLES HEADER SCROLL ANIMATIONS
          initMobileMenu();        // HANDLES MOBILE RESPONSIVE MENU
          initGoToTopButton();     // DELETE THIS LINE TO REMOVE GO TO TOP BUTTON
          setActiveMenuItem();     // HIGHLIGHTS CURRENT PAGE IN NAVIGATION
        }, 100);
        
        console.log('Site components initialized successfully');
      } catch (error) {
        console.error('Failed to initialize site components:', error);
      }
    }
  };

})();

// INITIALIZE SITE COMPONENTS WHEN DOM IS READY
document.addEventListener('DOMContentLoaded', () => {
  SiteComponents.init();
});

// ============================================
// ARTICLE IMAGE EXPAND/COLLAPSE FUNCTIONALITY
// ============================================
document.querySelectorAll('.ec-article-image').forEach(function(box) {
  box.addEventListener('click', function() {
    box.classList.toggle('expanded');
  });
});

// ============================================
// MODAL POPUP FOR IMAGE CLICKS
// ============================================
function openModal(imageSrc) {
    var modal = document.getElementById("myModal");
    var img = document.getElementById("popupImg");

    img.src = imageSrc;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// ============================================
// TABLE OF CONTENTS (TOC) EXPAND/COLLAPSE FUNCTIONALITY
// ============================================
function toggleTOC() {
  const body = document.getElementById('toc-body');
  const btn = document.getElementById('toc-btn');
  body.classList.toggle('collapsed');
  btn.textContent = body.classList.contains('collapsed') ? 'Expand ▼' : 'Collapse ▲';
}

// SMOOTH SCROLL FOR TOC LINKS
document.querySelectorAll('.toc-list a').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// HIGHLIGHT ACTIVE SECTION IN TOC USING INTERSECTION OBSERVER
const sections = document.querySelectorAll('section[id]');
const tocLinks = document.querySelectorAll('.toc-list a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tocLinks.forEach(l => l.style.fontWeight = '');
      const active = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
      if (active) active.style.fontWeight = '700';
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => observer.observe(s));

// ============================================
// BACK TO TOP BUTTON CODE - DELETE THIS ENTIRE SECTION TO REMOVE THE BUTTON
// ============================================
function initBackToTop() {
    // Check if button already exists
    if (document.querySelector('.back-to-top')) return;
    
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', initBackToTop);
