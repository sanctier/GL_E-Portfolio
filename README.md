# Student e-Portfolio — "The Game"

This is a multi-page responsive e-portfolio built with HTML, CSS, and JavaScript. It showcases a student's learning journey with individual pages for different sections.

## Pages

- **Home (index.html)** — Welcome page with quick links
- **About (about.html)** — Personal bio, skills, and contact info
- **Game (game.html)** — Learning journey as an RPG-style game concept
- **Reflection (reflection.html)** — Weekly reflections with collapsible accordion
- **Documents (documents.html)** — PDF viewer for project documents
- **Feedback (feedback.html)** — Contact form for visitor feedback
- **Gallery (gallery.html)** — Image gallery with lightbox and filters

## How to use

1. Open `index.html` in your browser by double-clicking it, or serve the folder with a local static server (recommended).
2. Replace placeholder text like `[Your Name]` throughout the HTML files.
3. Update profile image at `assets/profile.svg` or replace with your photo.
4. Add your PDF files into the `assets/` folder and update the `docs` array in `documents.js`.
5. Add your images to `assets/gallery/` and update the `galleryItems` array in `gallery.js`.

## Quick local server (PowerShell)

Run from the project folder:

```powershell
# Python 3.x
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Files included

### HTML Pages
- `index.html` — Home page
- `about.html` — About page
- `game.html` — The Game concept page
- `reflection.html` — Weekly reflections
- `documents.html` — Document viewer
- `feedback.html` — Feedback form
- `gallery.html` — Image gallery

### Assets & Scripts
- `style.css` — All styles (shared across pages)
- `script.js` — Shared JS (navigation, accordion)
- `documents.js` — PDF viewer functionality
- `feedback.js` — Form handling
- `gallery.js` — Gallery filtering and lightbox
- `assets/profile.svg` — Placeholder profile image
- `README.md` — This file

## Customization Tips

### Adding Your PDFs
Edit `documents.js` and update the `docs` array:
```javascript
const docs = [
  {title:'Your Document', desc:'Description', file:'assets/yourfile.pdf'},
  // Add more...
];
```

### Adding Gallery Images
1. Create `assets/gallery/` folder
2. Add your images
3. Edit `gallery.js` and update the `galleryItems` array

### Feedback Form
The form currently stores feedback in browser localStorage and console. To send to a real backend:
- Edit `feedback.js`
- Replace the simulated API call with a real fetch/POST request to your server

## Notes

- The PDF viewer uses an iframe to display PDFs. For better UX, consider integrating Mozilla PDF.js.
- The gallery uses colored placeholder divs as demo. Replace with real images by uncommenting the img code in `gallery.js`.
- The code uses semantic HTML5 and is commented for easy customization.
- All pages share the same navigation and footer for consistency.
