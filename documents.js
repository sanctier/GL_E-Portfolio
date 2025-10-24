// Documents page specific functionality - PDF viewer

document.addEventListener('DOMContentLoaded', () => {
  const docsGrid = document.getElementById('docsGrid');
  const pdfModal = document.getElementById('pdfModal');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfTitle = document.getElementById('pdfTitle');
  
  if(!docsGrid || !pdfModal) return;

  // Sample PDF data - replace with your actual PDFs
  const docs = [
    {title:'Project Proposal',desc:'Initial project proposal and plan.',file:'assets/sample1.pdf'},
    {title:'Design Document',desc:'Wireframes and design decisions.',file:'assets/sample2.pdf'},
    {title:'Final Report',desc:'Final project report and reflection.',file:'assets/sample3.pdf'},
    {title:'Technical Specification',desc:'Detailed technical documentation.',file:'assets/sample4.pdf'},
    {title:'User Research',desc:'User interviews and findings.',file:'assets/sample5.pdf'},
    {title:'Testing Report',desc:'Testing methodology and results.',file:'assets/sample6.pdf'}
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
