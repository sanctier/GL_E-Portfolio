// Gallery page functionality - Image lightbox and filtering

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  if(!galleryGrid || !lightbox) return;

  // Sample flat list of images — we'll chunk them into albums (3 images per album)
  const galleryItems = [
    {title:'', category:'', image:'week1a.jpg'},
    {title:'', category:'', image:'week1b.jpg'},
    {title:'', category:'', image:'week1c.jpg'},
  ];
  // You can define albums explicitly below to control titles and which images belong to each album.
  // If `albumsData` is non-empty it will be used; otherwise the script will fallback to chunking
  // `galleryItems` into albums of 3 images each.
  // Example usage (uncomment and edit):
  const albumsData = [
    { title: 'Main Character', images: ['week1a.jpg','week1b.jpg'], captions: ['Putting the character into the scene','Coding the movement'] },
    { title: 'Enemies', images: ['week1a.jpg','week1b.jpg'], captions: ['Main char','Idle frames'] },
    { title: 'Game Screenshots', images: ['week1a.jpg','week1b.jpg'], captions: ['Main char','Idle frames'] },
    // Additional albums added below
    { title: 'Environment', images: ['week1a.jpg','week1b.jpg','week1a.jpg'], captions: ['Tileset exploration','Level layout tests','Prototype tiles'] },
    { title: 'UI & HUD', images: ['week1a.jpg','week1b.jpg'], captions: ['Health and HUD layout','Inventory & shop UI'] },
    { title: 'Others', images: ['week1a.jpg','week1b.jpg','week1a.jpg'], captions: ['Early playtest','Balancing session','Bug capture'] },
  ];
 

  // Build the albums array: prefer explicit albumsData, otherwise chunk galleryItems
  const albums = (albumsData && albumsData.length)
    ? albumsData
    : (function(){
        const out = [];
        for (let i = 0; i < galleryItems.length; i += 3) {
          const chunk = galleryItems.slice(i, i + 3);
          out.push({
            title: `Album ${Math.floor(i / 3) + 1}`,
            images: chunk.map(it => it.image || ''),
            captions: chunk.map(it => it.title || '')
          });
        }
        return out;
      })();

  let currentAlbum = 0;
  let currentImageIndex = 0;

  // Render gallery
  // Render albums grid: 3 albums per row (CSS controls layout)
  function renderGallery(){
    galleryGrid.innerHTML = '';
    // set class for album layout
    galleryGrid.className = 'albums-grid';

    albums.forEach((album, aIdx) => {
      const albumCard = document.createElement('div');
      albumCard.className = 'album-card';
      albumCard.setAttribute('data-album-index', aIdx);

      // stack area where images sit on top of each other with slight right offsets
      const stack = document.createElement('div');
      stack.className = 'album-stack';

      // Render up to 3 images: first is front, others peek to the right behind it
      album.images.forEach((imgSrc, i) => {
        const img = document.createElement('img');
        img.className = 'album-shot';
        img.src = imgSrc || '';
        img.alt = album.captions[i] || `${album.title} image ${i+1}`;
        // annotate which image in the album this is
        img.setAttribute('data-image-index', i);
        stack.appendChild(img);
      });

      // title/caption area below stack
      const info = document.createElement('div');
      info.className = 'album-info';
      info.innerHTML = `<h4 class="album-title">${album.title}</h4>`;

      albumCard.appendChild(stack);
      albumCard.appendChild(info);
      galleryGrid.appendChild(albumCard);
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

  // Lightbox functionality: open an album and show the selected image (default 0)
  function openLightbox(albumIdx, imageIdx = 0){
    currentAlbum = albumIdx;
    currentImageIndex = imageIdx;
    const album = albums[albumIdx];
    const caption = (album.captions && album.captions[imageIdx]) || '';
    // Update caption element (under the image)
    lightboxCaption.textContent = caption || '';
    // Update the toolbar title: prefer album title, and append caption or image index when available
    const titleEl = document.getElementById('lightboxTitle');
    if (titleEl) {
      let titleText = '';
      if (album.title) {
        // show album title and then either caption or image index
        titleText = album.title;
        if (caption) titleText += ' — ' + caption;
        else titleText += ' — Image ' + (imageIdx + 1);
      } else if (caption) {
        titleText = caption;
      } else {
        titleText = 'Image ' + (imageIdx + 1);
      }
      titleEl.textContent = titleText;
    }
    // Ensure we always update the current image element in the DOM rather than
    // replacing the original node (which can leave a detached stale reference).
    let imgEl = document.getElementById('lightboxImage');
    const captionEl = document.getElementById('lightboxCaption');
    // If the image was removed/replaced earlier, recreate and insert it next to the caption
    if (!imgEl) {
      imgEl = document.createElement('img');
      imgEl.id = 'lightboxImage';
      imgEl.className = 'lightbox-full';
      imgEl.style.maxWidth = '80vw';
      imgEl.style.maxHeight = '80vh';
      imgEl.style.borderRadius = '8px';
      imgEl.style.objectFit = 'contain';
      if (captionEl && captionEl.parentNode) {
        captionEl.parentNode.insertBefore(imgEl, captionEl);
      }
    }

  // Set src/alt (use empty string if missing) and add an onerror for easier debugging
  const src = (album.images && album.images[imageIdx]) || '';
  imgEl.src = src;
  // alt should reflect caption when available
  imgEl.alt = caption || (album.title ? album.title + ' image ' + (imageIdx + 1) : 'Image ' + (imageIdx + 1));
  imgEl.onerror = function () { console.warn('Gallery: image failed to load', imgEl.src); };
    
    lightbox.setAttribute('aria-hidden','false');
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
  }

  function showNext(){
    const album = albums[currentAlbum];
    if (!album || !album.images.length) return;
    currentImageIndex = (currentImageIndex + 1) % album.images.length;
    openLightbox(currentAlbum, currentImageIndex);
  }

  function showPrev(){
    const album = albums[currentAlbum];
    if (!album || !album.images.length) return;
    currentImageIndex = (currentImageIndex - 1 + album.images.length) % album.images.length;
    openLightbox(currentAlbum, currentImageIndex);
  }


  // Event listeners: open album when its card is clicked; optionally open a specific image if clicked on a peek
  galleryGrid.addEventListener('click', (e) => {
    const albumCard = e.target.closest('.album-card');
    if (!albumCard) return;
    const aIdx = Number(albumCard.getAttribute('data-album-index'));
    // if user clicked a specific image inside the stack, try to open that image index
    const clickedImg = e.target.closest('.album-shot');
    const imgIndex = clickedImg ? Number(clickedImg.getAttribute('data-image-index')) : 0;
    openLightbox(aIdx, imgIndex);
  });


  document.getElementById('closeLightbox').addEventListener('click', closeLightbox);

  // Wire prev/next toolbar buttons (they exist in the new lightbox markup)
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

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
