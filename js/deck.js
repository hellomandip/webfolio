/* Case study → slide deck. Runs only with ?deck=1 (the homepage opens case studies this way).
   Each top-level section becomes a slide; the long "phases" list is split one phase per slide.
   ←/→ (or Space), the arrow buttons, the dots, or a swipe move between slides. Esc asks the
   parent page to close the deck. */
(function () {
  if (!/[?&]deck=1/.test(location.search)) return;
  var html = document.documentElement;

  function build() {
    var secs = Array.prototype.filter.call(document.body.children, function (el) {
      return el.tagName === 'SECTION' &&
             !el.classList.contains('bottom-nav-section') &&
             !el.classList.contains('contact-section');
    });
    var archive = /\/(kinetic|nascent|grocers-plus)\.html/.test(location.pathname);
    var chero = /\/course-hero-v2\.html/.test(location.pathname);
    var shop = /\/shopify-marketing\.html/.test(location.pathname);
    // Shopify uses Course Hero's deck type and layout (deck-navy rules), recoloured green (deck-green, css/deck.css)
    if (shop) html.classList.add('deck-navy', 'deck-green');
    var heroSec = secs.filter(function (el) { return el.classList.contains('cs-hero'); })[0];
    var heroInfo = null;
    // ?project=<id>: show just that project (e.g. one client from a multi-project page)
    var only = (location.search.match(/[?&]project=([\w-]+)/) || [])[1];
    if (only) {
      var target = document.getElementById(only);
      var host = target && target.closest('section');
      if (host && secs.indexOf(host) > -1) {
        Array.prototype.slice.call(host.querySelectorAll('.project-block')).forEach(function (blk) { if (blk !== target) blk.remove(); });
        heroInfo = {
          title: text(target.querySelector('.project-title')),
          desc: text(target.querySelector('.project-body')),
          img: target.getAttribute('data-hero')
        };
      }
    }

    function bgOf(sec) { return sec.classList.contains('section-grey') ? 'section-grey' : 'section-white'; }
    function wrap(bg, extra, kicker, nodes) {
      var s = document.createElement('section');
      s.className = bg + ' ' + extra;
      var inner = document.createElement('div');
      inner.className = 'section-inner';
      if (kicker) {
        var k = document.createElement('p');
        k.className = 'deck-kicker';
        k.textContent = kicker;
        inner.appendChild(k);
      }
      nodes.forEach(function (n) { inner.appendChild(n); });
      s.appendChild(inner);
      return s;
    }
    function text(el) { return el ? el.textContent.trim() : ''; }

    // Course Hero: hero · Context · Solution · Features (6) · Outcome · Prototype · Role/Impact/Reflection
    if (chero) {
      document.documentElement.classList.add('deck-navy');
      var byId = function (id) { return document.getElementById(id); };
      var ctxSec = byId('context'), patSec = byId('patterns'), outSec = byId('outcome'), trySec = byId('try');
      var impSec = byId('decisions-impact'), refSec = byId('reflection');
      ['ai-native', 'decisions'].forEach(function (id) { var e = byId(id); if (e) e.remove(); });
      var valSec = byId('validation'), solSec = byId('solution');
      (function () {
        var h2 = solSec.querySelector('.cs-section-title'), ph = solSec.querySelector('.phase-header');
        if (h2 && ph) { h2.classList.add('deck-in-copy'); ph.insertBefore(h2, ph.firstChild); }
      })();
      solSec.after(patSec);   // features follow the solution, ahead of Outcome
      // deck-only copy: shorter feature titles, and the generation feature is left out of the deck
      Array.prototype.slice.call(patSec.querySelectorAll('.phase')).forEach(function (ph) {
        var t = text(ph.querySelector('.phase-title'));
        if (t.indexOf('Make generation visible') === 0) { ph.remove(); return; }
        var rename = [['blank prompt', 'Start from a course'], ['sources, and let', 'Show sources'],
                      ['Measure readiness', 'Measure readiness'], ['suggest the next step', 'Know what to do next']];
        rename.forEach(function (r) {
          if (t.indexOf(r[0]) > -1) ph.querySelector('.phase-title').textContent = r[1];
        });
      });
      [impSec, refSec].forEach(function (sec) { if (sec) sec.remove(); });   // role / impact / reflection are not in the deck
      secs = [heroSec, ctxSec, valSec, solSec, patSec, outSec, trySec];
    }

    // archive pages: a structured hero slide (title, facts, description, image)
    if ((archive || chero || shop) && heroSec) {
      var metaEl = heroSec.querySelector('.cs-meta');
      var mt = metaEl ? metaEl.textContent.replace(/\s+/g, ' ').trim() : '';
      var mm = mt.match(/^(.*?)\s*\|\s*(.*?)\s*\((.*?)\)\s*·\s*(.*)$/) || [];
      var logoEl = metaEl && metaEl.querySelector('img');
      var imgEl = heroSec.querySelector('.cs-hero-image');
      var facts = [
        ['Company', (logoEl ? '<img src="' + logoEl.getAttribute('src') + '" width="18" height="18" alt="">' : '') + '<span>' + (mm[2] || '') + '</span>'],
        ['Timeline', '<span>' + (mm[3] || '') + '</span>'],
        ['Role', '<span>' + (mm[4] || '') + '</span>']
      ].filter(function (f) { return /<span>[^<]/.test(f[1]); });
      var inner = document.createElement('div');
      inner.className = 'cs-hero-inner deck-hero';
      var h = document.createElement('h1');
      h.className = 'fraunces cs-title';
      h.textContent = (heroInfo && heroInfo.title) || text(heroSec.querySelector('.cs-title'));
      if (shop) {
        // Shopify's title takes the same gold primary treatment as Course Hero's
        var sp = document.createElement('span'); sp.className = 'deck-title-primary'; sp.textContent = h.textContent;
        h.textContent = ''; h.appendChild(sp);
      }
      if (chero) {
        var full = h.textContent, ix = full.indexOf(':');
        if (ix > 0) {
          h.textContent = '';
          var ta = document.createElement('span'); ta.className = 'deck-title-primary'; ta.textContent = full.slice(0, ix).trim();
          var tb = document.createElement('span'); tb.className = 'deck-title-secondary'; tb.textContent = full.slice(ix + 1).trim();
          h.appendChild(ta); h.appendChild(tb);
        }
      }
      // same one-line meta as the other case studies: logo Company (years) · Role
      var dl = metaEl ? metaEl.cloneNode(true) : document.createElement('p');
      dl.className = 'cs-meta';
      var d = document.createElement('p');
      d.className = 'cs-subtitle';
      d.textContent = (heroInfo && heroInfo.desc) || text(heroSec.querySelector('.cs-subtitle'));
      var frame = document.createElement('div');
      var srcFrame = heroSec.querySelector('.cs-hero-image-frame');
      if (chero && srcFrame) {
        frame = srcFrame.cloneNode(true);                     // keeps the looping hero video
      } else {
        frame.className = 'cs-hero-image-frame';
        if (shop) frame.classList.add('deck-fill');
        var im = document.createElement('img');
        im.className = 'cs-hero-image';
        im.src = (heroInfo && heroInfo.img) || (imgEl && imgEl.getAttribute('src')) || '';
        im.alt = '';
        im.onerror = function () { frame.style.display = 'none'; };
        frame.appendChild(im);
      }
      if (chero || shop) {
        // text on the left, the hero image (or loop) on the right
        var txt = document.createElement('div');
        txt.className = 'deck-hero-text';
        [h, dl, d].forEach(function (n) { txt.appendChild(n); });
        inner.classList.add('deck-hero-split');
        inner.appendChild(txt); inner.appendChild(frame);
      } else {
        [h, dl, d, frame].forEach(function (n) { inner.appendChild(n); });
      }
      heroSec.innerHTML = '';
      heroSec.appendChild(inner);
    }

    // Shopify: its own slide order, built from the page's sections. The page itself is unchanged.
    function shopBases() {
      var byId = function (id) { return document.getElementById(id); };
      var ctx = byId('context'), ins = byId('key-insights'), how = byId('how-built');
      var out = [], fresh = [];
      function add(node) { out.push(node); fresh.push(node); return node; }
      out.push(heroSec);

      // slide 2 and 3: the page's own sections, retitled for the deck
      ctx.querySelector('.cs-section-title').textContent = 'Problem';
      ins.querySelector('.cs-section-title').textContent = 'What we uncovered';
      // deck-only: drop the third insight and move the fifth up under the second
      var insItems = ins.querySelectorAll('.insight-item');
      if (insItems.length === 5) {
        var insList = insItems[0].parentNode, fifth = insItems[4];
        insItems[2].remove();
        insList.insertBefore(fifth, insItems[1].nextSibling);
      }
      out.push(ctx, ins);

      // slide 4: the solution as a text list of the seven phases (not the timeline visual)
      var PHASES = [
        ['Ad Integrations', 'Connect Google and Facebook ad accounts inside the Shopify admin.'],
        ['Shopify Email', 'Build email natively, tied to the commerce data merchants already have.'],
        ['Campaigns', 'Group ads, email and discounts under one goal, with one view of results.'],
        ['Templates', 'Turn the playbooks our best merchants ran by hand into a starting point for everyone.'],
        ['Automations', 'Triggered flows like abandoned cart and win-back that run without re-launching.'],
        ['Campaign Reports', 'Goals versus actuals, a channel breakdown and performance over time.'],
        ['Unified Marketing View', 'Every campaign, Shopify or external, in one table with a single attribution model.']
      ];
      var sol = document.createElement('h2');
      sol.className = 'fraunces cs-section-title';
      sol.textContent = 'Solutions: What we built out over time';
      var list = document.createElement('ol');
      list.className = 'deck-phase-list';
      PHASES.forEach(function (p, i) {
        var li = document.createElement('li');
        li.innerHTML = '<div><p class="deck-phase-name"><span class="deck-phase-n">' + String(i + 1).padStart(2, '0') + '</span>' + p[0] + '</p><p class="deck-phase-desc">' + p[1] + '</p></div>';
        list.appendChild(li);
      });
      add(wrap('section-white', 'deck-sub', '', [sol, list]));

      // slides 5 onward: each phase on its own slide, with "The next challenge" between the groups
      var phases = Array.prototype.slice.call(how.querySelectorAll('.phase'));
      var trans = Array.prototype.slice.call(how.querySelectorAll('.phase-transition'));
      phases.forEach(function (ph, i) {
        var holder = document.createElement('div');
        holder.className = 'phases-list';
        holder.appendChild(ph);
        add(wrap('section-white', 'deck-sub', '', [holder]));
        if (i === 1 || i === 4) {
          var tr = trans[i === 1 ? 0 : 1];
          var h = document.createElement('h2');
          h.className = 'fraunces cs-section-title';
          h.textContent = 'The next challenge';
          var body = document.createElement('div');
          body.className = 'deck-transition';
          var t = tr && tr.querySelector('.phase-transition-text');
          if (t) body.appendChild(t);
          add(wrap('section-white', 'deck-sub deck-challenge', '', [h, body]));
        }
      });

      // last slide: the outcome, the proof behind it, and how it was measured
      var stats = document.createElement('div');
      stats.className = 'deck-stats';
      stats.innerHTML =
        '<div class="deck-stat"><p class="fraunces deck-stat-num">150%</p><p class="deck-stat-label">year-over-year growth in Marketing Tab sessions</p></div>' +
        '<div class="deck-stat"><p class="fraunces deck-stat-num">52%</p><p class="deck-stat-label">increase in sales attributed to marketing activity</p></div>';
      var rows = document.createElement('div');
      rows.innerHTML =
        '<div class="deck-outcome-row"><p class="deck-outcome-k">How it was measured</p><p class="deck-outcome-v">Sales attributed to marketing activity, using the one universal attribution model behind the Unified Marketing view, with its data source shown next to the numbers.</p></div>' +
        '<div class="deck-outcome-row"><p class="deck-outcome-k">Over</p><p class="deck-outcome-v">Six years on the Marketing Tab, 2017–2023. Sessions are compared year over year.</p></div>';
      var outroTitle = document.createElement('h2');
      outroTitle.className = 'fraunces cs-section-title';
      outroTitle.textContent = 'Outcome';
      add(wrap('section-white', 'deck-sub', '', [outroTitle, stats, rows]));

      // the new slides live at the end of body; the old role, impact and reflection sections go
      fresh.forEach(function (s) { document.body.appendChild(s); });
      how.remove();
      ['decisions-impact', 'reflection'].forEach(function (id) { var e = byId(id); if (e) e.remove(); });
      return out;
    }

    // 1 · sections → base slides (phases and project blocks get a slide each)
    var bases = shop ? shopBases() : [];
    (shop ? [] : secs).forEach(function (sec) {
      var bg = bgOf(sec);
      var phases = sec.querySelector('.phases-list');
      var projects = sec.querySelector('.project-list');
      if (phases) {
        if (!chero) bases.push(sec);
        var title = text(sec.querySelector('.cs-section-title'));
        var after = sec;
        Array.prototype.slice.call(phases.children).forEach(function (kid) {
          var holder = document.createElement('div');
          holder.className = 'phases-list';
          holder.appendChild(kid);
          var s = wrap(bg, 'deck-sub', chero ? '' : title, [holder]);
          after.after(s); after = s; bases.push(s);
        });
        phases.remove();
        if (chero) sec.remove();   // the six features are slides 4–9; no separate intro slide
      } else if (projects) {
        var after2 = sec;
        Array.prototype.slice.call(projects.children).forEach(function (block) {
          var holder = document.createElement('div');
          holder.className = 'project-list';
          holder.appendChild(block);
          var s = wrap(bg, 'deck-sub', '', [holder]);
          after2.after(s); after2 = s; bases.push(s);
        });
        sec.remove();
      } else {
        bases.push(sec);
      }
    });

    // 2 · each screenshot in an image group gets its own slide, right after its section
    var slides = [];
    bases.forEach(function (base) {
      var bg = bgOf(base);
      var groups = Array.prototype.slice.call(base.querySelectorAll('.inline-image-group'));
      var skipBase = archive && groups.length && !base.classList.contains('cs-hero');
      if (!skipBase) slides.push(base);
      var after = base;
      groups.forEach(function (g) {
        var shots = Array.prototype.slice.call(g.querySelectorAll(':scope > .flow-shot'));
        if (shots.length < 2) return;
        var kicker = archive ? '' : [text(base.querySelector('.project-title')) || text(base.querySelector('.cs-section-title')),
                      text(base.querySelector('.project-label'))].filter(Boolean).join(' · ');
        shots.forEach(function (shot) {
          var s = wrap(bg, 'deck-sub deck-shot', kicker, [shot]);
          after.after(s); after = s; slides.push(s);
        });
        g.remove();
      });
      if (skipBase) base.remove();
    });

    slides.forEach(function (s) { s.classList.add('deck-slide'); });

    // click a screenshot to zoom in on it; drag (or scroll) to look around; click again to zoom out
    var ZOOM = 2.6, zoomed = null;
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function applyZoom(z) {
      var w = z.box.clientWidth, hgt = z.box.clientHeight;
      z.tx = clamp(z.tx, w * (1 - ZOOM), 0); z.ty = clamp(z.ty, hgt * (1 - ZOOM), 0);
      z.img.style.transform = 'translate(' + z.tx + 'px,' + z.ty + 'px) scale(' + ZOOM + ')';
    }
    function zoomOut() {
      if (!zoomed) return;
      var z = zoomed; zoomed = null;
      z.box.classList.remove('is-zoomed'); z.img.style.transform = '';
    }
    // Course Hero and Shopify: their gallery images zoom in place too (no full-screen viewer)
    var zoomGalleries = chero || shop;
    var zoomSel = '.deck-slide .flow-shot > .inline-image' + (zoomGalleries ? ', .deck-slide [data-lightbox-group] img' : '');
    document.querySelectorAll(zoomSel).forEach(function (img) {
      if (img.closest('.deck-zoom')) return;
      var box = document.createElement('div');
      box.className = 'deck-zoom';
      img.parentNode.insertBefore(box, img); box.appendChild(img);
      var drag = null;
      box.addEventListener('pointerdown', function (e) {
        if (!zoomed || zoomed.box !== box) return;
        drag = { x: e.clientX, y: e.clientY, tx: zoomed.tx, ty: zoomed.ty, moved: false };
        box.setPointerCapture(e.pointerId);
      });
      box.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
        zoomed.tx = drag.tx + dx; zoomed.ty = drag.ty + dy; applyZoom(zoomed);
      });
      box.addEventListener('pointerup', function () { setTimeout(function () { drag = null; }, 0); });
      box.addEventListener('click', function (e) {
        e.stopPropagation();
        if (drag && drag.moved) return;
        if (zoomed && zoomed.box === box) { zoomOut(); return; }
        zoomOut();
        var r = box.getBoundingClientRect(), cx = e.clientX - r.left, cy = e.clientY - r.top;
        zoomed = { box: box, img: img, tx: cx * (1 - ZOOM), ty: cy * (1 - ZOOM) };
        box.classList.add('is-zoomed');
        applyZoom(zoomed);
      });
    });
    // keep the full-screen lightbox out of the deck (the images zoom in place instead)
    var lightboxSel = '.deck-slide .flow-shot' + (zoomGalleries ? ', .deck-slide [data-lightbox-group]' : '');
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest(lightboxSel) && !e.target.closest('.deck-zoom')) e.stopImmediatePropagation();
    }, true);
    var n = slides.length, cur = -1;

    var prev = document.createElement('button');
    prev.className = 'deck-arrow deck-prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous slide');
    prev.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var next = document.createElement('button');
    next.className = 'deck-arrow deck-next'; next.type = 'button'; next.setAttribute('aria-label', 'Next slide');
    next.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var bar = document.createElement('div');
    bar.className = 'deck-bar';
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'deck-dots';
    var count = document.createElement('span');
    count.className = 'deck-count'; count.setAttribute('aria-live', 'polite');
    var dots = slides.map(function (s, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'deck-dot'; d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(d);
      return d;
    });
    bar.appendChild(dotsWrap); bar.appendChild(count);
    document.body.appendChild(prev); document.body.appendChild(next); document.body.appendChild(bar);

    function go(i) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === cur) return;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        s.classList.toggle('is-past', k < i);
        s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        if ('inert' in s) s.inert = k !== i;
      });
      zoomOut();
      slides[i].scrollTop = 0;
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      count.textContent = (i + 1) + ' / ' + n;
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
      cur = i;
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.see-it');
      if (!b) return;
      var idx = slides.indexOf(document.getElementById('try'));
      if (idx > -1) go(idx);
    }, true);
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });

    function key(k, shift) {
      if (document.querySelector('.lightbox-overlay.open')) return false;   // the image viewer owns the keys
      if (k === 'ArrowRight' || (k === ' ' && !shift) || k === 'PageDown') { go(cur + 1); return true; }
      if (k === 'ArrowLeft'  || (k === ' ' && shift)  || k === 'PageUp')   { go(cur - 1); return true; }
      if (k === 'Home') { go(0); return true; }
      if (k === 'End')  { go(n - 1); return true; }
      if (k === 'Escape' && zoomed) { zoomOut(); return true; }
      if (k === 'Escape' && window.parent !== window) { window.parent.postMessage({ deck: 'close' }, '*'); return true; }
      return false;
    }
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target && e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA') return;
      if (key(e.key, e.shiftKey)) e.preventDefault();
    });

    // wheel / trackpad: scrolling moves between slides — unless the slide itself still has
    // content to scroll in that direction. One slide per gesture (inertia is ignored).
    var lockUntil = 0, lastWheel = 0;
    document.addEventListener('wheel', function (e) {
      if (e.ctrlKey || document.querySelector('.lightbox-overlay.open')) return;
      var now = Date.now(), gap = now - lastWheel;
      lastWheel = now;
      var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      var dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
      var d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(d) < 4) return;
      if (zoomed) { e.preventDefault(); zoomed.tx -= dx; zoomed.ty -= dy; applyZoom(zoomed); return; }   // look around the zoomed image
      var el = slides[cur];
      if (Math.abs(dy) >= Math.abs(dx) && el.scrollHeight > el.clientHeight + 2) {
        if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return;   // more to read below
        if (dy < 0 && el.scrollTop > 2) return;                                         // more to read above
      }
      e.preventDefault();
      if (now < lockUntil) { lockUntil = Math.max(lockUntil, gap < 120 ? now + 250 : lockUntil); return; }   // still the same gesture
      lockUntil = now + 750;
      go(cur + (d > 0 ? 1 : -1));
    }, { passive: false });

    // swipe
    var sx = null, sy = null;
    document.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    go(0);
    window.dispatchEvent(new Event('resize'));   // let page scripts (e.g. the prototype scaler) re-fit to slide sizes
    html.classList.add('deck-ready');
    if (window.parent !== window) window.parent.postMessage({ deck: 'ready' }, '*');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
