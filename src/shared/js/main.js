document.addEventListener('DOMContentLoaded', function () {
  // === STICKY HEADER ===
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 5);
    });
  }

  // === THREE.JS 3D MODEL ===
  const container = document.getElementById('threeD-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(2, 2, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/models/low_poly_farm_v2/low_poly_farm_v2.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.y = -1;
      scene.add(model);

      camera.position.set(0, 2, 15);

      function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    (error) => console.error('3D Model load error:', error)
  );

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // -----------------------------------
  // Feature Card Hover Effects (optional)
  // -----------------------------------
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseover', () => {
      const p = card.querySelector('p');
      if (p) p.style.color = '#228b2a'; // Change text color on hover
    });
    card.addEventListener('mouseout', () => {
      const p = card.querySelector('p');
      if (p) p.style.color = ''; // Reset text color
    });
  });

  // === Scroll to Features Section on "Get Started" Click ===
  document.getElementById("cta-button").addEventListener("click", () => {
    const target = document.getElementById("features-section");

    const topPos = target.getBoundingClientRect().top + window.pageYOffset - 60;

    window.scrollTo({
      top: topPos,
      behavior: "smooth"
    });
  });

  // No auth protection needed as per user request
  // All feature buttons remain functional as normal links defined in HTML


  // ------------------------------
  // Language change functionality
  // ------------------------------
  let currentLanguage = 'en'; // Default language

  const content = {
    en: {
      heroHeading: "Protect Your Harvest. Reduce Loss. Grow Smart.",
      heroSubheading: "Smart farm management, weather & crop health alerts — all in one place.",
      ctaButton: "Get Started",
      problemSolutionHeading: "Why It Matters",
      problemDescription: "In Bangladesh, millions of tons of food are lost every year due to poor storage, handling, and transportation.",
      solutionDescription: "Our solution helps reduce food loss by providing real-time weather updates, crop health monitoring, and efficient storage planning.",
      featuresHeading: "What We Offer",
      feature1Heading: "Farm Management & Tracking",
      feature1Description: "Track your farm’s harvest and storage details with our easy-to-use management system.",
      farmButton: "Farm Manager",
      feature2Heading: "Weather & Forecast Integration",
      feature2Description: "Get live weather data and forecasts to plan your harvest and storage effectively.",
      weatherButton: "See Weather",
      feature3Heading: "Risk Alerts & Notifications",
      feature3Description: "Receive timely alerts to protect your crops from spoilage or adverse weather conditions.",
      riskButton: "Risk Forecast",
      feature4Heading: "Interactive Risk Map",
      feature4Description: "View real-time risk zones on the map and track storage safety.",
      b1Button: "Open Risk Map",
      howItWorksHeading: "How It Works",
      step1Heading: "Step 1: Register Your Farm",
      step1Description: "Enter your farm details and map your crops.",
      step2Heading: "Step 2: Monitor & Receive Alerts",
      step2Description: "Get real-time weather data and health alerts for your crops.",
      step3Heading: "Step 3: Harvest & Store Safely",
      step3Description: "Follow recommendations to reduce loss and improve yield.",
      ctaHeading: "Ready to Get Started?",
      ctaDescription: "Join the movement to reduce food loss and increase farm productivity. Sign up today!",
      ctaRegister: "Register Now",

      // NEW: Why Different
      whyHeading: "Why HarvestGuard is Different",
      whyItem1Heading: "Hyper-Local Weather Engine",
      whyItem1Description: "Uses location-based forecasts for specific villages and unions (where available), instead of generic district-level information.",
      whyItem2Heading: "Smart Risk Scoring",
      whyItem2Description: "Combines crop type, harvest date, storage method, and upcoming weather to estimate spoilage risk for each stored lot.",
      whyItem3Heading: "Actionable, Farmer-Friendly Advice",
      whyItem3Description: "Turns complex data into simple steps like “Harvest within 2 days”, “Extend drying by 1 day”, or “Move sacks to a drier place.”",

      // NEW: Dashboard
      dashboardHeading: "Sample Dashboard",
      dashboardCard1Title: "Today’s Overview",
      dashboardCard1Item1: "Location: Komorpur, Cumilla",
      dashboardCard1Item2: "Crop: Boro rice",
      dashboardCard1Item3: "Risk Level: Medium (High humidity expected tonight)",
      dashboardCard1Item4: "Action: Move dried grain under cover within 12 hours.",
      dashboardCard2Title: "3-Day Weather & Risk",
      dashboardCard2Item1: "Day 1: Light rain in evening – Safe to harvest in morning.",
      dashboardCard2Item2: "Day 2: High humidity – Extend drying time by 1 day.",
      dashboardCard2Item3: "Day 3: Heavy rain – Avoid harvesting; protect stored grain.",
      dashboardCard3Title: "Storage Lots",
      dashboardCard3Item1: "Lot #01: 800 kg paddy – Tin shed – Risk: Low",
      dashboardCard3Item2: "Lot #02: 500 kg paddy – Open veranda – Risk: High",
      dashboardCard3Item3: "Suggested Action: Move Lot #02 to covered storage.",

      // NEW: FAQ
      faqHeading: "Frequently Asked Questions",
      faqQ1: "Who is HarvestGuard for?",
      faqA1: "Small and medium farmers, local aggregators, cooperatives, NGOs and agri-startups working to reduce post-harvest loss.",
      faqQ2: "What data does HarvestGuard use?",
      faqA2: "Farm location, crop type, harvest dates, storage details and weather data from trusted forecast providers.",
      faqQ3: "How will I receive alerts?",
      faqA3: "Alerts can be delivered through the web app, and can be extended to SMS or messaging apps depending on connectivity and project setup."
    },
    bn: {
      heroHeading: "আপনার ফসল রক্ষা করুন। ক্ষতি কমান। স্মার্টভাবে বেড়ে উঠুন।",
      heroSubheading: "স্মার্ট ফার্ম ম্যানেজমেন্ট, আবহাওয়া ও ফসল স্বাস্থ্য সতর্কতা — এক জায়গায়।",
      ctaButton: "শুরু করুন",
      problemSolutionHeading: "কেন এটি গুরুত্বপূর্ণ",
      problemDescription: "বাংলাদেশে প্রতিবছর কোটি কোটি টন খাবার ক্ষতি হয় অপর্যাপ্ত স্টোরেজ, হ্যান্ডলিং এবং পরিবহন ব্যবস্থার কারণে।",
      solutionDescription: "আমাদের সমাধান আবহাওয়া আপডেট, ফসল স্বাস্থ্য মনিটরিং এবং কার্যকরী স্টোরেজ পরিকল্পনার মাধ্যমে খাদ্য ক্ষতি কমাতে সহায়ক।",
      featuresHeading: "আমরা যা অফার করি",
      feature1Heading: "ফার্ম ম্যানেজমেন্ট ও ট্র্যাকিং",
      feature1Description: "আমাদের ব্যবস্থাপনা সিস্টেমের মাধ্যমে আপনার ফসলের সংগ্রহ এবং স্টোরেজ তথ্য ট্র্যাক করুন।",
      farmButton: "ফার্ম ম্যানেজার দেখুন",
      feature2Heading: "আবহাওয়া ও পূর্বাভাস ইন্টিগ্রেশন",
      feature2Description: "আপনার ফসল এবং স্টোরেজ পরিকল্পনা করার জন্য লাইভ আবহাওয়া তথ্য ও পূর্বাভাস পান।",
      feature3Heading: "ঝুঁকি সতর্কতা ও নোটিফিকেশন",
      feature3Description: "আপনার ফসলের পচন বা অনুকূল নয় এমন আবহাওয়ার জন্য সময়মতো সতর্কতা পেতে নোটিফিকেশন পান।",
      howItWorksHeading: "এটি কীভাবে কাজ করে",
      step1Heading: "ধাপ ১: আপনার ফার্ম নিবন্ধন করুন",
      step1Description: "আপনার ফার্মের তথ্য দিন এবং আপনার ফসলগুলি ম্যাপ করুন।",
      step2Heading: "ধাপ ২: মনিটর করুন ও সতর্কতা পান",
      step2Description: "আপনার ফসলের জন্য সময়মতো আবহাওয়া ডেটা ও স্বাস্থ্য সতর্কতা পান।",
      weatherButton: "আবহাওয়া দেখুন",
      step3Heading: "ধাপ ৩: নিরাপদভাবে ফসল সংগ্রহ ও সংরক্ষণ করুন",
      step3Description: "ক্ষতি কমাতে এবং ফলন বাড়াতে সুপারিশ অনুসরণ করুন।",
      riskButton: "ঝুঁকি পূর্বাভাস",
      feature4Heading: "ইন্টারেক্টিভ রিস্ক ম্যাপ",
      feature4Description: "রিয়েল-টাইম রিস্ক জোন দেখুন এবং স্টোরেজ নিরাপত্তা যাচাই করুন।",
      b1Button: "রিস্ক ম্যাপ খুলুন",
      ctaHeading: "শুরু করতে প্রস্তুত?",
      ctaDescription: "খাদ্য ক্ষতি কমাতে এবং কৃষির উৎপাদনশীলতা বাড়াতে আমাদের সঙ্গে যোগ দিন। আজই নিবন্ধন করুন!",
      ctaRegister: "এখনই নিবন্ধন করুন",

      // NEW: Why Different
      whyHeading: "কেন হারভেস্টগার্ড আলাদা",
      whyItem1Heading: "হাইপার-লোকাল আবহাওয়া ইঞ্জিন",
      whyItem1Description: "শুধু জেলাভিত্তিক তথ্য নয়, (যেখানে সম্ভব) গ্রাম/ইউনিয়ন পর্যায়ের পূর্বাভাস ব্যবহার করে।",
      whyItem2Heading: "স্মার্ট ঝুঁকি স্কোরিং",
      whyItem2Description: "ফসলের ধরন, কাটার তারিখ, সংরক্ষণের পদ্ধতি ও আসন্ন আবহাওয়া মিলিয়ে প্রতিটি লটের নষ্ট হওয়ার ঝুঁকি হিসাব করে।",
      whyItem3Heading: "কৃষকবান্ধব নির্দেশনা",
      whyItem3Description: "জটিল ডেটাকে ভেঙে সহজ করণীয়ে পরিণত করে—যেমন “২ দিনের মধ্যে কাটুন”, “১ দিন বেশি শুকান” বা “বস্তা শুকনা ঘরে সরিয়ে নিন”।",

      // NEW: Dashboard
      dashboardHeading: "নমুনা ড্যাশবোর্ড",
      dashboardCard1Title: "আজকের সারসংক্ষেপ",
      dashboardCard1Item1: "অবস্থান: কমরপুর, কুমিলা",
      dashboardCard1Item2: "ফসল: বোরো ধান",
      dashboardCard1Item3: "ঝুঁকি স্তর: মাঝারি (আজ রাতে আর্দ্রতা বেশি থাকবে)",
      dashboardCard1Item4: "করণীয়: ১২ ঘণ্টার মধ্যে শুকানো ধান ছাউনির নিচে নিয়ে যান।",
      dashboardCard2Title: "৩ দিনের আবহাওয়া ও ঝুঁকি",
      dashboardCard2Item1: "দিন ১: সন্ধ্যায় হালকা বৃষ্টি – সকালেই কাটা নিরাপদ।",
      dashboardCard2Item2: "দিন ২: বেশি আর্দ্রতা – শুকানোর সময় ১ দিন বাড়ান।",
      dashboardCard2Item3: "দিন ৩: ভারী বৃষ্টি – ফসল না কেটে রাখা ও সংরক্ষিত ধান ভালোভাবে ঢেকে রাখুন।",
      dashboardCard3Title: "সংরক্ষণকৃত লট",
      dashboardCard3Item1: "লট #০১: ৮০০ কেজি ধান – টিনের ঘর – ঝুঁকি: কম",
      dashboardCard3Item2: "লট #০২: ৫০০ কেজি ধান – খোলা বারান্দা – ঝুঁকি: বেশি",
      dashboardCard3Item3: "প্রস্তাবিত করণীয়: লট #০২ ঢেকে রাখা বা ঘরের ভেতর নিয়ে যান।",

      // NEW: FAQ
      faqHeading: "প্রায় জিজ্ঞাসিত প্রশ্ন",
      faqQ1: "হারভেস্টগার্ড কার জন্য?",
      faqA1: "ছোট ও মাঝারি কৃষক, স্থানীয় সংগ্রহকারী, সমবায়, এনজিও এবং পোস্ট-হারভেস্ট ক্ষতি কমাতে কাজ করা এগ্রি-স্টার্টআপদের জন্য।",
      faqQ2: "হারভেস্টগার্ড কোন ডেটা ব্যবহার করে?",
      faqA2: "খামারের অবস্থান, ফসলের ধরন, কাটার তারিখ, সংরক্ষণের তথ্য এবং নির্ভরযোগ্য উৎস থেকে প্রাপ্ত আবহাওয়ার ডেটা।",
      faqQ3: "আমি কীভাবে অ্যালার্ট পাব?",
      faqA3: "ওয়েব অ্যাপের মাধ্যমেই অ্যালার্ট পাওয়া যাবে, এবং প্রয়োজন হলে এসএমএস বা মেসেজিং অ্যাপের সাথেও যুক্ত করা যেতে পারে।"
    }
  };

  function applyLanguage(lang) {
    const data = content[lang];
    if (!data) return;

    currentLanguage = lang;

    const mapping = {
      'hero-heading': 'heroHeading',
      'hero-subheading': 'heroSubheading',
      'cta-button': 'ctaButton',
      'problem-solution-heading': 'problemSolutionHeading',
      'problem-description': 'problemDescription',
      'solution-description': 'solutionDescription',
      'features-heading': 'featuresHeading',
      'feature1-heading': 'feature1Heading',
      'feature1-description': 'feature1Description',
      'feature2-heading': 'feature2Heading',
      'feature2-description': 'feature2Description',
      'feature3-heading': 'feature3Heading',
      'feature3-description': 'feature3Description',
      'feature4-heading': 'feature4Heading',
      'feature4-description': 'feature4Description',
      'b1-button': 'b1Button',
      'how-it-works-heading': 'howItWorksHeading',
      'step1-heading': 'step1Heading',
      'step1-description': 'step1Description',
      'step2-heading': 'step2Heading',
      'step2-description': 'step2Description',
      'step3-heading': 'step3Heading',
      'step3-description': 'step3Description',
      'cta-heading': 'ctaHeading',
      'cta-description': 'ctaDescription',
      'cta-register': 'ctaRegister',
      'weather-demo-button': 'weatherButton',
      'risk-demo-button': 'riskButton',
      'farm-demo-button': 'farmButton',

      // NEW: Why Different
      'why-heading': 'whyHeading',
      'why-item1-heading': 'whyItem1Heading',
      'why-item1-description': 'whyItem1Description',
      'why-item2-heading': 'whyItem2Heading',
      'why-item2-description': 'whyItem2Description',
      'why-item3-heading': 'whyItem3Heading',
      'why-item3-description': 'whyItem3Description',

      // NEW: Dashboard
      'dashboard-heading': 'dashboardHeading',
      'dashboard-card1-title': 'dashboardCard1Title',
      'dashboard-card1-item1': 'dashboardCard1Item1',
      'dashboard-card1-item2': 'dashboardCard1Item2',
      'dashboard-card1-item3': 'dashboardCard1Item3',
      'dashboard-card1-item4': 'dashboardCard1Item4',
      'dashboard-card2-title': 'dashboardCard2Title',
      'dashboard-card2-item1': 'dashboardCard2Item1',
      'dashboard-card2-item2': 'dashboardCard2Item2',
      'dashboard-card2-item3': 'dashboardCard2Item3',
      'dashboard-card3-title': 'dashboardCard3Title',
      'dashboard-card3-item1': 'dashboardCard3Item1',
      'dashboard-card3-item2': 'dashboardCard3Item2',
      'dashboard-card3-item3': 'dashboardCard3Item3',

      // NEW: FAQ
      'faq-heading': 'faqHeading',
      'faq-q1': 'faqQ1',
      'faq-a1': 'faqA1',
      'faq-q2': 'faqQ2',
      'faq-a2': 'faqA2',
      'faq-q3': 'faqQ3',
      'faq-a3': 'faqA3'
    };

    Object.keys(mapping).forEach(id => {
      const el = document.getElementById(id);
      const key = mapping[id];
      if (el && data[key] !== undefined) {
        el.textContent = data[key];
      }
    });

    // Optional: set html lang attribute
    document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');
  }

  function setActiveLanguageButton(lang) {
    const enBtn = document.getElementById('lang-en');
    const bnBtn = document.getElementById('lang-bn');
    if (!enBtn || !bnBtn) return;

    enBtn.classList.toggle('active', lang === 'en');
    bnBtn.classList.toggle('active', lang === 'bn');
  }

  function changeLanguage(lang) {
    applyLanguage(lang);
    setActiveLanguageButton(lang);
  }

  // Make function accessible globally (if we ever want to use inline handlers)
  window.changeLanguage = changeLanguage;

  // Attach event listeners to language buttons
  const btnEn = document.getElementById('lang-en');
  const btnBn = document.getElementById('lang-bn');

  if (btnEn) {
    btnEn.addEventListener('click', () => changeLanguage('en'));
  }
  if (btnBn) {
    btnBn.addEventListener('click', () => changeLanguage('bn'));
  }

  // Set default language on load
  applyLanguage('en');
  setActiveLanguageButton('en');
});












