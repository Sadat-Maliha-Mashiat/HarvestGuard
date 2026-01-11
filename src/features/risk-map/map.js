/* B1 final script — bilingual (bn/en) */


// ---------- Config ----------
const OPENWEATHER_API_KEY = "83d0172bfdd2a9497f8dfefeeda4a6a6";
const DEFAULT_DISTRICT = "Chittagong";

// district centers
const DISTRICT_CENTERS = {
  Dhaka: [23.8103, 90.4125],
  Chittagong: [22.3569, 91.7832],
  Chattogram: [22.3569, 91.7832],
  Sylhet: [24.8949, 91.8687],
  Rajshahi: [24.3636, 88.6241],
  Barisal: [22.7010, 90.3535],
  Rangpur: [25.7439, 89.2752],
  Khulna: [22.8456, 89.5403],
  Mymensingh: [24.7471, 90.4203]
};

// Bangla labels
const DISTRICT_LABELS_BN = {
  Dhaka: 'ঢাকা',
  Chittagong: 'চট্টগ্রাম',
  Chattogram: 'চট্টগ্রাম',
  Sylhet: 'সিলেট',
  Rajshahi: 'রাজশাহী',
  Barisal: 'বরিশাল',
  Rangpur: 'রংপুর',
  Khulna: 'খুলনা',
  Mymensingh: 'ময়মনসিংহ'
};

// ---------- Translations ----------
const TXT = {
  bn: {
    title: 'HarvestGuard — লোকাল রিস্ক ম্যাপ',
    refresh: 'রিফ্রেশ',
    export: 'Export JSON',
    panel: 'প্রোফাইল / Farmer',
    noProfile: 'কোনো প্রোফাইল লোড নেই — A2 থেকে লগইন/নিবন্ধন করলে স্বয়ংক্রিয় আপডেট হবে।',
    batchList: 'ব্যাচ তালিকা',
    loadDemo: 'ডেমো লোড করুন',
    clearLocal: 'লোকাল ক্লিয়ার',
    legend: 'ঝুঁকি',
    legendLow: 'কম',
    legendMed: 'মাঝারি',
    legendHigh: 'উচ্চ',
    legendFarmer: 'আপনি',
    districtLabel: 'জেলা:',
    filterAll: 'সব',
    filterLow: 'কম',
    filterMed: 'মাঝারি',
    filterHigh: 'উচ্চ',
    statusLoading: 'লোড হচ্ছে...',
    statusReady: 'রেডি',
    noBatches: 'কোনো ব্যাচ নেই',
    batchHarvest: 'Harvest',
    batchStorage: 'Storage',
    batchETCL: 'ETCL',
    warningHigh: 'সতর্কতা: উচ্চ ঝুঁকি সনাক্ত!',
    footer: 'Tap markers for details • Offline via LocalStorage'
  },

  en: {
    title: 'HarvestGuard — Local Risk Map',
    refresh: 'Refresh',
    export: 'Export JSON',
    panel: 'Profile / Farmer',
    noProfile: 'No profile loaded — login/register in A2.',
    batchList: 'Batch list',
    loadDemo: 'Load Demo Farmer',
    clearLocal: 'Clear Local',
    legend: 'Risk',
    legendLow: 'Low',
    legendMed: 'Medium',
    legendHigh: 'High',
    legendFarmer: 'Farmer',
    districtLabel: 'District:',
    filterAll: 'All',
    filterLow: 'Low',
    filterMed: 'Medium',
    filterHigh: 'High',
    statusLoading: 'loading...',
    statusReady: 'ready',
    noBatches: 'No batches',
    batchHarvest: 'Harvest',
    batchStorage: 'Storage',
    batchETCL: 'ETCL',
    warningHigh: 'Warning: HIGH risk detected!',
    footer: 'Tap markers for details • Offline via LocalStorage'
  }
};

// ---------- State ----------
let lang = localStorage.getItem('HG_LANG') || 'bn';
let HG_USER = null;
let HG_BATCHES = [];
let map = null;
let farmerMarker = null;
let neighborMarkers = [];
let riskZones = [];
let neighbors = [];

// ---------- DOM (safe) ----------
function $id(id) { return document.getElementById(id); }
const dom = {
  langToggle: $id('langToggle'),
  refreshBtn: $id('refreshBtn'),
  exportBtn: $id('exportBtn'),
  districtSelect: $id('districtSelect'),
  batchListEl: $id('batchList'),
  profileDetailsEl: $id('profileDetails'),
  noProfileEl: $id('noProfile'),
  pName: $id('pName'),
  pPhone: $id('pPhone'),
  pEmail: $id('pEmail'),
  pDistrict: $id('pDistrict'),
  statusBar: $id('statusBar'),
  appTitle: $id('appTitle'),
  panelTitle: $id('panelTitle'),
  batchTitle: $id('batchTitle'),
  legendLow: document.querySelector('.legend-low'),
  legendMed: document.querySelector('.legend-medium'),
  legendHigh: document.querySelector('.legend-high'),
  legendFarmer: document.querySelector('.legend-farmer'),
  districtLabel: $id('districtLabel'),
  footerText: $id('footerText'),
  openDummy: $id('openDummy'),
  clearLocal: $id('clearLocal'),
  legendTitle: $id('legendTitle'),
  filterBtns: document.querySelectorAll('.filterBtn')
};

// ---------- Helpers ----------
function t(key) {
  return (TXT[lang] && TXT[lang][key]) ? TXT[lang][key] : key;
}

// fixed bangla number map
function toBanglaNumber(n) {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  return String(n).split('').map(x => map[x] || x).join('');
}

function safeDistrictKey(name) {
  if (!name) return null;
  if (DISTRICT_CENTERS[name]) return name;
  const s = name.toLowerCase();
  if (s.includes('chitt') || s.includes('chatt')) return 'Chittagong';
  if (s.includes('dhaka')) return 'Dhaka';
  return null;
}

// ---------- UI ----------
function renderUI() {
  if (!dom.appTitle) return;

  dom.appTitle.textContent = t('title');
  if (dom.refreshBtn) dom.refreshBtn.textContent = t('refresh');
  if (dom.exportBtn) dom.exportBtn.textContent = t('export');

  if (dom.panelTitle) dom.panelTitle.textContent = t('panel');
  if (dom.batchTitle) dom.batchTitle.textContent = t('batchList');
  if (dom.legendTitle) dom.legendTitle.textContent = t('legend');

  if (dom.legendLow) dom.legendLow.textContent = t('legendLow');
  if (dom.legendMed) dom.legendMed.textContent = t('legendMed');
  if (dom.legendHigh) dom.legendHigh.textContent = t('legendHigh');
  if (dom.legendFarmer) dom.legendFarmer.textContent = t('legendFarmer');

  if (dom.districtLabel) dom.districtLabel.textContent = t('districtLabel');
  if (dom.footerText) dom.footerText.textContent = t('footer');

  // district select rebuild
  const current = (dom.districtSelect && dom.districtSelect.value) ? dom.districtSelect.value : DEFAULT_DISTRICT;
  if (dom.districtSelect) {
    dom.districtSelect.innerHTML = '';
    Object.keys(DISTRICT_CENTERS).forEach(k => {
      if (k === 'Chattogram') return;
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = (lang === 'bn' ? (DISTRICT_LABELS_BN[k] || k) : k);
      dom.districtSelect.appendChild(opt);
    });
    dom.districtSelect.value = current;
  }

  // filter buttons labels
  const fAll = $id('fAll'), fLow = $id('fLow'), fMed = $id('fMed'), fHigh = $id('fHigh');
  if (fAll) fAll.textContent = t('filterAll');
  if (fLow) fLow.textContent = t('filterLow');
  if (fMed) fMed.textContent = t('filterMed');
  if (fHigh) fHigh.textContent = t('filterHigh');
}

// ---------- Init UI events ----------
function initUI() {
  if (dom.langToggle) dom.langToggle.value = lang;
  if (dom.langToggle) dom.langToggle.addEventListener('change', () => {
    lang = dom.langToggle.value;
    localStorage.setItem('HG_LANG', lang);
    renderUI();
    renderProfile();
    renderNeighbors(neighbors);
    if (farmerMarker) bindFarmerPopup();
  });

  if (dom.refreshBtn) dom.refreshBtn.addEventListener('click', () => loadAndRender(true));
  if (dom.exportBtn) dom.exportBtn.addEventListener('click', exportJSON);

  if (dom.districtSelect) dom.districtSelect.addEventListener('change', () => {
    const key = safeDistrictKey(dom.districtSelect.value) || DEFAULT_DISTRICT;
    if (map) map.setView(DISTRICT_CENTERS[key], 10);
  });

  // filter btns
  const btns = document.querySelectorAll('.filterBtn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const r = btn.dataset.risk;
      if (r === 'All') renderNeighbors(neighbors);
      else renderNeighbors(neighbors.filter(n => n.risk === r));
    });
  });

  if (dom.openDummy) dom.openDummy.addEventListener('click', loadDemo);
  if (dom.clearLocal) dom.clearLocal.addEventListener('click', () => {
    if (confirm(lang === 'bn' ? 'লোকাল ডাটা মুছে ফেলতে চান?' : 'Clear local HG user & batches?')) {
      localStorage.removeItem('HG_ACTIVE_USER');
      localStorage.removeItem('HG_ACTIVE_BATCHES');
      loadAndRender();
    }
  });
}

// ---------- Map ----------
function initMap(center) {
  if (map) map.remove();
  map = L.map('map').setView(center, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OSM'
  }).addTo(map);
}

// default farmer icon restoring!
const farmerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function bindFarmerPopup(rep) {
  if (!farmerMarker) return;

  let html = "";
  if (HG_USER) {
    html += `<b>${HG_USER.name}</b><br>`;
  }
  if (rep) {
    const et = (lang === 'bn') ? toBanglaNumber(rep.etcl) + " ঘন্টা" : rep.etcl + " hrs";
    const riskTxt = (rep.risk === 'High') ? (lang === 'bn' ? 'উচ্চ' : 'High') :
      (rep.risk === 'Medium') ? (lang === 'bn' ? 'মাঝারি' : 'Medium') :
        (lang === 'bn' ? 'কম' : 'Low');
    html += `${t('batchHarvest')}: ${rep.date}<br>`;
    html += `${lang === 'bn' ? 'ফসল' : 'Crop'}: ${rep.cropType}<br>`;
    html += `${t('batchETCL')}: ${et}<br>`;
    html += `${lang === 'bn' ? 'ঝুঁকি' : 'Risk'}: ${riskTxt}`;
  }
  farmerMarker.bindPopup(html);
}

// ---------- Load A2 ----------
function loadA2Local() {
  try {
    const u = localStorage.getItem('HG_ACTIVE_USER');
    const b = localStorage.getItem('HG_ACTIVE_BATCHES');
    HG_USER = u ? JSON.parse(u) : null;
    HG_BATCHES = b ? JSON.parse(b) : [];
  } catch (e) { HG_USER = null; HG_BATCHES = []; }
}

// ---------- Weather ----------
async function fetchWeatherForDistrict(d) {
  const key = safeDistrictKey(d) || DEFAULT_DISTRICT;
  const city = encodeURIComponent(key + ',BD');
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 10) return mockWeather(key);
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${OPENWEATHER_API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return mockWeather(key);
    const data = await r.json();
    const obj = data.list && data.list[0];
    if (obj) return { temp: obj.main.temp, humidity: obj.main.humidity };
    return mockWeather(key);
  } catch (e) {
    return mockWeather(key);
  }
}

function mockWeather(k) {
  let s = 0; for (let c of k) s += c.charCodeAt(0);
  return { temp: 25 + (s % 10), humidity: 60 + (s % 20) };
}

// ---------- ETCL ----------
function computeETCLForBatch(batch, weather) {
  const days = Math.floor((Date.now() - new Date(batch.date)) / 86400000);
  let fac = 1;

  if (weather.humidity > 80) fac += 1.5;
  else if (weather.humidity > 70) fac += 1.0;
  else if (weather.humidity > 60) fac += 0.5;

  if (weather.temp > 35) fac += 1;
  else if (weather.temp > 30) fac += 0.6;

  if (batch.storage?.toLowerCase().includes('open')) fac += 0.8;
  if (batch.storage?.toLowerCase().includes('jute')) fac += 0.4;

  fac += days * 0.02;

  const et = Math.max(8, Math.round(240 / fac));

  let risk = 'Low';
  if (et <= 48) risk = 'High';
  else if (et <= 120) risk = 'Medium';

  return { etcl: et, risk };
}

// ---------- Neighbors ----------
function generateNeighbors(center, count) {
  neighbors = [];
  for (let i = 0; i < count; i++) {
    neighbors.push({
      id: "n" + Math.random(),
      lat: center[0] + (Math.random() - 0.5) * 0.18,
      lng: center[1] + (Math.random() - 0.5) * 0.18,
      cropBn: pick(['ধান', 'আলু', 'গম', 'সবজি']),
      risk: pick(['Low', 'Medium', 'High', 'Low', 'Medium']),
      updateBn: pick(['৩০ মিনিট আগে', '২ ঘন্টা আগে', '১ দিন আগে'])
    });
  }
}

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

// ---------- Render Profile ----------
function renderProfile() {
  renderUI();

  if (!HG_USER) {
    if (dom.noProfileEl) { dom.noProfileEl.style.display = 'block'; dom.noProfileEl.textContent = t('noProfile'); }
    if (dom.profileDetailsEl) dom.profileDetailsEl.style.display = 'none';
    if (dom.batchListEl) dom.batchListEl.innerHTML = '';
    return;
  }

  if (dom.noProfileEl) dom.noProfileEl.style.display = 'none';
  if (dom.profileDetailsEl) dom.profileDetailsEl.style.display = 'block';

  if (dom.pName) dom.pName.textContent = HG_USER.name || '';
  if (dom.pPhone) dom.pPhone.textContent = "📞 " + (HG_USER.phone || '');
  if (dom.pEmail) dom.pEmail.textContent = "✉️ " + (HG_USER.email || '');
  if (dom.pDistrict) dom.pDistrict.textContent = "🗺 " + (lang === 'bn' ? (DISTRICT_LABELS_BN[safeDistrictKey(HG_USER.district)] || HG_USER.district) : (HG_USER.district || ''));

  if (!dom.batchListEl) return;
  dom.batchListEl.innerHTML = "";
  if (!HG_BATCHES.length) {
    dom.batchListEl.innerHTML = `<div class="muted">${t('noBatches')}</div>`;
    return;
  }

  HG_BATCHES.forEach(b => {
    const card = document.createElement('div');
    card.className = 'card';

    const riskColor = (b.risk === 'High') ? '#e74c3c' : (b.risk === 'Medium') ? '#f39c12' : '#2ecc71';
    const riskTxt = (lang === 'bn' ?
      (b.risk === 'High' ? 'উচ্চ' : b.risk === 'Medium' ? 'মাঝারি' : 'কম')
      : b.risk);

    const etTxt = (b.etcl !== undefined) ? (lang === 'bn' ? toBanglaNumber(b.etcl) + " ঘন্টা" : b.etcl + " hrs") : '-';

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;">
        <b>${b.cropType}</b> • ${b.weight || ''}kg
        <span style="padding:4px;border-radius:6px;color:#fff;background:${riskColor};">${riskTxt}</span>
      </div>
      <div class="muted">${t('batchHarvest')}: ${b.date || '-'} • ${t('batchStorage')}: ${b.storage || '-'}</div>
      <div class="muted">${t('batchETCL')}: ${etTxt}</div>
    `;
    dom.batchListEl.appendChild(card);
  });
}

// ---------- Map render ----------
function clearNeighborLayers() {
  neighborMarkers.forEach(m => { if (map && m) map.removeLayer(m); });
  riskZones.forEach(z => { if (map && z) map.removeLayer(z); });
  neighborMarkers = []; riskZones = [];
}

function renderNeighbors(list) {
  if (!map) return;
  clearNeighborLayers();

  list.forEach(n => {
    const color = (n.risk === 'High') ? '#e74c3c' : (n.risk === 'Medium') ? '#f39c12' : '#2ecc71';

    const m = L.circleMarker([n.lat, n.lng], {
      radius: 8,
      color,
      fillColor: color,
      fillOpacity: 0.85
    }).addTo(map);

    const riskTxt = (lang === 'bn' ?
      (n.risk === 'High' ? 'উচ্চ' : n.risk === 'Medium' ? 'মাঝারি' : 'কম')
      : n.risk);

    m.bindPopup(`
      <b>${lang === 'bn' ? 'ফসল' : 'Crop'}:</b> ${n.cropBn}<br>
      <b>${lang === 'bn' ? 'ঝুঁকি' : 'Risk'}:</b> ${riskTxt}<br>
      <small>${n.updateBn}</small>
    `);

    neighborMarkers.push(m);

    // zone
    const z = L.circle([n.lat, n.lng], {
      radius: 1200,
      color,
      fillColor: color,
      fillOpacity: 0.08,
      weight: 1
    }).addTo(map);

    riskZones.push(z);
  });
}

// ---------- Influence ----------
function influenceNeighborsByRisk(risk) {
  if (!neighbors || !neighbors.length) return;
  if (risk === 'High') {
    neighbors.slice(0, 4).forEach(n => n.risk = 'High');
  } else if (risk === 'Medium') {
    neighbors.slice(0, 6).forEach(n => { if (n.risk !== 'High') n.risk = 'Medium'; });
  }
}

// ---------- Farmer marker ----------
function updateFarmerMarker(center, rep) {
  if (!map || !center) return;
  if (farmerMarker) { try { map.removeLayer(farmerMarker); } catch (e) { } }
  farmerMarker = L.marker(center, { icon: farmerIcon }).addTo(map);
  bindFarmerPopup(rep);
}

// ---------- Main ----------
async function loadAndRender(force = false) {
  if (dom.statusBar) dom.statusBar.textContent = t('statusLoading');

  loadA2Local();
  renderProfile();

  let centerKey = null;
  if (HG_BATCHES && HG_BATCHES.length) centerKey = safeDistrictKey(HG_BATCHES.at(-1).district);
  if (!centerKey && HG_USER) centerKey = safeDistrictKey(HG_USER.district);
  if (!centerKey) centerKey = DEFAULT_DISTRICT;

  let center = DISTRICT_CENTERS[centerKey] || DISTRICT_CENTERS[DEFAULT_DISTRICT];

  // Real Location Integration
  if (navigator.geolocation && (force || !map)) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, enableHighAccuracy: true });
      });
      center = [pos.coords.latitude, pos.coords.longitude];
      console.log("Real location acquired:", center);
    } catch (e) {
      console.warn("Geolocation permission denied or timed out. Falling back to district center.", e);
    }
  }

  if (!map) initMap(center);
  else if (force) map.setView(center, 12);

  renderUI();

  // Generate 15 neighbors around the current center (Real or fallback)
  generateNeighbors(center, 15);

  if (!HG_BATCHES || !HG_BATCHES.length) {
    renderNeighbors(neighbors);
    if (HG_USER) updateFarmerMarker(center, null);
    if (dom.statusBar) dom.statusBar.textContent = t('statusReady');
    return;
  }

  const weather = await fetchWeatherForDistrict(centerKey);

  let rep = null;
  HG_BATCHES.forEach(b => {
    const r = computeETCLForBatch(b, weather);
    b.etcl = r.etcl;
    b.risk = r.risk;
    if (!rep || b.etcl < rep.etcl) rep = b;
  });

  try { localStorage.setItem('HG_ACTIVE_BATCHES', JSON.stringify(HG_BATCHES)); } catch (e) { }

  updateFarmerMarker(center, rep);

  influenceNeighborsByRisk(rep.risk);
  renderNeighbors(neighbors);
  renderProfile();

  if (rep && rep.risk === 'High') alert(t('warningHigh'));

  if (dom.statusBar) dom.statusBar.textContent = t('statusReady');
}

// ---------- Export ----------
function exportJSON() {
  const payload = { user: HG_USER, batches: HG_BATCHES, neighbors };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'harvestguard_export.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Demo ----------
function loadDemo() {
  HG_USER = { name: 'Demo Farmer', phone: '01700000000', email: 'demo@local', district: 'Chittagong' };
  HG_BATCHES = [
    { date: '2025-11-26', cropType: 'Rice', weight: 1200, district: 'Chittagong', storage: 'JuteBag' },
    { date: '2025-11-17', cropType: 'Potato', weight: 800, district: 'Chittagong', storage: 'Open Yard' }
  ];
  try {
    localStorage.setItem('HG_ACTIVE_USER', JSON.stringify(HG_USER));
    localStorage.setItem('HG_ACTIVE_BATCHES', JSON.stringify(HG_BATCHES));
  } catch (e) { }
  loadAndRender(true);
}

// ---------- Start ----------
function init() {
  initUI();
  renderUI();
  loadAndRender();
}
init();
