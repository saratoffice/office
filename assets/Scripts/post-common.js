// ============================================
// COMMON BLOG POST FUNCTIONS - For all blog posts
// Link this file in any new post:
// <script src="../assets/Scripts/post-common.js" defer></script>
// ============================================

const PostCommon = (function() {
  
  // ============================================
  // SHARE BUTTON FUNCTIONALITY
  // ============================================
  function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        let shareUrl = '';
        
        if (btn.classList.contains('facebook')) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        } else if (btn.classList.contains('twitter')) {
          shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
        } else if (btn.classList.contains('linkedin')) {
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        } else if (btn.classList.contains('whatsapp')) {
          shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
        } else if (btn.classList.contains('email')) {
          shareUrl = `mailto:?subject=${pageTitle}&body=${pageUrl}`;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // ============================================
  // TABLE OF CONTENTS GENERATOR
  // ============================================
  function generateTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;
    
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    if (headings.length === 0) return;
    
    let tocHTML = '<div class="toc"><h4>📋 Table of Contents</h4><ul>';
    
    headings.forEach((heading, index) => {
      // Add ID to heading if not present
      if (!heading.id) {
        const headingText = heading.textContent.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        heading.id = `heading-${index}-${headingText}`;
      }
      
      const level = heading.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
      tocHTML += `<li class="${level}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
    });
    
    tocHTML += '</ul></div>';
    tocContainer.innerHTML = tocHTML;
    
    // Smooth scroll for TOC links
    document.querySelectorAll('.toc a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // COPY CODE BLOCKS FUNCTIONALITY
  // ============================================
  function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
      // Create wrapper if not exists
      const pre = codeBlock.parentNode;
      if (!pre.classList.contains('code-block-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        wrapper.style.position = 'relative';
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '8px';
        copyBtn.style.right = '8px';
        copyBtn.style.background = '#1e293b';
        copyBtn.style.color = 'white';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '6px';
        copyBtn.style.padding = '4px 12px';
        copyBtn.style.fontSize = '0.8rem';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.zIndex = '10';
        
        // Wrap and insert button
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(copyBtn);
        
        // Copy functionality
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
          } catch (err) {
            copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
          }
        });
      }
    });
  }

  // ============================================
  // IMAGE LIGHTBOX / GALLERY
  // ============================================
  function initImageLightbox() {
    const images = document.querySelectorAll('.post-content img:not(.no-lightbox)');
    
    images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.background = 'rgba(0,0,0,0.9)';
        lightbox.style.zIndex = '10000';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.cursor = 'pointer';
        
        // Create image
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.style.maxWidth = '90%';
        lightboxImg.style.maxHeight = '90%';
        lightboxImg.style.objectFit = 'contain';
        lightboxImg.style.borderRadius = '8px';
        
        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '40px';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '40px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        
        // Create caption
        const caption = document.createElement('div');
        caption.style.position = 'absolute';
        caption.style.bottom = '20px';
        caption.style.left = '0';
        caption.style.right = '0';
        caption.style.textAlign = 'center';
        caption.style.color = 'white';
        caption.style.padding = '10px';
        caption.style.background = 'rgba(0,0,0,0.5)';
        
        const imgAlt = img.alt || 'Enlarged image';
        const imgCaption = img.closest('.grid-item')?.querySelector('.image-caption')?.textContent || imgAlt;
        caption.textContent = imgCaption;
        
        // Navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '❮';
        prevBtn.style.position = 'absolute';
        prevBtn.style.left = '20px';
        prevBtn.style.top = '50%';
        prevBtn.style.transform = 'translateY(-50%)';
        prevBtn.style.background = 'rgba(255,255,255,0.2)';
        prevBtn.style.color = 'white';
        prevBtn.style.border = 'none';
        prevBtn.style.borderRadius = '50%';
        prevBtn.style.width = '50px';
        prevBtn.style.height = '50px';
        prevBtn.style.fontSize = '24px';
        prevBtn.style.cursor = 'pointer';
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '❯';
        nextBtn.style.position = 'absolute';
        nextBtn.style.right = '20px';
        nextBtn.style.top = '50%';
        nextBtn.style.transform = 'translateY(-50%)';
        nextBtn.style.background = 'rgba(255,255,255,0.2)';
        nextBtn.style.color = 'white';
        nextBtn.style.border = 'none';
        nextBtn.style.borderRadius = '50%';
        nextBtn.style.width = '50px';
        nextBtn.style.height = '50px';
        nextBtn.style.fontSize = '24px';
        nextBtn.style.cursor = 'pointer';
        
        // Add all elements
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(caption);
        
        // Add navigation if multiple images
        const allImages = Array.from(document.querySelectorAll('.post-content img:not(.no-lightbox)'));
        if (allImages.length > 1) {
          lightbox.appendChild(prevBtn);
          lightbox.appendChild(nextBtn);
          
          let currentIndex = index;
          
          const updateImage = (newIndex) => {
            if (newIndex >= 0 && newIndex < allImages.length) {
              currentIndex = newIndex;
              lightboxImg.src = allImages[currentIndex].src;
              
              const newAlt = allImages[currentIndex].alt || 'Enlarged image';
              const newCaption = allImages[currentIndex].closest('.grid-item')?.querySelector('.image-caption')?.textContent || newAlt;
              caption.textContent = newCaption;
            }
          };
          
          prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateImage(currentIndex - 1);
          });
          
          nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateImage(currentIndex + 1);
          });
        }
        
        // Close handlers
        closeBtn.addEventListener('click', () => lightbox.remove());
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) lightbox.remove();
        });
        
        document.body.appendChild(lightbox);
      });
    });
  }

  // ============================================
  // READING PROGRESS BAR
  // ============================================
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '30px';
    backToTop.style.right = '30px';
    backToTop.style.width = '50px';
    backToTop.style.height = '50px';
    backToTop.style.borderRadius = '50%';
    backToTop.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    backToTop.style.color = 'white';
    backToTop.style.border = 'none';
    backToTop.style.cursor = 'pointer';
    backToTop.style.fontSize = '20px';
    backToTop.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    backToTop.style.transition = 'all 0.3s ease';
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.zIndex = '999';
    
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

  // ============================================
  // PRINT FRIENDLY VERSION
  // ============================================
  function initPrintButton() {
    const printBtn = document.getElementById('print-post');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // ============================================
  // AUTO UPDATE COPYRIGHT YEAR
  // ============================================
  function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  // ============================================
  // TABLE SORTING (for data tables)
  // ============================================
  function initTableSorting() {
    const sortableTables = document.querySelectorAll('.sortable-table');
    
    sortableTables.forEach(table => {
      const headers = table.querySelectorAll('th');
      
      headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          
          // Toggle sort direction
          const isAscending = header.classList.contains('sort-asc');
          headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
          header.classList.toggle(isAscending ? 'sort-desc' : 'sort-asc');
          
          // Sort rows
          rows.sort((a, b) => {
            const aVal = a.children[index].textContent.trim();
            const bVal = b.children[index].textContent.trim();
            
            // Check if numeric
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return isAscending ? bNum - aNum : aNum - bNum;
            }
            
            // String comparison
            return isAscending 
              ? bVal.localeCompare(aVal)
              : aVal.localeCompare(bVal);
          });
          
          // Reorder DOM
          rows.forEach(row => tbody.appendChild(row));
        });
      });
    });
  }

  // ============================================
  // ZOOMABLE DIAGRAMS
  // ============================================
  function initZoomableDiagrams() {
    const diagrams = document.querySelectorAll('.zoomable-diagram');
    
    diagrams.forEach(diagram => {
      diagram.addEventListener('click', () => {
        diagram.classList.toggle('zoomed');
      });
    });
  }

  // ============================================
  // INITIALIZE ALL FUNCTIONS
  // ============================================
  function init() {
    console.log('🚀 PostCommon initializing...');
    
    initShareButtons();
    generateTableOfContents();
    initCodeCopyButtons();
    initImageLightbox();
    initReadingProgress();
    initBackToTop();
    initPrintButton();
    updateCopyrightYear();
    initTableSorting();
    initZoomableDiagrams();
    
    console.log('✅ PostCommon initialized successfully');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    refresh: function() {
      // Re-initialize components (useful for dynamic content)
      initShareButtons();
      generateTableOfContents();
      initCodeCopyButtons();
      initImageLightbox();
    }
  };

})();
