/* ── Back to top button ── */
  window.addEventListener('scroll', function () {
    var btn = document.getElementById('btt');
    if (btn) {
      if (window.scrollY > 300) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
  });
