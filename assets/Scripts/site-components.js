const SiteComponents = (function () {

  const config = {
    headerUrl: './header.html',
    footerUrl: './footer.html'
  };

  async function loadTemplate(url, elementId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.status);

      const html = await response.text();
      const element = document.getElementById(elementId);

      if (element) {
        element.innerHTML = html;
      }

    } catch (error) {
      console.error("Load error:", error);
    }
  }

  function initMobileMenu() {
    document.addEventListener("click", function (e) {

      if (e.target.classList.contains("menu-toggle")) {
        document.querySelector(".menu")?.classList.toggle("open");
      }

      const dropdownLink = e.target.closest(".dropdown > a");
      if (dropdownLink && window.innerWidth <= 900) {
        e.preventDefault();
        dropdownLink.parentElement.classList.toggle("open");
      }

    });
  }

  return {
    init: async function () {
      await Promise.all([
        loadTemplate(config.headerUrl, 'site-header'),
        loadTemplate(config.footerUrl, 'site-footer')
      ]);
      initMobileMenu();
    }
  };

})();

document.addEventListener('DOMContentLoaded', () => {
  SiteComponents.init();
});
