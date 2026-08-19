/* Lightweight click-to-zoom lightbox for case study work galleries.
   Any element with [data-lightbox-group] becomes a trigger; elements sharing
   the same group value are treated as one set, navigable with prev/next. */
(function () {
  function init() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="lightbox-counter" aria-hidden="true"></div>' +
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous image">' +
        '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button class="lightbox-next" aria-label="Next image">' +
        '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="" />' +
        '<figcaption class="lightbox-caption"></figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('.lightbox-img');
    var captionEl = overlay.querySelector('.lightbox-caption');
    var counterEl = overlay.querySelector('.lightbox-counter');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');

    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-group]'));
    if (!triggers.length) return;

    var groups = {};
    triggers.forEach(function (el) {
      var group = el.getAttribute('data-lightbox-group');
      (groups[group] = groups[group] || []).push(el);
    });

    var currentGroup = null;
    var currentIndex = 0;

    function captionFor(el) {
      return el.getAttribute('data-caption') || (el.querySelector('img') && el.querySelector('img').alt) || '';
    }
    function srcFor(el) {
      return el.getAttribute('data-full') || (el.querySelector('img') && el.querySelector('img').src) || '';
    }

    function show(group, index) {
      var items = groups[group];
      if (!items || !items.length) return;
      currentGroup = group;
      currentIndex = (index + items.length) % items.length;
      var el = items[currentIndex];
      imgEl.src = srcFor(el);
      imgEl.alt = captionFor(el);
      captionEl.textContent = captionFor(el);
      var multi = items.length > 1;
      prevBtn.style.display = multi ? 'flex' : 'none';
      nextBtn.style.display = multi ? 'flex' : 'none';
      counterEl.textContent = (currentIndex + 1) + ' / ' + items.length;
      counterEl.style.display = multi ? 'block' : 'none';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    triggers.forEach(function (el) {
      el.addEventListener('click', function () {
        var group = el.getAttribute('data-lightbox-group');
        show(group, groups[group].indexOf(el));
      });
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    prevBtn.addEventListener('click', function () { show(currentGroup, currentIndex - 1); });
    nextBtn.addEventListener('click', function () { show(currentGroup, currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentGroup, currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentGroup, currentIndex + 1);
    });

    // Swipe left/right to move between images on touch devices.
    var touchStartX = 0, touchStartY = 0, touchTracking = false;
    var SWIPE_THRESHOLD = 40;
    overlay.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      touchTracking = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (!touchTracking) return;
      touchTracking = false;
      var touch = e.changedTouches[0];
      var dx = touch.clientX - touchStartX;
      var dy = touch.clientY - touchStartY;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) show(currentGroup, currentIndex + 1);
      else show(currentGroup, currentIndex - 1);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
