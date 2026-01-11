/* ==================================================
   HarvestGuard Premium Management Logic (Auth-Free)
   ================================================== */

// --- 1. CONFIG & DB INIT ---
const CONFIG = {
    SUPABASE_URL: "https://kujlpumfgeaumwvvexyv.supabase.co",
    SUPABASE_KEY: "sb_publishable_CvVT-dyGlLvhlB6tQZEp5Q_3S_V-2l0"
};

let supabase = null;
let isConnected = false;
// Guest User by default
let currentUser = {
    phone: "Guest",
    name: "Guest Farmer",
    division: "Dhaka",
    district: "Dhaka"
};
let currentLang = localStorage.getItem('HG_LANG') || 'en';

try {
    if (window.supabase) {
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    }
} catch (e) {
    console.error("Supabase fail", e);
}

// --- 2. TRANSLATIONS ---
const i18n = i18n_data = {
    en: {
        title: "HarvestGuard Portal",
        welcome: "Welcome",
        offline_note: "Running in Offline Mode (Local Storage)",
        batch_title: "My Harvest Lots",
        add_batch: "Record New Harvest",
        no_batches: "No harvest lots recorded yet.",
        weight: "Weight (kg)",
        crop: "Crop Type",
        storage: "Storage Method",
        date: "Harvest Date",
        btn_save: "Save Record"
    },
    bn: {
        title: "হার্ভেস্টগার্ড পোর্টাল",
        welcome: "স্বাগতম",
        offline_note: "অফলাইন মোডে চলছে (লোকাল স্টোরেজ)",
        batch_title: "আমার ফসলসমূহ",
        add_batch: "নতুন ফসল যোগ করুন",
        no_batches: "এখনো কোনো ফসল রেকর্ড করা হয়নি।",
        weight: "ওজন (কেজি)",
        crop: "ফসলের ধরন",
        storage: "সংরক্ষণের পদ্ধতি",
        date: "কাটার তারিখ",
        btn_save: "সংরক্ষণ করুন"
    }
};

// --- 3. CORE LOGIC ---

async function checkConnection() {
    console.log("Checking connection...");
    try {
        if (!window.supabase) throw new Error("Library not loaded");
        if (!supabase) supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 4000));
        const check = supabase.from('users').select('count', { count: 'exact', head: true }).limit(1);
        const { error } = await Promise.race([check, timeout]);

        isConnected = !error;
    } catch (e) {
        isConnected = false;
    }
    renderStatus();
}

function renderStatus() {
    const el = document.getElementById('status-indicator');
    if (!el) return;
    el.innerHTML = isConnected
        ? `<span style="color:#2ecc71">● Online</span>`
        : `<span style="color:#e74c3c">● Offline Mode</span>`;
}

function translateUI() {
    const lang = i18n[currentLang];
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (lang[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                if (el.placeholder !== undefined) el.placeholder = lang[key];
            } else {
                el.textContent = lang[key];
            }
        }
    });
}

function showView(id) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
}

// --- 4. DASHBOARD & BATCHES ---

async function loadDashboard() {
    showView('screen-dashboard');
    document.getElementById('display-name').textContent = currentUser.name;
    document.getElementById('display-phone').textContent = currentUser.phone;
    document.getElementById('display-loc').textContent = `${currentUser.district}, ${currentUser.division}`;
    renderBatches();
}

async function renderBatches() {
    const container = document.getElementById('batch-list');
    if (!container) return;
    container.innerHTML = '<div class="loader"></div>';

    let batches = [];
    try {
        if (isConnected) {
            const { data } = await supabase.from('batches').select('*').eq('phone', currentUser.phone);
            batches = data || [];
        } else {
            const allBatches = JSON.parse(localStorage.getItem('HG_BATCHES') || '[]');
            batches = allBatches.filter(b => b.phone === currentUser.phone);
        }

        container.innerHTML = '';
        if (batches.length === 0) {
            container.innerHTML = `<p class="muted" data-t="no_batches">${i18n[currentLang].no_batches}</p>`;
        } else {
            batches.forEach(b => {
                const card = document.createElement('div');
                card.className = 'batch-card';
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between">
                        <strong>${b.cropType}</strong>
                        <span>${b.weight} kg</span>
                    </div>
                    <div class="muted" style="font-size:0.8rem">
                        📅 ${b.date} | 📦 ${b.storage}
                    </div>
                `;
                container.appendChild(card);
            });
        }
    } catch (e) {
        container.innerHTML = 'Error loading batches.';
    }
}

window.saveBatch = async function (e) {
    e.preventDefault();
    const batch = {
        phone: currentUser.phone,
        cropType: document.getElementById('b-crop').value,
        weight: document.getElementById('b-weight').value,
        date: document.getElementById('b-date').value,
        storage: document.getElementById('b-storage').value,
        division: currentUser.division,
        district: currentUser.district
    };

    try {
        if (isConnected) {
            await supabase.from('batches').insert([batch]);
        } else {
            const all = JSON.parse(localStorage.getItem('HG_BATCHES') || '[]');
            all.push(batch);
            localStorage.setItem('HG_BATCHES', JSON.stringify(all));
        }
        e.target.reset();
        renderBatches();
        alert("Batch Saved!");
    } catch (e) { alert("Error saving batch"); }
}

window.toggleLang = function () {
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    localStorage.setItem('HG_LANG', currentLang);
    translateUI();
    loadDashboard();
}

// --- 5. AUTO INIT ---
document.addEventListener('DOMContentLoaded', () => {
    translateUI();
    checkConnection();
    loadDashboard();

    // Set default date
    const dateIn = document.getElementById('b-date');
    if (dateIn) dateIn.value = new Date().toISOString().split('T')[0];
});
