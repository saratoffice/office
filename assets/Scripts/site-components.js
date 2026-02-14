// SIMPLEST POSSIBLE VERSION
(function() {
  console.log('🚀 Simple menu loader starting...');
  
  // Load header
  fetch('header.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('site-header').innerHTML = html;
    });
  
  // Load footer
  fetch('footer.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('site-footer').innerHTML = html;
    });
  
  // Load nav and setup menu
  fetch('nav.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('main-nav').innerHTML = html;
      
      // Setup menu after nav loads
      setTimeout(setupMenu, 200);
    });
  
  // Simple menu setup
  function setupMenu() {
    console.log('Setting up menu...');
    
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.menu');
    
    if (toggle && menu) {
      // Remove old handler
      var newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      // Add click handler
      newToggle.onclick = function(e) {
        e.preventDefault();
        if (menu.style.display === 'flex') {
          menu.style.display = 'none';
          this.innerHTML = '☰';
        } else {
          menu.style.display = 'flex';
          this.innerHTML = '✕';
        }
      };
      
      // Dropdowns
      document.querySelectorAll('.dropdown > a').forEach(function(link) {
        var newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.onclick = function(e) {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            var submenu = this.nextElementSibling;
            if (submenu) {
              if (submenu.style.display === 'block') {
                submenu.style.display = 'none';
              } else {
                submenu.style.display = 'block';
              }
            }
          }
        };
      });
      
      console.log('✅ Menu setup complete');
    } else {
      console.log('❌ Menu elements not found, retrying...');
      setTimeout(setupMenu, 300);
    }
  }
})();
