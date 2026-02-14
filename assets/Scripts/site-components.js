// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    /* Load Header */
    fetch('header.html')
        .then(res => {
            if (!res.ok) throw new Error('Header failed to load');
            return res.text();
        })
        .then(html => {
            document.getElementById('site-header').innerHTML = html;
            // After header is loaded, load navigation inside it
            return fetch('nav.html');
        })
        .then(res => {
            if (!res.ok) throw new Error('Navigation failed to load');
            return res.text();
        })
        .then(nav => {
            document.getElementById('main-nav').innerHTML = nav;
            // Attach mobile menu listeners after all content is loaded
            initMobileMenu();
        })
        .catch(error => console.error('Error loading header/nav:', error));

    /* Load Footer */
    fetch('footer.html')
        .then(res => {
            if (!res.ok) throw new Error('Footer failed to load');
            return res.text();
        })
        .then(footer => {
            document.getElementById('site-footer').innerHTML = footer;
        })
        .catch(error => console.error('Error loading footer:', error));

});

// Mobile menu functionality
function initMobileMenu() {
    // Get the menu toggle button
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        // Remove any existing listeners to prevent duplicates
        menuToggle.removeEventListener('click', toggleMenu);
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Dropdown functionality for mobile
    setupMobileDropdowns();
}

function toggleMenu(e) {
    e.preventDefault();
    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menu) {
        menu.classList.toggle('open');
        // Toggle aria-expanded for accessibility
        if (menuToggle) {
            const isExpanded = menu.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        }
    }
}

function setupMobileDropdowns() {
    // Remove existing listeners first
    document.removeEventListener('click', handleDropdownClick);
    document.addEventListener('click', handleDropdownClick);
}

function handleDropdownClick(e) {
    const dropdownLink = e.target.closest('.dropdown > a');
    
    if (dropdownLink && window.innerWidth <= 900) {
        e.preventDefault();
        const dropdown = dropdownLink.parentElement;
        dropdown.classList.toggle('open');
        
        // Close other open dropdowns (optional)
        if (dropdown.classList.contains('open')) {
            const otherOpenDropdowns = document.querySelectorAll('.dropdown.open');
            otherOpenDropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                }
            });
        }
    }
}

// Also handle window resize to reset mobile menu if needed
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reset mobile menu states when crossing mobile/desktop breakpoint
        if (window.innerWidth > 900) {
            const openMenus = document.querySelectorAll('.menu.open, .dropdown.open');
            openMenus.forEach(menu => menu.classList.remove('open'));
        }
    }, 250);
});
