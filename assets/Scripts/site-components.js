// Add this to your setupMobileMenu function
function setupBetterDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    let timeout;
    
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      dropdown.classList.add('hover');
    });
    
    dropdown.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        dropdown.classList.remove('hover');
      }, 300); // 300ms delay before hiding
    });
    
    // Also keep open if mouse is on the menu
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      menu.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        dropdown.classList.add('hover');
      });
      
      menu.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          dropdown.classList.remove('hover');
        }, 300);
      });
    }
  });
}

// Call this after menu is loaded
setupBetterDropdowns();
