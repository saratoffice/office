// Dropdown functionality for both desktop and mobile
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  }
  
  // Handle dropdown clicks
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a:first-child');
    
    if (link) {
      link.addEventListener('click', function(e) {
        // Check if we're on mobile
        if (window.innerWidth <= 900) {
          e.preventDefault(); // Prevent navigation on mobile
          
          // Close other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('open');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('open');
        } else {
          // On desktop, we want hover behavior
          // But if the link has a URL, let it navigate
          // If it's just a placeholder (#), prevent navigation
          if (link.getAttribute('href') === '#') {
            e.preventDefault();
          }
          
          // For desktop, we can also support click as an alternative to hover
          // Toggle open class for click support
          dropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('open');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('open');
          
          // Close dropdown when clicking outside
          setTimeout(() => {
            document.addEventListener('click', function closeDropdown(evt) {
              if (!dropdown.contains(evt.target)) {
                dropdown.classList.remove('open');
                document.removeEventListener('click', closeDropdown);
              }
            });
          }, 100);
        }
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
      // On mobile, don't close if clicking inside menu
      if (menu && menu.contains(e.target)) {
        return;
      }
      
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
      });
      
      if (menu) {
        menu.classList.remove('open');
      }
    } else {
      // On desktop, handle click outside for open dropdowns
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      // Switch to desktop mode
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
      });
      if (menu) {
        menu.classList.remove('open');
      }
    }
  });
});
