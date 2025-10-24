// Gallery page functionality - Image lightbox and filtering

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  if(!galleryGrid || !lightbox) return;

  // Sample gallery items - replace with your actual images
  const galleryItems = [
    {title:'Project Homepage', category:'projects', image:'assets/gallery/project1.jpg'},
    {title:'Mobile Interface', category:'designs', image:'assets/gallery/design1.jpg'},
    {title:'Dashboard Screenshot', category:'screenshots', image:'assets/gallery/screenshot1.jpg'},
    {title:'Landing Page', category:'projects', image:'assets/gallery/project2.jpg'},
    {title:'Color Palette', category:'designs', image:'assets/gallery/design2.jpg'},
    {title:'User Flow', category:'designs', image:'assets/gallery/design3.jpg'},
    {title:'Final Application', category:'screenshots', image:'assets/gallery/screenshot2.jpg'},
    {title:'Wireframes', category:'designs', image:'assets/gallery/design4.jpg'},
    {title:'Portfolio Layout', category:'projects', image:'assets/gallery/project3.jpg'}
  ];

  let currentFilter = 'all';
  let currentImageIndex = 0;
  let filteredItems = [...galleryItems];

  // Render gallery
  function renderGallery(filter = 'all'){
    galleryGrid.innerHTML = '';
    filteredItems = filter === 'all' ? [...galleryItems] : galleryItems.filter(item => item.category === filter);
    
    filteredItems.forEach((item, idx) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.setAttribute('data-index', idx);
      
      // Create placeholder colored div instead of img for demo
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.height = '250px';
      placeholder.style.background = `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.color = 'white';
      placeholder.style.fontSize = '3rem';
      placeholder.textContent = '🖼️';
      
      galleryItem.innerHTML = `
        <div class="gallery-item-overlay">
          <h3 class="gallery-item-title">${item.title}</h3>
          <p class="gallery-item-category">${item.category}</p>
        </div>
      `;
      
      galleryItem.insertBefore(placeholder, galleryItem.firstChild);
      galleryGrid.appendChild(galleryItem);
    });
  }

  // Helper for random colors
  function getRandomColor(){
    const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      currentFilter = filter;
      renderGallery(filter);
    });
  });

  // Lightbox functionality
  function openLightbox(index){
    currentImageIndex = index;
    const item = filteredItems[index];
    lightboxCaption.textContent = item.title;
    
    // For demo, create placeholder in lightbox
    const placeholder = document.createElement('div');
    placeholder.style.width = '80vw';
    placeholder.style.maxWidth = '1000px';
    placeholder.style.height = '60vh';
    placeholder.style.background = `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.fontSize = '5rem';
    placeholder.textContent = '🖼️';
    
    lightboxImage.replaceWith(placeholder);
    placeholder.id = 'lightboxImage';
    
    lightbox.setAttribute('aria-hidden','false');
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
  }

  function showNext(){
    currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
    openLightbox(currentImageIndex);
  }

  function showPrev(){
    currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    openLightbox(currentImageIndex);
  }

  // Event listeners
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if(item){
      const index = parseInt(item.getAttribute('data-index'));
      openLightbox(index);
    }
  });

  document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
  document.getElementById('nextImage').addEventListener('click', showNext);
  document.getElementById('prevImage').addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') showNext();
      if(e.key === 'ArrowLeft') showPrev();
    }
  });

  // Initial render
  renderGallery();
});
