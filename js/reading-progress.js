// Reading-progress bar — fills as the visitor scrolls through the case study.
// Shown at every screen size, anchored to the header's bottom edge (see .reading-progress
// in case-study.css). No per-page setup needed: it just needs a .reading-progress-fill
// element on the page.
(function () {
  var fill = document.querySelector('.reading-progress-fill');
  if (!fill) return;

  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop || 0;
    var scrollHeight = doc.scrollHeight - doc.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    pct = Math.min(100, Math.max(0, pct));
    fill.style.width = pct + '%';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
