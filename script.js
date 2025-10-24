// Basic interactivity: navbar toggle, page-specific navigation highlight, accordion

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const currentPage = document.body.getAttribute('data-page');

  // Toggle mobile nav (add/remove .show for better control)
  if(navToggle){
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('show');
    });
  }

  // Highlight current page in navigation
  if(currentPage){
    navLinks.forEach(link => {
      if(link.getAttribute('data-page') === currentPage){
        link.classList.add('active');
      }
    });
  }

  // Close mobile nav when clicking a nav link
  navLinks.forEach(a=>{
    a.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav-links');
      if(nav && nav.classList.contains('show')) nav.classList.remove('show');
    });
  });

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

});
