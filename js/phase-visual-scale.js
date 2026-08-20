// Shrinks .phase-visual mockups that are intrinsically wider than their column
// (hand-built UI mockups with fixed-width sidebars/tables that don't otherwise
// reflow) so they scale down to fit instead of forcing the whole page to scroll
// horizontally. No-ops on any visual that already fits (e.g. real <img> based
// visuals, or any visual once the viewport is wide enough).
(function () {
  function wrapOnce(visual) {
    if (visual.dataset.scaleWrapped) return visual.querySelector('.phase-visual-scale-inner');
    var inner = document.createElement('div');
    inner.className = 'phase-visual-scale-inner';
    while (visual.firstChild) inner.appendChild(visual.firstChild);
    visual.appendChild(inner);
    visual.dataset.scaleWrapped = 'true';
    return inner;
  }

  function scaleVisual(visual) {
    var inner = wrapOnce(visual);

    // Reset, then size `inner` to its true natural (max-content) width. Plain
    // width:auto block children just fill whatever's available, which would
    // under-report the natural width once .phase-visual is itself correctly
    // constrained to the column's width (they'd measure as already "fitting").
    // max-content makes every descendant size to its own preferred width
    // instead, so mockups with a fixed-width sidebar next to a data table (that
    // would otherwise silently clip via a nested overflow:hidden rounded-corner
    // wrapper) report their real, wider, preferred size here.
    inner.style.transform = 'none';
    visual.style.height = '';
    inner.style.width = 'max-content';

    var naturalWidth = inner.scrollWidth;
    var naturalHeight = inner.scrollHeight;
    var available = visual.clientWidth;

    if (available > 0 && naturalWidth > available) {
      var scale = available / naturalWidth;
      inner.style.transform = 'scale(' + scale + ')';
      visual.style.height = Math.ceil(naturalHeight * scale) + 'px';
    } else {
      inner.style.width = '';
    }
  }

  function scaleAll() {
    document.querySelectorAll('.phase-visual').forEach(scaleVisual);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(scaleAll, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scaleAll);
  } else {
    scaleAll();
  }
  // Re-run after images/webfonts finish loading, since natural width can shift.
  window.addEventListener('load', scaleAll);
})();
