// checklist.js — controls the read-only checklist page
// Change PAGE_TITLE to update the page h1. Change items[].completed to true to mark as checked.

const PAGE_TITLE = 'Development Checklist';

const items = [
  { text: 'Set up project structure (Unity folders)', completed: true },
  { text: 'Implement player movement & collision', completed: true },
  { text: 'Find art assets (2D sprites, Background)', completed: true },
  { text: 'Implement enemy AI and behaviors', completed: true},
  { text: 'Design Shop System', completed: true },
  { text: 'Add User interface:<br> Health, Wave timer and currency texts', completed: true },
  { text: 'Main Menu and Start Screen', completed: false },
  { text: 'Implement random enemy Spawn System', completed: true },
  { text: 'Constraint player play area', completed: true },
  { text: 'Player Audio feedback', completed: false },
  { text: 'Enemy Audio feedback', completed: false },
  { text: 'Prepare HTML5 build', completed: false },
  { text: 'Record a demo/trailer video', completed: false },
  { text: 'Conduct playtesting session', completed: false }
];

window.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.querySelector('.page-header h1');
  if(titleEl) titleEl.textContent = PAGE_TITLE;

  const listEl = document.getElementById('checklist');
  const summaryEl = document.getElementById('progressSummary');
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');

  function render(){
    listEl.innerHTML = '';
    items.forEach((item, idx) => {
      const id = 'chk_' + idx;
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="check-item ${item.completed ? 'completed' : ''}" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:10px;background:var(--card);box-shadow:var(--shadow);">
          <input id="${id}" type="checkbox" aria-label="${item.text}" ${item.completed ? 'checked' : ''} disabled>
          <div style="flex:1">
            <div class="task-text" style="font-weight:700;color:#0f172a">${item.text}</div>
            <div class="task-status">${item.completed ? 'Completed' : 'In Progress'}</div>
          </div>
        </div>
      `;
      listEl.appendChild(li);
    });
    updateSummary();
  }

  function updateSummary(){
    const total = items.length;
    const done = items.filter(i => i.completed).length;
    if(summaryEl) summaryEl.textContent = `${done}/${total} completed`;
    const pct = total === 0 ? 0 : Math.round((done/total) * 100);
    if(progressPercent) progressPercent.textContent = pct + '%';
    if(progressFill) progressFill.style.width = pct + '%';
  }

  render();

  // No UI editing on this page — progress bar and summary are derived from items[].completed
});
