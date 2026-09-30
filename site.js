document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('[data-nav]');
  const menu=document.querySelector('[data-nav-toggle]');
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu'});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const theme=document.querySelector('[data-theme-toggle]');
  const themeKey='cueva-theme';
  if(localStorage.getItem(themeKey)==='dark')document.body.classList.add('theme-dark');
  theme?.addEventListener('click',()=>{document.body.classList.toggle('theme-dark');localStorage.setItem(themeKey,document.body.classList.contains('theme-dark')?'dark':'light')});

  const toast=document.querySelector('[data-toast]'); let timer;
  const notify=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2500)};

  document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const s=form.querySelector('.form-status');if(s)s.textContent='Demo only — no real information was transmitted.';notify('Demo only · nothing was submitted.')}));

  const search=document.querySelector('[data-catalog-search]');
  const filter=document.querySelector('[data-catalog-filter]');
  const cards=[...document.querySelectorAll('[data-product-grid] .searchable')];
  const empty=document.querySelector('[data-empty]');
  const params=new URLSearchParams(location.search);
  if(filter&&params.get('category'))filter.value=params.get('category');
  function apply(){if(!cards.length)return;const q=(search?.value||'').trim().toLowerCase();const cat=filter?.value||'all';let visible=0;cards.forEach(card=>{const okQ=!q||(card.dataset.search||'').includes(q);const okC=cat==='all'||card.dataset.category===cat;card.hidden=!(okQ&&okC);if(okQ&&okC)visible++});if(empty)empty.hidden=visible!==0}
  search?.addEventListener('input',apply); filter?.addEventListener('change',apply); apply();

  const savedKey='cueva-saved-products';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(savedKey)||'[]')}catch{return []}};
  const setSaved=x=>localStorage.setItem(savedKey,JSON.stringify(x));
  function syncSaved(){const saved=getSaved();document.querySelectorAll('[data-save-product]').forEach(btn=>{const on=saved.includes(btn.dataset.product);btn.textContent=on?'Saved':'Save';btn.closest('.product-card')?.classList.toggle('saved',on)});const count=document.querySelector('[data-saved-count]');if(count)count.textContent=String(saved.length)}
  document.querySelectorAll('[data-save-product]').forEach(btn=>btn.addEventListener('click',()=>{let saved=getSaved();const p=btn.dataset.product;saved=saved.includes(p)?saved.filter(x=>x!==p):[...saved,p];setSaved(saved);syncSaved();notify(saved.includes(p)?'Saved to your collection':'Removed from saved collection')}));
  document.querySelector('[data-clear-saved]')?.addEventListener('click',()=>{setSaved([]);syncSaved()}); syncSaved();

  document.querySelectorAll('.accordion details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)[...d.parentElement.children].filter(x=>x!==d&&x.tagName==='DETAILS').forEach(x=>x.open=false)}));

  const reveals=[...document.querySelectorAll('main > section')];reveals.forEach(x=>x.classList.add('reveal'));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.06});reveals.forEach(x=>io.observe(x))}else reveals.forEach(x=>x.classList.add('visible'));
});
