localStorage.setItem('apiBase','http://localhost:5017/api');

// === i18n ===
const I18N = {
  tr: {
    nav: { home:"Ana Sayfa", map:"Nasıl Giderim", places:"Gezilecek Yerler", about:"Hakkımızda", contact:"İletişim" },
    home: {
      title:"Diyarbakır’a Hoş Geldiniz",
      subtitle:"Sur içinden Hevsel’e, On Gözlü Köprü’den Ulu Cami’ye… Şehri keşfetmeye başlayın.",
      ctaMap:"Nasıl giderim?", ctaPlaces:"Gezilecek yerler", featured:"Öne Çıkanlar", details:"Detaylara git"
    },
    places: { title:"Gezilecek Yerler", search:"Yer ara (örn: köprü, han, sur)...", more:"Daha fazla bilgi", less:"Daha az bilgi", empty:"Yerler yüklenemedi. API çalışıyor mu?" },
    about: {
      slogan:"Diyarbakır’ı keşfetmenin en hızlı yolu.",
      lead:"Şehrin tarihini ve doğasını özenle derledik; tek dokunuşla yerleri keşfedin, rotanızı çizin.",
      missionTitle:"Misyonumuz",
      missionText:"Ziyaretçilere <strong>güvenilir, hızlı ve sade</strong> bir deneyim sunarak Diyarbakır’ın kültürel mirasını kolayca keşfetmelerini sağlamak; yerel ekonomiye ve sürdürülebilir turizme katkıda bulunmak.",
      visionTitle:"Vizyonumuz",
      visionText:"Diyarbakır’ı dijitalde <strong>örnek bir şehir rehberi</strong> haline getirmek; açık harita standartları ve modern teknolojilerle sürekli gelişen, herkes için erişilebilir bir keşif deneyimi sunmak."
    },
    contact: {
      title:"İletişim", reachUs:"Bize Ulaşın",
      address:"Adres", phone:"Telefon", email:"E-posta", hours:"Çalışma Saatleri",
      sendMsg:"Mesaj Gönder", formLead:"Görüş ve önerilerinizi form üzerinden iletebilirsiniz.",
      openForm:"İletişim Formunu Aç", formNote:"Form yeni sekmede açılır."
    },
    map: {
      title:"Nasıl Giderim?",
      subtitle:"Başlangıç ve hedefi gir; rota ve süreyi gösterelim. (Konum izni verirsen “Nereden” otomatik dolar.)",
      fromLabel:"Nereden", toLabel:"Nereye", modeLabel:"Ulaşım türü",
      modeWalking:"Yürüyerek", modeDriving:"Arabayla", modeCycling:"Bisiklet",
      submitRoute:"Rota Göster",
      placeholderFrom:"Mevcut konum veya adres", placeholderTo:"Örn: Ulu Cami, Diyarbakır",
      useMyLoc:"Konumum",
      notFound:"Adres(ler) bulunamadı.",
      onlyCity:"Rota sadece Türkiye sınırları içinde desteklenir.",
      fail:"Rota oluşturulamadı.", noRoute:"Rota bulunamadı.", total:"Toplam:", km:"km", min:"dk",
      myLoc:"Mevcut konum",
      geoErr:"Konum alınamadı. Lütfen izin verin ya da adres girin.",
      noGeo:"Tarayıcın konum servisini desteklemiyor.",
      out:"Mevcut konum Türkiye sınırları dışında."
    },
    auth: { loginBtn: "Giriş", registerBtn: "Kayıt Ol", logout: "Çıkış", adminPanel: "Admin Panel", addPlace: "Mekan Ekle" },
    login: { title: "Giriş Yap", idPh: "Kullanıcı adı veya e-posta", pwdPh: "Parola" },
    register: { title: "Kayıt Ol", usernamePh: "Kullanıcı adı", emailPh: "E-posta", pwdPh: "Parola (min 6)" }
  },
  en: {
    nav: { home:"Home", map:"Directions", places:"Places to Visit", about:"About", contact:"Contact" },
    home: { title:"Welcome to Diyarbakır", subtitle:"From Sur to Hevsel, from the Ten-Eyed Bridge to the Grand Mosque… start exploring the city.", ctaMap:"How do I get there?", ctaPlaces:"Places to visit", featured:"Featured", details:"View details" },
    places: { title:"Places to Visit", search:"Search (e.g. bridge, inn, walls)...", more:"More info", less:"Less info", empty:"Places couldn’t be loaded. Is the API up?" },
    about: {
      slogan:"The fastest way to explore Diyarbakır.",
      lead:"We’ve curated the city’s history and nature; discover places and draw your route in one tap.",
      missionTitle:"Our Mission",
      missionText:"To provide a <strong>reliable, fast and simple</strong> experience so visitors can easily discover Diyarbakır’s cultural heritage; contributing to the local economy and sustainable tourism.",
      visionTitle:"Our Vision",
      visionText:"To make Diyarbakır an <strong>exemplary digital city guide</strong>; offering an ever-improving, accessible discovery experience with open-map standards and modern tech."
    },
    contact: {
      title:"Contact", reachUs:"Get in Touch", address:"Address", phone:"Phone", email:"Email", hours:"Hours",
      sendMsg:"Send a Message", formLead:"You can send your feedback via the form.", openForm:"Open Contact Form", formNote:"The form opens in a new tab."
    },
    map: {
      title:"Directions", subtitle:"Enter start and destination; we’ll show the route and duration. (“From” auto-fills if you allow location.)",
      fromLabel:"From", toLabel:"To", modeLabel:"Mode of travel",
      modeWalking:"Walking", modeDriving:"Driving", modeCycling:"Cycling",
      submitRoute:"Show Route",
      placeholderFrom:"Current location or address", placeholderTo:"e.g., Ulu Cami, Diyarbakır",
      useMyLoc:"My Location",
      notFound:"Couldn’t find the address(es).",
      onlyCity:"Routing is supported only within Turkey.",
      fail:"Couldn’t build route.", noRoute:"No route found.", total:"Total:", km:"km", min:"min",
      myLoc:"Current location", geoErr:"Couldn’t get your location. Please allow permission or type an address.", noGeo:"Your browser doesn’t support geolocation.", out:"Your location is outside Turkey."
    },
    auth: { loginBtn: "Login", registerBtn: "Register", logout: "Logout", adminPanel: "Admin Panel", addPlace: "Add Place" },
    login: { title: "Login", idPh: "Username or email", pwdPh: "Password" },
    register: { title: "Register", usernamePh: "Username", emailPh: "Email", pwdPh: "Password (min 6)" }
  }
};

let currentLang = (localStorage.getItem("lang") || "tr").toLowerCase();
if (!I18N[currentLang]) currentLang = "tr";
const t = (path) => path.split(".").reduce((o,k)=>o?.[k], I18N[currentLang]) || path;

const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const escapeHtml = (s)=> (s||"").replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));
function getDesc(p){ return currentLang === "en" ? (p.descriptionEn || p.description) : p.description; }
function getTags(p){ return currentLang === "en" ? (p.tagsEn || p.tags) : p.tags; }
const escapeAttr = (s)=> escapeHtml(String(s)).replace(/"/g,"&quot;");
const shuffle = (a)=>{ for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]} return a; };
const pickWindow = (arr, off, size)=>{ const out=[]; if(!arr.length) return out; for(let i=0;i<Math.min(size,arr.length);i++) out.push(arr[(off+i)%arr.length]); return out; };

let currentUser = null; // {id, username, email, role}
const API_URL = "http://localhost:5017/api";
const API_CANDIDATES = ["http://localhost:5017/api"];
let API_BASE_IN_USE = null;

const apiBase = () => (API_BASE_IN_USE || API_CANDIDATES[0] || 'http://localhost:5017/api').replace(/\/$/,'');
const authFetch = (path, init={}) => fetch(
  path.startsWith('http') ? path : `${apiBase()}${path}`,
  { credentials:'include', headers:{Accept:'application/json', ...(init.headers||{})}, ...init }
);

const roleOf = (u)=> (u?.role||'').toString().trim().toLowerCase();
const isAdmin = ()=> roleOf(currentUser)==='admin';
const isSupervisor = ()=> roleOf(currentUser)==='supervisor';
const canAddPlace = ()=> ['superuser','supervisor','admin'].includes(roleOf(currentUser));

// === i18n metinleri uygula
function applyI18nStatic(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (key) el.innerHTML = t(key);
  });
  $("#place-search")?.setAttribute("placeholder", t("places.search"));
  $("#from")?.setAttribute("placeholder", t("map.placeholderFrom"));
  $("#to")?.setAttribute("placeholder", t("map.placeholderTo"));
  const w = $('#mode option[value="walking"]');
  const d = $('#mode option[value="driving"]');
  const c = $('#mode option[value="cycling"]');
  if (w) w.textContent = t("map.modeWalking");
  if (d) d.textContent = t("map.modeDriving");
  if (c) c.textContent = t("map.modeCycling");

  document.documentElement.lang = currentLang;
  const langBtn = $("#lang-toggle");
  if (langBtn) langBtn.textContent = currentLang === "tr" ? "EN" : "TR";

  $("#btn-open-login")?.replaceChildren(document.createTextNode(t("auth.loginBtn")));
  $("#btn-open-register")?.replaceChildren(document.createTextNode(t("auth.registerBtn")));
  $("#btn-logout")?.replaceChildren(document.createTextNode(t("auth.logout")));
  $("#link-admin")?.replaceChildren(document.createTextNode(isSupervisor() ? (currentLang==='tr'?'Mod Panel':'Moderation') : t("auth.adminPanel")));
  $("#link-addplace-nav")?.replaceChildren(document.createTextNode(t("auth.addPlace")));

  document.querySelector("#login-modal h3")?.replaceChildren(document.createTextNode(t("login.title")));
  $("#form-login input[name='id']")?.setAttribute("placeholder", t("login.idPh"));
  $("#form-login input[name='pwd']")?.setAttribute("placeholder", t("login.pwdPh"));

  document.querySelector("#register-modal h3")?.replaceChildren(document.createTextNode(t("register.title")));
  $("#form-register input[name='username']")?.setAttribute("placeholder", t("register.usernamePh"));
  $("#form-register input[name='email']")?.setAttribute("placeholder", t("register.emailPh"));
  $("#form-register input[name='pwd']")?.setAttribute("placeholder", t("register.pwdPh"));

  const noteEl = document.querySelector('[data-i18n="contact.formNote"]');
  if (noteEl) noteEl.remove();
}

document.addEventListener("click", (e)=>{
  const langBtn = e.target.closest("#lang-toggle");
  if (!langBtn) return;
  currentLang = currentLang === "tr" ? "en" : "tr";
  localStorage.setItem("lang", currentLang);
  applyI18nStatic();
  renderPlaces(allPlaces);
  renderFeatured();
});

// --- Sağ-alt Hızlı Menü (şu an opsiyonel) ---
function setupFab(){
  $('#fab-main')?.addEventListener('click', ()=>{
    $('#fab')?.classList.toggle('open');
  });
  $('#fab-logout')?.addEventListener('click', async ()=>{
    await authFetch('/auth/logout', { method:'POST' });
    currentUser = null;
    applyAuthUI();
    navigateTo('#home');
    alert(currentLang==="tr" ? 'Çıkış yapıldı' : 'Logged out');
    $('#fab')?.classList.remove('open');
  });
}

// ====== Fallback yerler ======
const FALLBACK_PLACES = [
  { name: "Ulu Cami", imageUrl: "assets/img/ulu-camii.jpg", tags: "cami,tarih", tagsEn: "mosque,historic", query: "Ulu Cami, Diyarbakır", isFeatured: true, description: "İslam dünyasının beşinci Harem-i Şerifi sayılan tarihi cami.", descriptionEn: "Historic mosque, fifth holiest in Islam." },
  { name: "On Gözlü Köprü", imageUrl: "assets/img/on-gozlu-kopru.jpg", tags: "köprü,tarih,dicle", tagsEn: "bridge,river,historic", query: "On Gözlü Köprü, Diyarbakır", isFeatured: true, description: "Dicle üzerindeki taş kemerli köprü. Gün batımında manzarası harika.", descriptionEn: "Stone bridge over Tigris. Great sunset view." },
  { name: "Hevsel Bahçeleri", imageUrl: "assets/img/hevsel-bahceleri.jpg", tags: "doğa,unesco,manzara", tagsEn: "nature,unesco,view", query: "Hevsel Bahçeleri, Diyarbakır", isFeatured: true, description: "UNESCO Dünya Mirası; yürüyüş ve fotoğraf için ideal.", descriptionEn: "UNESCO World Heritage; ideal for walking and photography." },
  { name: "Hasan Paşa Hanı", imageUrl: "assets/img/hasan-pasa-hani.jpg", tags: "han,kahvaltı,tarih", tagsEn: "inn,breakfast,history", query: "Hasan Paşa Hanı, Diyarbakır", isFeatured: false, description: "Tarihi han. Avluda kahvaltı kültürü meşhur.", descriptionEn: "Historic inn. Famous for breakfast in the courtyard." }
];

let allPlaces = [];
let placesLoaded = false;
let featuredPool = [];
let featuredOffset = 0;

// deep-link
let pendingOpenId = null;
const parsePlaceLink = (h) => { const m = /^#place\/(\d+)/.exec(h||""); return m ? Number(m[1]) : null; };

// ====== Router ======
function navigateTo(hash){
  const pid = parsePlaceLink(hash);
  if (pid) { pendingOpenId = pid; hash = '#places'; }

  const target=(hash||"#home").replace("#","");
  $$(".route").forEach(s=>s.classList.remove("active"));
  const el = $("#"+target);
  if(el){
    if (target === "add-place" && !canAddPlace()){
      alert(currentLang==="tr" ? "Bu bölüme erişim yok." : "You don't have access.");
      return;
    }
    el.hidden = (target==="add-place") ? !canAddPlace() : false;
    el.classList.add("active");
  }

  const nav=$(".site-nav"); const btn=$(".nav-toggle");
  if(nav?.classList.contains("open")){ nav.classList.remove("open"); btn?.setAttribute("aria-expanded","false"); }

  if (target==="map"){ ensureMap(); setTimeout(()=>{ if(map){ try{ map.invalidateSize(true); }catch{} } }, 50); }
  if (target==="places") renderPlaces(allPlaces);
  if (target==="home") renderFeatured();
}

window.addEventListener("hashchange", ()=>navigateTo(location.hash));
window.addEventListener("DOMContentLoaded", async ()=>{
  const y=$("#y"); if (y) y.textContent=new Date().getFullYear();
  $(".nav-toggle")?.addEventListener("click", ()=>{
    const isOpen=$(".site-nav")?.classList.toggle("open");
    $(".nav-toggle").setAttribute("aria-expanded", String(!!isOpen));
  });

  const firstPid = parsePlaceLink(location.hash);
  if (firstPid) pendingOpenId = firstPid;

  applyI18nStatic();
  await loadMe();           // cookie'den oturumu öğren
  // Admin/Supervisor -> direkt admin sayfası
  if (isAdmin() || isSupervisor()) { window.location.replace('admin.html'); return; }

  await loadPlaces(true);
  navigateTo(location.hash||"#home");
  renderFeatured();
  // setupFab(); // İsterseniz açın
});

// Modallar aç
document.addEventListener('click', (e)=>{
  if (e.target.closest('#btn-open-login'))  openModal('#login-modal');
  if (e.target.closest('#btn-open-register')) openModal('#register-modal');
});
function openModal(sel){ const m=document.querySelector(sel); if(m) m.hidden=false; }
function closeModal(sel){ const m=document.querySelector(sel); if(m) m.hidden=true; }
document.addEventListener('click', (e)=>{ const c=e.target.getAttribute?.('data-close'); if(c) closeModal(c); });

// LOGIN/REGISTER — delege submit
document.addEventListener('submit', async (e)=>{
  const form = e.target;

  if (form.matches('#form-login')){
    e.preventDefault();
    const id  = form.id.value.trim();
    const pwd = form.pwd.value;

    const r = await authFetch('/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ usernameOrEmail: id, password: pwd })
    });
    if(!r.ok) { alert(currentLang==="tr" ? 'Giriş başarısız' : 'Login failed'); return; }

    await loadMe();
    closeModal('#login-modal');

    if (isAdmin() || isSupervisor()){
      window.location.assign('admin.html');
      return;
    }

    alert(currentLang==="tr" ? 'Giriş başarılı' : 'Logged in');
    if (canAddPlace()) navigateTo('#add-place');
    return;
  }

  if (form.matches('#form-register')){
    e.preventDefault();
    const username = form.username.value.trim();
    const email    = form.email.value.trim().toLowerCase();
    const password = form.pwd.value;
    const r = await authFetch('/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, email, password })
    });
    if (r.status !== 201) {
      const err = await r.json().catch(()=> ({}));
      alert((currentLang==="tr" ? 'Kayıt başarısız: ' : 'Register failed: ') + (err.message || r.status));
      return;
    }
    closeModal('#register-modal'); openModal('#login-modal');
    alert(currentLang==="tr" ? 'Kayıt başarılı. Giriş yapabilirsiniz.' : 'Registered. You can log in.');
    return;
  }

  if (form.matches('#form-addplace')){
    e.preventDefault();
    const f = form;
    const payload = {
      name: f.name.value.trim(),
      imageUrl: f.imageUrl.value.trim() || null,
      tags: f.tags.value.trim() || null,
      query: f.query.value.trim() || null,
      description: f.description.value.trim() || null
    };
    const r = await authFetch('/places', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (r.status === 201){
      const j = await r.json();
      alert((currentLang==="tr" ? "Kaydedildi" : "Saved") + ` (#${j.id}) • Durum/Status: ${j.status}`);
      f.reset();
    } else {
      alert('Kaydedilemedi: ' + r.status);
    }
    return;
  }
});

// LOGOUT
document.addEventListener('click', async (e)=>{
  if (!e.target.closest('#btn-logout')) return;
  await authFetch('/auth/logout', { method:'POST' });
  currentUser = null; applyAuthUI(); alert(currentLang==="tr" ? 'Çıkış yapıldı' : 'Logged out');
});

// /me
async function loadMe(){
  try{ const r = await authFetch('/me'); currentUser = r.ok ? await r.json() : null; }
  catch{ currentUser = null; }
  applyAuthUI();
}

// --- GÜÇLENDİRİLMİŞ UI KONTROLÜ (üst bardaki çakışmayı çözer) ---
function applyAuthUI(){
  const box  = $('#user-box');
  const login= $('#btn-open-login');
  const reg  = $('#btn-open-register');
  const adminLink = $('#link-admin');
  const addLink   = $('#link-addplace-nav');

  const loggedIn = !!(currentUser && currentUser.id);

  // Guest butonları
  if (login){ login.hidden = loggedIn; login.style.display = loggedIn ? 'none' : ''; }
  if (reg)  { reg.hidden   = loggedIn; reg.style.display   = loggedIn ? 'none' : ''; }

  // User kutusu
  if (box){
    if (loggedIn){
      box.hidden = false; box.style.display = 'flex';
      $('#user-name').textContent = currentUser.username || currentUser.email || 'Kullanıcı';
      $('#user-role').textContent = currentUser.role || 'User';

      // Rol linkleri
      if (isAdmin()){
        if (adminLink){ adminLink.hidden = false; adminLink.style.display=''; adminLink.textContent = t('auth.adminPanel'); }
      }else if (isSupervisor()){
        if (adminLink){ adminLink.hidden = false; adminLink.style.display=''; adminLink.textContent = (currentLang==='tr'?'Mod Panel':'Moderation'); }
      }else{
        if (adminLink){ adminLink.hidden = true; adminLink.style.display='none'; }
      }
      if (addLink){ addLink.hidden = !canAddPlace(); addLink.style.display = canAddPlace() ? '' : 'none'; }
    }else{
      box.hidden = true; box.style.display = 'none';
      if (adminLink){ adminLink.hidden = true; adminLink.style.display='none'; }
      if (addLink){ addLink.hidden = true; addLink.style.display='none'; }
    }
  }

  // Yetkili alan
  const addSec = $('#add-place'); 
  if (addSec) addSec.hidden = !canAddPlace();
}

// ====== Yerler: API'den çek + render ======
async function loadPlaces(force=false){
  if (placesLoaded && !force) { renderPlaces(allPlaces); return; }

  for (const base of API_CANDIDATES){
    try{
      const url = `${base.replace(/\/$/,"")}/places`;
      const res = await fetch(url, { headers: { "Accept":"application/json" }, mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length){
        API_BASE_IN_USE = base.replace(/\/$/,"");
        localStorage.setItem("apiBase", API_BASE_IN_USE);
        allPlaces = data;
        break;
      }
    }catch{}
  }

  if (!API_BASE_IN_USE){ allPlaces = FALLBACK_PLACES; }
  placesLoaded = true;
  buildFeaturedPool();
  renderPlaces(allPlaces);
}
function buildFeaturedPool(){
  featuredPool = (allPlaces||[]).filter(x=>x.isFeatured);
  if (featuredPool.length < 4) featuredPool = [...allPlaces];
  shuffle(featuredPool);
  featuredOffset = Math.floor(Math.random() * (featuredPool.length || 1));
}

// === YORUM ===
const getApiBase = () => (API_BASE_IN_USE || API_CANDIDATES[0] || 'http://localhost:5017/api').replace(/\/$/,'');
async function fetchComments(pid){
  try{
    const res = await fetch(`${getApiBase()}/places/${pid}/comments`, { headers:{Accept:'application/json'}, mode:'cors' });
    if(!res.ok) return [];
    return await res.json();
  }catch{ return []; }
}
async function submitComment(pid, body){
  const res = await authFetch(`/places/${pid}/comments`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json; charset=utf-8' },
    body: JSON.stringify({ body })
  });
  const data = await res.json().catch(()=> ({}));
  if (res.ok && (data.ok || data.status === 'Pending')) return true;
  if (res.status === 401) { alert(currentLang==="tr" ? 'Yorum için önce giriş yapın.' : 'Please log in to comment.'); return false; }
  alert('Gönderilemedi: ' + (data.message || res.status)); return false;
}

// Yerleri render
function renderPlaces(list){
  const grid = $("#places-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!Array.isArray(list) || !list.length){
    grid.innerHTML = `<div class="muted" style="padding:.8rem 0">${t("places.empty")}</div>`;
    return;
  }

  for (const p of list){
    const raw = (p.imageUrl||"").replace(/^\/+/, "");
    const abs = /^https?:\/\//i.test(raw);
    const img = raw ? (abs?raw:raw) : "https://picsum.photos/800/500?blur=1";
    const tags = (getTags(p) || "").replaceAll(",", " · ");
    const desc = getDesc(p) || (currentLang==="tr" ? "Bu yer hakkında açıklama yakında." : "Description will be added soon.");

    const card = document.createElement("article");
    card.className="card";
    if (p.id) card.id = `place-${p.id}`;
    card.dataset.tags = getTags(p) || "";
    card.dataset.desc  = getDesc(p)  || "";

    card.innerHTML = `
  <img src="${img}" alt="${escapeAttr(p.name)}"
       onerror="this.onerror=null;this.src='https://picsum.photos/800/500?blur=1'">
  <div class="card-body">
    <h3>${escapeHtml(p.name)}</h3>
    <p>${escapeHtml(tags)}</p>
    <div class="card-actions">
      <button class="btn small outline more-toggle" aria-expanded="false">${t("places.more")}</button>
      ${p.id ? `<button class="btn small outline btn-comments" data-pid="${p.id}">${currentLang==="tr"?"Yorumlar":"Comments"}</button>` : ``}
    </div>
    <div class="more-content"><p>${escapeHtml(desc)}</p></div>

    ${p.id ? `
    <div class="comments-wrap" data-pid="${p.id}" hidden>
      <div class="comments-list muted" style="padding:.5rem 0">${currentLang==="tr"?"Yükleniyor…":"Loading…"}</div>
      <form class="comment-form" autocomplete="off">
        <textarea name="body" minlength="3" required placeholder="${currentLang==="tr"?"Yorumunuzu yazın":"Write your comment"}" rows="2"></textarea>
        <div style="margin-top:.5rem">
          <button class="btn small" type="submit">${currentLang==="tr"?"Gönder":"Send"}</button>
        </div>
      </form>
      <div class="muted" style="font-size:.85rem;margin-top:.25rem">
        ${currentLang==="tr"?"Gönderdiğiniz yorum önce onaya düşer.":"Your comment will be moderated first."}
      </div>
    </div>` : ``}
  </div>`;
    grid.appendChild(card);
  }

  if (pendingOpenId){
    setTimeout(()=>openPlace(pendingOpenId, true), 80);
    pendingOpenId = null;
  }
}

function openPlace(pid, withComments=false){
  if (location.hash !== '#places') navigateTo('#places');
  const el = document.getElementById(`place-${pid}`);
  if (!el) return;
  const moreBtn = el.querySelector('.more-toggle');
  if (moreBtn && moreBtn.getAttribute('aria-expanded') !== 'true') moreBtn.click();
  if (withComments){
    const cBtn = el.querySelector('.btn-comments');
    if (cBtn) cBtn.click();
  }
  el.scrollIntoView({ behavior:'smooth', block:'start' });
}

$("#place-search")?.addEventListener("input", (e)=>{
  const q = e.target.value.toLowerCase().trim();
  $$("#places-grid .card").forEach(card=>{
    const name = card.querySelector("h3")?.innerText || "";
    const tAll = (name + " " + (card.dataset.tags||"") + " " + (card.dataset.desc||"")).toLowerCase();
    card.style.display = tAll.includes(q) ? "" : "none";
  });
});

document.addEventListener("click",(e)=>{
  const btn = e.target.closest(".more-toggle");
  if (!btn) return;
  const card = btn.closest(".card");
  const open = card.classList.toggle("open");
  btn.setAttribute("aria-expanded", open ? "true" : "false");
  btn.textContent = open ? t("places.less") : t("places.more");
  const pid = card.querySelector(".btn-comments")?.dataset?.pid;
  if (pid){ history.replaceState(null, "", open ? `#place/${pid}` : `#places`); }
});

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-comments');
  if (!btn) return;
  const pid = Number(btn.dataset.pid);
  const card = btn.closest('.card');
  const wrap = card.querySelector('.comments-wrap');
  if (wrap.hidden) {
    wrap.hidden = false;
    const list = wrap.querySelector('.comments-list');
    list.textContent = currentLang==="tr" ? 'Yükleniyor…' : 'Loading…';
    const items = await fetchComments(pid);
    list.innerHTML = items.length
      ? items.map(c => `
          <div class="comment" style="padding:.4rem 0;border-bottom:1px dashed #0004;">
            <p>${escapeHtml(c.body)}</p>
            <small class="muted">${new Date(c.createdAt).toLocaleString()}</small>
          </div>
        `).join('')
      : `<div class="muted">${currentLang==="tr"?'Henüz onaylı yorum yok.':'No approved comments yet.'}</div>`;
    history.replaceState(null, "", `#place/${pid}`);
  } else {
    wrap.hidden = true;
    history.replaceState(null, "", `#places`);
  }
});

document.addEventListener('submit', async (e) => {
  const form = e.target.closest('.comment-form');
  if (!form) return;
  e.preventDefault();
  const wrap = form.closest('.comments-wrap');
  const pid = Number(wrap.dataset.pid);
  const body = (form.body.value || '').trim();
  if (body.length < 3) return;
  const ok = await submitComment(pid, body);
  if (ok) { form.reset(); alert(currentLang==="tr"?'Yorumunuz moderasyona gönderildi.':'Your comment is sent for moderation.'); }
});

// Öne çıkanlar
function renderFeatured(){
  if (!featuredPool.length) buildFeaturedPool();
  const grid = $("#featured-grid"); if (!grid) return;
  grid.innerHTML = "";
  const slice = pickWindow(featuredPool, featuredOffset, 4);
  featuredOffset = (featuredOffset + 4) % (featuredPool.length || 1);

  for (const p of slice){
    const raw = (p.imageUrl||"").replace(/^\/+/, "");
    const abs = /^https?:\/\//i.test(raw);
    const img = raw ? (abs?raw:raw) : "https://picsum.photos/800/500?blur=1";
    const tags = (getTags(p) || "").replaceAll(",", " · ");
    const card = document.createElement("article");
    card.className="card";
    card.innerHTML = `
      <img src="${img}" alt="${escapeAttr(p.name)}"
           onerror="this.onerror=null;this.src='https://picsum.photos/800/500?blur=1'">
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(tags)}</p>
        <div class="card-actions">
          <a class="btn small outline" href="#places">${t("home.details")}</a>
        </div>
      </div>`;
    grid.appendChild(card);
  }
}

// ================== HARİTA ==================
let map, routingControl, userLatLng=null, lastMarker=null;
const DIYARBAKIR_BOUNDS_OBJ = { minLat:35.80, maxLat:42.10, minLng:26.00, maxLng:45.00 };
const DIYA_BOUNDS = L.latLngBounds(
  L.latLng(DIYARBAKIR_BOUNDS_OBJ.minLat,DIYARBAKIR_BOUNDS_OBJ.minLng),
  L.latLng(DIYARBAKIR_BOUNDS_OBJ.maxLat,DIYARBAKIR_BOUNDS_OBJ.maxLng)
);
const DIYARBAKIR = { lat:39.00, lng:35.00 };
const inBounds = (p)=> p && p.lat>=DIYARBAKIR_BOUNDS_OBJ.minLat && p.lat<=DIYARBAKIR_BOUNDS_OBJ.maxLat &&
                       p.lng>=DIYARBAKIR_BOUNDS_OBJ.minLng && p.lng<=DIYARBAKIR_BOUNDS_OBJ.maxLng;

function ensureMap(){
  const el = $("#map-canvas");
  if (!el) return;
  if (map) { try{ map.invalidateSize(true); }catch{} return; }

  map = L.map(el, { maxBounds: DIYA_BOUNDS, maxBoundsViscosity: 0.7, preferCanvas:true }).setView(DIYARBAKIR, 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  map.whenReady(()=>{ try{ map.invalidateSize(true); }catch{} });

  $("#use-my-location")?.addEventListener("click", ()=>{
    if (!navigator.geolocation) return alert(t("map.noGeo"));
    navigator.geolocation.getCurrentPosition((pos)=>{
      userLatLng = { lat:pos.coords.latitude, lng:pos.coords.longitude };
      if (!inBounds(userLatLng)) return alert(t("map.out"));
      $("#from").value = t("map.myLoc");
      map.setView(userLatLng, 14);
      if (lastMarker) map.removeLayer(lastMarker);
      lastMarker = L.circleMarker(userLatLng, { radius:6 }).addTo(map).bindPopup(t("map.myLoc"));
    }, (err)=>{
      console.warn("Geolocation:", err);
      alert(t("map.geoErr"));
    }, { enableHighAccuracy:true, timeout:10000 });
  });

  $(".directions-form")?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fromVal = $("#from").value.trim();
    const toVal   = $("#to").value.trim();
    const mode    = $("#mode").value;
    await planAndDrawRoute(fromVal, toVal, mode);
  });
}

async function resolveLocation(text){
  if (!text) return null;
  const myLocs = [I18N.tr.map.myLoc.toLowerCase(), I18N.en.map.myLoc.toLowerCase()];
  if (myLocs.includes(text.toLowerCase()) && userLatLng) return userLatLng;

  const vb = [DIYARBAKIR_BOUNDS_OBJ.minLng,DIYARBAKIR_BOUNDS_OBJ.minLat,DIYARBAKIR_BOUNDS_OBJ.maxLng,DIYARBAKIR_BOUNDS_OBJ.maxLat].join(",");
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&accept-language=${currentLang}&bounded=1&viewbox=${vb}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers:{ "Accept":"application/json" }});
  const data = await res.json();
  if (Array.isArray(data) && data.length){
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

function createRouterForMode(mode){
  const cfg = {
    walking:{ serviceUrl:"https://routing.openstreetmap.de/routed-foot/route/v1", profile:"foot" },
    cycling:{ serviceUrl:"https://routing.openstreetmap.de/routed-bike/route/v1", profile:"bike" },
    driving:{ serviceUrl:"https://routing.openstreetmap.de/routed-car/route/v1",  profile:"driving" }
  }[mode] || { serviceUrl:"https://routing.openstreetmap.de/routed-foot/route/v1", profile:"foot" };
  return L.Routing.osrmv1({ serviceUrl: cfg.serviceUrl, profile: cfg.profile });
}

async function planAndDrawRoute(fromText, toText, mode){
  const routeOutput = $("#route-output");
  try{
    const origin = await resolveLocation(fromText);
    const dest   = await resolveLocation(toText);
    if (!origin || !dest){ routeOutput.innerHTML = `<div class="summary">${t("map.notFound")}</div>`; return; }
    if (!inBounds(origin) || !inBounds(dest)){ routeOutput.innerHTML = `<div class="summary">${t("map.onlyCity")}</div>`; return; }
    drawRoute(origin, dest, mode);
  }catch(e){
    console.error(e); routeOutput.innerHTML = `<div class="summary">${t("map.fail")}</div>`;
  }
}

function drawRoute(origin, destination, mode){
  const routeOutput = $("#route-output");
  if (routingControl){ map.removeControl(routingControl); routingControl=null; }
  routingControl = L.Routing.control({
    waypoints: [ L.latLng(origin.lat,origin.lng), L.latLng(destination.lat,destination.lng) ],
    router: createRouterForMode(mode),
    lineOptions: { styles:[{ color:"#2bd074", weight:6, opacity:0.9 }] },
    addWaypoints:false, draggableWaypoints:false, fitSelectedRoutes:true, show:false,
    altLineOptions:{ styles:[{ opacity:0.4, weight:6 }] }
  }).on("routesfound",(e)=>{
    const r=e.routes[0]; const distKm=(r.summary.totalDistance/1000).toFixed(1)+" "+t("map.km");
    const durMin=Math.round(r.summary.totalTime/60)+" "+t("map.min");
    routeOutput.innerHTML = `<div class="summary"><strong>${t("map.total")}</strong> ${distKm} • ${durMin}</div>`;
  }).on("routingerror",()=>{
    routeOutput.innerHTML = `<div class="summary">${t("map.noRoute")}</div>`;
  }).addTo(map);
}
