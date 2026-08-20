// Mobile hamburger menu: toggles the header nav between its default
// (desktop, inline) state and a fixed-position dropdown shown on tap,
// styled via .nav-toggle/.nav-open in case-study.css's 640px block.
(function () {
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function isOpen() { return nav.classList.contains('nav-open'); }

  function openMenu() {
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) { closeMenu(); } else { openMenu(); }
  });

  // Close after choosing a link, so the dropdown doesn't linger over the
  // destination section/page.
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Escape closes and returns focus to the toggle button.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  // Tapping/clicking outside the open menu closes it.
  document.addEventListener('click', function (e) {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // If the viewport grows past the mobile breakpoint while open (e.g.
  // rotating a tablet), reset so nav doesn't get stuck mid-transition when
  // the media query stops applying the dropdown styles.
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 640 && isOpen()) closeMenu();
    }, 150);
  });
})();
