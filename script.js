// Basic interactivity: navbar toggle, page-specific navigation highlight, accordion, scroll effects

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');
  const siteHeader = document.querySelector('.site-header');

  // Toggle mobile nav
  if(hamburger){
    hamburger.addEventListener('click', () => {
      navLinksContainer.classList.toggle('show');
    });
  }

  // Highlight current page in navigation
  const currentPage = document.body.getAttribute('data-page');
  if(currentPage){
    document.querySelectorAll('.nav-links a').forEach(link => {
      if(link.getAttribute('href').includes(currentPage + '.html') || (currentPage === 'index' && link.getAttribute('href') === 'index.html')){
        link.classList.add('active');
      }
    });
  }

  // Scroll effect for header
  // Scroll effect for header + detect when header overlaps the footer
  const siteFooter = document.querySelector('.site-footer');

  function updateHeaderState(){
    // scrolled state (shrinks header after small scroll)
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // in-footer state: when the header visually overlaps the footer area
    if(siteHeader && siteFooter){
      const headerRect = siteHeader.getBoundingClientRect();
      const footerRect = siteFooter.getBoundingClientRect();
      // If header bottom is below the footer top (viewport coords), they overlap
      if(headerRect.bottom > footerRect.top){
        siteHeader.classList.add('in-footer');
      } else {
        siteHeader.classList.remove('in-footer');
      }
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState, { passive: true });
  // run once on load to set initial state
  updateHeaderState();

  // Accordion (accessible) - only if accordion exists on page
  const accordionToggles = document.querySelectorAll('.accordion-toggle');
  if(accordionToggles.length > 0){
    accordionToggles.forEach(btn =>{
      btn.setAttribute('aria-expanded','false');
      btn.addEventListener('click', ()=>{
        const panel = btn.nextElementSibling;
        const willOpen = panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(willOpen));
        if(willOpen){
          // set max-height to allow transition
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = null;
        }
      });
      // Allow Enter/Space to toggle
      btn.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); btn.click(); }
      });
    });
  }

  // Reflection timeline: scroll-based reveal and left-week highlight
  const timeline = document.querySelector('.reflection-timeline');
  if(timeline){
    const steps = document.querySelectorAll('.reflection-step');
    const weeks = document.querySelectorAll('.weeks-list .week');

  const weeksList = document.querySelector('.weeks-list');


    // IntersectionObserver to reveal steps (visibility)
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
      // also update active week when intersection events occur
      updateActiveWeek();
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    steps.forEach(s => io.observe(s));

    // Helper: find the step closest to the visible center (below header) and mark the corresponding week active
    function getVisibleCenter(){
      const headerEl = document.querySelector('.site-header');
      const headerOffset = headerEl ? headerEl.getBoundingClientRect().height : 80;
      return headerOffset + (window.innerHeight - headerOffset) / 2;
    }

    function updateActiveWeek(){
      if(!steps || steps.length === 0) return;
      const visibleCenter = getVisibleCenter();
      let closestIdx = -1;
      let closestDist = Infinity;
      steps.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        const elemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elemCenter - visibleCenter);
        if(dist < closestDist){
          closestDist = dist;
          closestIdx = i;
        }
      });

      if(closestIdx === -1) return;
      weeks.forEach(w => w.classList.remove('active'));
      if(weeks[closestIdx]){
        weeks[closestIdx].classList.add('active');
        // center the active week in the weeks-list container
        const weeksList = document.querySelector('.weeks-list');
        if(weeksList && typeof weeksList.scrollTo === 'function'){
          const containerRect = weeksList.getBoundingClientRect();
          const elRect = weeks[closestIdx].getBoundingClientRect();
          const offset = (elRect.top - containerRect.top) - (weeksList.clientHeight/2 - elRect.height/2);
          weeksList.scrollTo({ top: weeksList.scrollTop + offset, behavior: 'smooth' });
        } else {
          weeks[closestIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // Align weeks-list vertically: keep it centered in the visible area when possible,
    // otherwise clamp it to the top/bottom of the timeline container so its
    // start/end line up exactly with the right column's start/end.
    function alignWeeksList(){
      if(!weeksList) return;
      const headerEl = document.querySelector('.site-header');
      const headerOffset = headerEl ? headerEl.getBoundingClientRect().height : 80;
      const padding = 12; // gap from header/foot
      const weeksRect = weeksList.getBoundingClientRect();
      const weeksH = weeksRect.height;
      const viewportH = window.innerHeight;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const container = document.querySelector('.timeline-container');
      if(!container) return;
      const containerRect = container.getBoundingClientRect();
      const containerTopDoc = scrollY + containerRect.top;
      const containerBottomDoc = containerTopDoc + containerRect.height;

      // Ideal top (viewport coords) to vertically center the weeks list
      const idealViewportTop = headerOffset + (viewportH - headerOffset) / 2 - weeksH / 2;
      const idealDocTop = scrollY + idealViewportTop;

      // Clamp the document-top of the weeks list so it never leaves the timeline container
      const minDocTop = containerTopDoc + padding;
      const maxDocTop = containerBottomDoc - weeksH - padding;

      // If weeks list is taller than the container, clamp to container top
      let clampedDocTop = idealDocTop;
      if(minDocTop > maxDocTop){
        // weeks list doesn't fit entirely in container -> stick to the container top
        clampedDocTop = minDocTop;
      } else {
        if(clampedDocTop < minDocTop) clampedDocTop = minDocTop;
        if(clampedDocTop > maxDocTop) clampedDocTop = maxDocTop;
      }

      // Convert back to viewport top and apply as inline style for sticky top
      const finalTop = clampedDocTop - scrollY;
      weeksList.style.top = finalTop + 'px';
    }

    // Run alignment on load/resize/scroll (throttled via rAF already present)
    let alignRaf = null;
    function scheduleAlign(){
      if(alignRaf) cancelAnimationFrame(alignRaf);
      alignRaf = requestAnimationFrame(()=>{ alignWeeksList(); alignRaf = null; });
    }

    window.addEventListener('resize', scheduleAlign, { passive: true });
    window.addEventListener('scroll', scheduleAlign, { passive: true });
    // initial align
    scheduleAlign();

    // Throttle updateActiveWeek calls on scroll using requestAnimationFrame
    let rafId = null;
    window.addEventListener('scroll', () => {
      if(rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => { updateActiveWeek(); rafId = null; });
    }, { passive: true });

    // Ensure active week is correct on load
    updateActiveWeek();

    // Click on week scrolls to corresponding step — center the step in the
    // visible viewport area (accounting for the fixed header) so the step
    // appears centered rather than simply aligned under the header.
    weeks.forEach((w, i) => {
      w.addEventListener('click', () => {
        const target = steps[i];
        if(!target) return;
  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // Compute visible center using live header height
  const visibleCenter = getVisibleCenter();
  const elemCenterViewport = rect.top + rect.height / 2;
  const delta = elemCenterViewport - visibleCenter;
  const targetY = scrollTop + delta;

        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        // After smooth scroll settles, perform a final snap to ensure exact centering
        // (some browsers may not land exactly on the computed pixel target).
        setTimeout(() => {
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' });
          updateActiveWeek();
        }, 420);
      });
    });

    // Reflection images: open a lightbox when an image is clicked and allow closing
    // with the circular `.close-pdf` button, overlay click or Escape key.
    (function setupReflectionLightbox(){
      const imgs = document.querySelectorAll('.reflection-step .images img');
      const lightbox = document.querySelector('.reflection-lightbox');
      if(!lightbox || !imgs || imgs.length === 0) return;
      const lbImg = lightbox.querySelector('img');
      const lbCaption = lightbox.querySelector('.lightbox-caption');
      const closeBtn = lightbox.querySelector('.close-pdf');

      function openLightbox(src, alt){
        if(!lightbox || !lbImg) return;
        lbImg.src = src;
        lbImg.alt = alt || '';
        if(lbCaption) lbCaption.textContent = alt || '';
        lightbox.setAttribute('aria-hidden','false');
        // prevent body scroll while open
        document.body.style.overflow = 'hidden';
        if(closeBtn) closeBtn.focus();
        window.addEventListener('keydown', onKeydown);
      }

      function closeLightbox(){
        if(!lightbox) return;
        lightbox.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
        if(lbImg) lbImg.src = '';
        window.removeEventListener('keydown', onKeydown);
      }

      function onKeydown(e){ if(e.key === 'Escape') closeLightbox(); }

      imgs.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
      });

      if(closeBtn) closeBtn.addEventListener('click', closeLightbox);

      // Click on overlay (outside content) closes
      lightbox.addEventListener('click', (ev) => {
        const content = lightbox.querySelector('.lightbox-content');
        if(!content.contains(ev.target)) closeLightbox();
      });
    })();
  }

});
