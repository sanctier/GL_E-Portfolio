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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });
  // (No footer animation — static presentation)

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


    // IntersectionObserver to reveal steps
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          // set active week based on index
          const idx = Array.from(steps).indexOf(entry.target);
          weeks.forEach(w=>w.classList.remove('active'));
          if(weeks[idx]){
            weeks[idx].classList.add('active');
            // center the active week in the weeks-list container
            const weeksList = document.querySelector('.weeks-list');
            if(weeksList && typeof weeksList.scrollTo === 'function'){
              // compute offset to center the element inside the container
              const containerRect = weeksList.getBoundingClientRect();
              const elRect = weeks[idx].getBoundingClientRect();
              const offset = (elRect.top - containerRect.top) - (weeksList.clientHeight/2 - elRect.height/2);
              // smooth scroll within the container
              weeksList.scrollTo({ top: weeksList.scrollTop + offset, behavior: 'smooth' });
            } else {
              // fallback: scroll element into view centered in viewport
              weeks[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0
    });

    steps.forEach(s => io.observe(s));

    // Click on week scrolls to corresponding step
    weeks.forEach((w, i) => {
      w.addEventListener('click', () => {
        const target = steps[i];
        if(!target) return;
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 80;
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - headerOffset - 20; // small gap
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  }

});
