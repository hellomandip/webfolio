/* Cursor-reactive tilt for the "feature spotlight" micro-moment canvas
   (see .feature-spotlight in case-study.css). No dependencies.

   Any element with [data-tilt] becomes a tilt zone; on pointermove it nudges
   two CSS custom properties (--rx-offset / --ry-offset) on the nearest
   [data-tilt-target] descendant, which case-study.css layers on top of the
   canvas's resting isometric angle. On pointerleave (or on touch devices,
   where there's no hover) it settles back to the resting angle. */
(function () {
  function init() {
    var zones = document.querySelectorAll('[data-tilt]');
    if (!zones.length) return;

    var MAX_TILT = 10; // degrees of extra tilt layered on top of the resting angle

    zones.forEach(function (zone) {
      var target = zone.querySelector('[data-tilt-target]');
      if (!target) return;

      function onMove(e) {
        var rect = zone.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;   // 0..1 across the zone
        var py = (e.clientY - rect.top) / rect.height;
        px = Math.min(1, Math.max(0, px));
        py = Math.min(1, Math.max(0, py));
        var ry = (px - 0.5) * 2 * MAX_TILT;
        var rx = (0.5 - py) * 2 * MAX_TILT;
        target.style.setProperty('--rx-offset', rx.toFixed(2) + 'deg');
        target.style.setProperty('--ry-offset', ry.toFixed(2) + 'deg');
      }

      function reset() {
        target.style.setProperty('--rx-offset', '0deg');
        target.style.setProperty('--ry-offset', '0deg');
      }

      zone.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return; // don't fight page scroll on touch
        onMove(e);
      });
      zone.addEventListener('pointerleave', reset);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
