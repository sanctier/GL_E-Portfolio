// Documents page specific functionality - PDF viewer

document.addEventListener('DOMContentLoaded', () => {
  const docsGrid = document.getElementById('docsGrid');
  const pdfModal = document.getElementById('pdfModal');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfTitle = document.getElementById('pdfTitle');
  
  if(!docsGrid || !pdfModal) return;

  // Documents limited to three core PDFs for the assignment
  const docs = [
    {title:'Project Proposal', desc:'Initial project proposal sent to Learning Facilitator.', file:'Project Proposal.pdf'},
    {title:'Learning Contract', desc:'Key Learning objectives, Goals and Action Plan.', file:'Learning Contract_Kelvin.pdf'},
    {title:'Learning Log', desc:'Bi-Weekly learning log and reflections. (Plan, Perform, Monitor, Reflect)', file:'Learning Log.pdf'},
    {title:'GDD (Game Design Document)', desc:'Game Design Document covering mechanics, level design, UI, systems and progressions.', file:'endless-GDD.pdf'}
  ];

  let current = 0;
  let lastTrigger = null;

  // Populate documents grid
  docs.forEach((d, idx)=>{
    const card = document.createElement('div');
    card.className='doc-card';
    card.innerHTML = `
      <h3>${d.title}</h3>
      <p>${d.desc}</p>
      <button class='btn' data-idx='${idx}'>View Document</button>
    `;
    docsGrid.appendChild(card);
  });

  // PDF viewer functions
  function openPdf(i){
    current = i;
    pdfTitle.textContent = docs[current].title;
    pdfFrame.src = docs[current].file;
    pdfModal.setAttribute('aria-hidden','false');
    const closeBtn = document.getElementById('closePdf');
    if(closeBtn) closeBtn.focus();
  }

  function closePdf(){
    pdfModal.setAttribute('aria-hidden','true');
    pdfFrame.src = '';
    if(lastTrigger) lastTrigger.focus();
  }

  // Event listeners
  docsGrid.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-idx]');
    if(!btn) return;
    lastTrigger = btn;
    openPdf(Number(btn.dataset.idx));
  });

  document.getElementById('closePdf').addEventListener('click', closePdf);
  
  document.getElementById('prevPdf').addEventListener('click', ()=>{
    current = (current - 1 + docs.length) % docs.length;
    openPdf(current);
  });
  
  document.getElementById('nextPdf').addEventListener('click', ()=>{
    current = (current + 1) % docs.length;
    openPdf(current);
  });

  // Close on outside click
  pdfModal.addEventListener('click', (e)=>{ 
    if(e.target===pdfModal) closePdf(); 
  });

  // Close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && pdfModal.getAttribute('aria-hidden') === 'false'){
      closePdf();
    }
  });
});
