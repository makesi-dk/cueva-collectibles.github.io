const PRODUCTS = [
  {
    "id": 1,
    "name": "PlayStation 5 Console (Disc Edition)",
    "category": "Consoles",
    "price": 499.99,
    "rating": 4.8,
    "reviews": 124,
    "image": "assets/images/products/p01.jpg"
  },
  {
    "id": 2,
    "name": "Nintendo Switch OLED (White)",
    "category": "Consoles",
    "price": 349.99,
    "rating": 4.8,
    "reviews": 312,
    "image": "assets/images/products/p02.jpg"
  },
  {
    "id": 3,
    "name": "Pokémon TCG Booster Box",
    "category": "Trading Cards",
    "price": 129.99,
    "rating": 4.7,
    "reviews": 217,
    "image": "assets/images/products/p03.jpg"
  },
  {
    "id": 4,
    "name": "LEGO Hogwarts Castle",
    "category": "LEGO Sets",
    "price": 399.99,
    "rating": 4.9,
    "reviews": 89,
    "image": "assets/images/products/p04.jpg"
  },
  {
    "id": 5,
    "name": "Goku Collector Figure",
    "category": "Action Figures",
    "price": 12.99,
    "rating": 4.9,
    "reviews": 421,
    "image": "assets/images/products/p05.jpg"
  },
  {
    "id": 6,
    "name": "Xbox Series X 1TB Console",
    "category": "Consoles",
    "price": 499.99,
    "rating": 4.7,
    "reviews": 95,
    "image": "assets/images/products/p06.jpg"
  },
  {
    "id": 7,
    "name": "The Legend of Zelda: Breath of the Wild",
    "category": "Video Games",
    "price": 59.99,
    "rating": 4.9,
    "reviews": 306,
    "image": "assets/images/products/p07.jpg"
  },
  {
    "id": 8,
    "name": "Hot Wheels Ferrari SF90 Stradale 1:18",
    "category": "Collectible Models",
    "price": 129.99,
    "rating": 4.8,
    "reviews": 73,
    "image": "assets/images/products/p08.jpg"
  }
];
const CATS=[['Consoles','c01'],['Video Games','c02'],['Action Figures','c03'],['LEGO Sets','c04'],['Trading Cards','c05'],['Statues & Busts','c06'],['Movies & TV','c07'],['Anime & Manga','c08'],['Comics & Books','c09'],['Collectible Models','c10'],['Deals','c11']];
let cart=JSON.parse(localStorage.getItem('cueva_cart')||'[]'); let wishlist=JSON.parse(localStorage.getItem('cueva_wish')||'[]');
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)}
function stars(r){return '<span class="stars">'+('★'.repeat(Math.floor(r)))+'<i>★</i></span>'}
function save(){localStorage.setItem('cueva_cart',JSON.stringify(cart));localStorage.setItem('cueva_wish',JSON.stringify(wishlist));updateCounts();renderCart()}
function updateCounts(){if($('#cartCount'))$('#cartCount').textContent=cart.reduce((a,x)=>a+x.qty,0);if($('#wishCount'))$('#wishCount').textContent=wishlist.length}
function productCard(p){return `<article class="card"><button class="heart ${wishlist.includes(p.id)?'active':''}" onclick="toggleWish(${p.id})">♡</button><a href="product.html?id=${p.id}"><div class="pic"><img src="${p.image}" alt="${p.name}"></div><div class="cardbody"><h3>${p.name}</h3><div>${stars(p.rating)} <small>(${p.reviews})</small></div><strong>${money(p.price)}</strong></div></a><button class="add" onclick="addCart(${p.id})">Add to Cart</button></article>`}
function addCart(id){const p=PRODUCTS.find(x=>x.id===id);const hit=cart.find(x=>x.id===id);hit?hit.qty++:cart.push({id,qty:1});save();toast(`${p.name} added to cart`);openDrawer()}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderAll()}
function renderCats(){const el=$('#catStrip');if(!el)return;el.innerHTML=CATS.map((c,i)=>`<a class="cat" href="shop.html?cat=${encodeURIComponent(c[0])}"><img src="assets/images/categories/${c[1]}.jpg" alt="${c[0]}"><b>${c[0]}</b></a>`).join('')}
function renderFeatured(){const el=$('#featured');if(el)el.innerHTML=PRODUCTS.slice(0,8).map(productCard).join('')}
function renderShop(){const el=$('#shopProducts');if(!el)return;let data=[...PRODUCTS];const q=new URLSearchParams(location.search);let cat=q.get('cat')||'all';if(q.get('deal'))data=data.filter(p=>p.price<200);const term=(q.get('q')||'').toLowerCase();if(term)data=data.filter(p=>(p.name+' '+p.category).toLowerCase().includes(term));if(cat!=='all')data=data.filter(p=>p.category===cat);const sort=$('#sort')?.value;if(sort==='low')data.sort((a,b)=>a.price-b.price);if(sort==='high')data.sort((a,b)=>b.price-a.price);if(sort==='rating')data.sort((a,b)=>b.rating-a.rating);if($('#resultText'))$('#resultText').textContent=`${data.length} products available in the CUEVA catalog.`;el.innerHTML=data.map(productCard).join('')||'<div class="empty">No products matched your search.</div>'}
function renderCart(){const el=$('#cartItems');if(!el)return;el.innerHTML=cart.length?cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);return `<div class="cartrow"><img src="${p.image}"><div><b>${p.name}</b><small>${money(p.price)} × ${x.qty}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div></div>`}).join(''):'<div class="empty">Your cart is empty.</div>';const total=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0);if($('#subtotal'))$('#subtotal').textContent=money(total)}
function changeQty(id,d){const x=cart.find(a=>a.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(a=>a.id!==id);save()}
function openDrawer(){$('#drawer')?.classList.add('open')}function closeDrawer(){$('#drawer')?.classList.remove('open')}
function toast(t){const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function renderAll(){renderCats();renderFeatured();renderShop();renderCart();updateCounts()}
document.addEventListener('DOMContentLoaded',()=>{renderAll();$('#sort')?.addEventListener('change',renderShop);$('#cartBtn')?.addEventListener('click',openDrawer);$('#closeDrawer')?.addEventListener('click',closeDrawer);$('#wishBtn')?.addEventListener('click',()=>{const ids=new Set(wishlist);if(!ids.size)return toast('Your wishlist is empty');location.href='shop.html?q='+encodeURIComponent('')});$('#checkout')?.addEventListener('click',()=>toast(cart.length?'Demo checkout ready — connect your payment provider here.':'Your cart is empty'));$('#newsletter')?.addEventListener('submit',e=>{e.preventDefault();toast('You are on the CUEVA list. Welcome!')});$('#searchForm')?.addEventListener('submit',e=>{e.preventDefault();const q=$('#searchInput').value.trim();location.href='shop.html?q='+encodeURIComponent(q)+(($('#searchCat')?.value||'all')!=='all'?'&cat='+encodeURIComponent($('#searchCat').value):'')});$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const u=new URL(location.href);const c=b.dataset.filter;c==='all'?u.searchParams.delete('cat'):u.searchParams.set('cat',c);history.replaceState({},'',u);renderShop()}));$$('[data-price]').forEach(b=>b.addEventListener('change',()=>{const checked=$('[data-price]:checked');if(!checked){renderShop();return}const v=checked.dataset.price;const el=$('#shopProducts');let data=PRODUCTS.filter(p=>v==='under50'?p.price<50:v==='50to200'?p.price>=50&&p.price<=200:p.price>200);el.innerHTML=data.map(productCard).join('')}));});
