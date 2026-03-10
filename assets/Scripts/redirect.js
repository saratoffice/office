/**
 * redirect.js
 * Handles redirection from custom calendar links to actual Google Drive download URLs
 * Place this file in assets/Scripts/redirect.js
 */

(function() {
    'use strict';

    // Function to handle link redirection
    function handleLinkClick(e) {
        // Find the closest anchor element that was clicked
        const link = e.target.closest('a');
        if (!link) return;

        // Get the Google Drive URL from data attribute
        const driveUrl = link.getAttribute('data-drive');
        if (!driveUrl) return; // Not a calendar link

        // Prevent default navigation to the fake href
        e.preventDefault();

        // Log for debugging (can be removed in production)
        console.log('Redirecting to:', driveUrl);

        // Redirect to the actual Google Drive download link
        window.location.href = driveUrl;
    }

    // Function to handle middle-click and Ctrl+click for new tabs
    function handleMouseDown(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const driveUrl = link.getAttribute('data-drive');
        if (!driveUrl) return;

        // Check for middle click (button === 1) or Ctrl/Cmd click
        const isMiddleClick = e.button === 1;
        const isCtrlCmdClick = e.ctrlKey || e.metaKey;

        if (isMiddleClick || isCtrlCmdClick) {
            // Prevent default behavior
            e.preventDefault();

            // Open in new tab/window
            window.open(driveUrl, '_blank');
            
            // Prevent further event handling
            return false;
        }
    }

    // Function to handle keyboard activation (Enter key)
    function handleKeyDown(e) {
        // Check if the focused element is our calendar link
        const link = e.target.closest('a');
        if (!link) return;

        const driveUrl = link.getAttribute('data-drive');
        if (!driveUrl) return;

        // Check if Enter key was pressed
        if (e.key === 'Enter') {
            e.preventDefault();
            window.location.href = driveUrl;
        }
    }

    // Initialize the redirection handler when DOM is ready
    function initRedirectHandler() {
        // Remove any existing listeners to prevent duplicates
        document.removeEventListener('click', handleLinkClick);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('keydown', handleKeyDown);

        // Add event listeners
        document.addEventListener('click', handleLinkClick);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);

        console.log('Calendar redirect handler initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRedirectHandler);
    } else {
        // DOM is already loaded
        initRedirectHandler();
    }

    // For frameworks that might dynamically load content,
    // also initialize on page load
    window.addEventListener('load', function() {
        // Re-initialize to catch any dynamically added links
        // (optional, depending on your needs)
    });

})();
