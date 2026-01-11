// HarvestGuard: Risk Forecast


let currentLanguage = "en";

// Mock 7-day forecast for each division
const mockForecast = {
  Dhaka: [
    { day: "Day 1", dayBn: "দিন ১", temp: 34, humidity: 82, rainProb: 60 },
    { day: "Day 2", dayBn: "দিন ২", temp: 35, humidity: 78, rainProb: 30 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 36, humidity: 88, rainProb: 75 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 33, humidity: 80, rainProb: 40 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 34, humidity: 85, rainProb: 65 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 32, humidity: 76, rainProb: 20 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 33, humidity: 81, rainProb: 50 }
  ],
  Chattogram: [
    { day: "Day 1", dayBn: "দিন ১", temp: 32, humidity: 88, rainProb: 70 },
    { day: "Day 2", dayBn: "দিন ২", temp: 31, humidity: 90, rainProb: 80 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 33, humidity: 87, rainProb: 60 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 34, humidity: 83, rainProb: 55 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 32, humidity: 86, rainProb: 65 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 31, humidity: 84, rainProb: 50 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 32, humidity: 85, rainProb: 60 }
  ],
  Rajshahi: [
    { day: "Day 1", dayBn: "দিন ১", temp: 37, humidity: 70, rainProb: 20 },
    { day: "Day 2", dayBn: "দিন ২", temp: 38, humidity: 65, rainProb: 10 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 39, humidity: 68, rainProb: 15 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 37, humidity: 72, rainProb: 25 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 36, humidity: 75, rainProb: 30 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 35, humidity: 73, rainProb: 20 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 36, humidity: 70, rainProb: 15 }
  ],
  Khulna: [
    { day: "Day 1", dayBn: "দিন ১", temp: 34, humidity: 79, rainProb: 40 },
    { day: "Day 2", dayBn: "দিন ২", temp: 35, humidity: 82, rainProb: 55 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 36, humidity: 84, rainProb: 60 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 34, humidity: 78, rainProb: 35 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 33, humidity: 80, rainProb: 45 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 34, humidity: 81, rainProb: 50 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 33, humidity: 79, rainProb: 40 }
  ],
  Barishal: [
    { day: "Day 1", dayBn: "দিন ১", temp: 31, humidity: 85, rainProb: 60 },
    { day: "Day 2", dayBn: "দিন ২", temp: 30, humidity: 88, rainProb: 75 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 31, humidity: 86, rainProb: 65 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 32, humidity: 82, rainProb: 40 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 31, humidity: 84, rainProb: 50 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 31, humidity: 85, rainProb: 60 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 30, humidity: 87, rainProb: 70 }
  ],
  Sylhet: [
    { day: "Day 1", dayBn: "দিন ১", temp: 30, humidity: 90, rainProb: 85 },
    { day: "Day 2", dayBn: "দিন ২", temp: 31, humidity: 88, rainProb: 70 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 32, humidity: 85, rainProb: 60 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 31, humidity: 89, rainProb: 80 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 29, humidity: 92, rainProb: 90 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 30, humidity: 90, rainProb: 80 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 31, humidity: 87, rainProb: 65 }
  ],
  Rangpur: [
    { day: "Day 1", dayBn: "দিন ১", temp: 33, humidity: 75, rainProb: 30 },
    { day: "Day 2", dayBn: "দিন ২", temp: 34, humidity: 72, rainProb: 20 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 35, humidity: 70, rainProb: 15 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 34, humidity: 74, rainProb: 25 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 32, humidity: 78, rainProb: 40 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 33, humidity: 76, rainProb: 35 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 34, humidity: 73, rainProb: 25 }
  ],
  Mymensingh: [
    { day: "Day 1", dayBn: "দিন ১", temp: 32, humidity: 82, rainProb: 50 },
    { day: "Day 2", dayBn: "দিন ২", temp: 33, humidity: 80, rainProb: 40 },
    { day: "Day 3", dayBn: "দিন ৩", temp: 34, humidity: 85, rainProb: 65 },
    { day: "Day 4", dayBn: "দিন ৪", temp: 33, humidity: 83, rainProb: 55 },
    { day: "Day 5", dayBn: "দিন ৫", temp: 32, humidity: 86, rainProb: 70 },
    { day: "Day 6", dayBn: "দিন ৬", temp: 32, humidity: 84, rainProb: 60 },
    { day: "Day 7", dayBn: "দিন ৭", temp: 33, humidity: 81, rainProb: 50 }
  ]
};

// UI text (English + Bangla)
const uiText = {
  en: {
    brandSub: "Risk Forecast",
    pageTitle: "HarvestGuard – Risk Forecast",
    subtitle:
      "Use a mock 7-day forecast and your stored paddy information to estimate Estimated Time to Critical Loss (ETCL) and spoilage risk.",
    batchTitle: "Batch information",
    labelDivision: "Storage location (division / district)",
    labelCropType: "Crop type",
    labelStorageType: "Storage type",
    labelMoisture: "Grain condition (moisture)",
    helperText:
      "Tip: choose an exposed storage (open veranda) + wet grain to see how quickly ETCL drops.",
    calcButton: "Calculate risk",
    forecastTitle: "Mock 7-day forecast",
    forecastNote:
      "For each region we use a mock 7-day forecast (temperature, humidity, rain probability) to calculate ETCL.",
    thDay: "Day",
    thTemp: "Temp (°C)",
    thHumidity: "Humidity (%)",
    thRain: "Rain probability (%)",
    resultTitle: "Risk summary",
    footer:
      "© 2025 HarvestGuard. All Rights Reserved.",
    goHome: "Go Back to Home 🏡",
  },
  bn: {
    brandSub: "ঝুঁকি পূর্বাভাস",
    pageTitle: "হারভেস্টগার্ড – ঝুঁকি পূর্বাভাস",
    subtitle:
      "৭ দিনের মোক আবহাওয়া পূর্বাভাস ও আপনার সংরক্ষিত ধানের তথ্য ব্যবহার করে আমরা হিসাব করি Estimated Time to Critical Loss (ETCL) ও পচনের ঝুঁকি।",
    batchTitle: "ব্যাচ সম্পর্কিত তথ্য",
    labelDivision: "সংরক্ষণ স্থান (ডিভিশন / জেলা)",
    labelCropType: "ফসলের ধরন",
    labelStorageType: "সংরক্ষণের ধরন",
    labelMoisture: "ধানের বর্তমান অবস্থা (আর্দ্রতা)",
    helperText:
      "টিপস: খোলা বারান্দা + ভেজা ধান সিলেক্ট করলে দেখবেন ETCL কত দ্রুত কমে যায়।",
    calcButton: "ঝুঁকি হিসাব করুন",
    forecastTitle: "৭ দিনের মোক আবহাওয়া",
    forecastNote:
      "প্রত্যেক অঞ্চলের জন্য আমরা একটি মোক ৭ দিনের পূর্বাভাস ব্যবহার করি (তাপমাত্রা, আর্দ্রতা, বৃষ্টির সম্ভাবনা) – যেটা দিয়ে ETCL হিসাব করা হয়।",
    thDay: "দিন",
    thTemp: "তাপমাত্রা (°C)",
    thHumidity: "আর্দ্রতা (%)",
    thRain: "বৃষ্টির সম্ভাবনা (%)",
    resultTitle: "ঝুঁকি সারাংশ",
    footer:
      "© ২০২৫ হারভেস্টগার্ড। সর্বস্বত্ব সংরক্ষিত।",
    goHome: "হোমে ফিরে যান 🏡",
  }
};

// Convert English digits to Bangla
function toBanglaNumber(num) {
  const map = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num)
    .split("")
    .map((ch) => {
      const d = parseInt(ch, 10);
      return Number.isNaN(d) ? ch : map[d];
    })
    .join("");
}

// Update option text in all selects based on language
function updateSelectLanguage(lang) {
  const isBn = lang === "bn";
  const selects = ["division", "cropType", "storageType", "moistureLevel"];

  selects.forEach((id) => {
    const sel = document.getElementById(id);
    if (!sel) return;

    Array.from(sel.options).forEach((opt) => {
      const text = isBn ? opt.dataset.bn : opt.dataset.en;
      if (text) {
        opt.textContent = text;
      }
    });
  });
}

// ETCL calculation enhanced logic
function calculateETCL(forecast, storageType, moistureLevel) {
  // Start with 168 hours (7 days full safety)
  let etcl = 168;

  let highHumidityDays = 0;
  let hotDays = 0;
  let rainyDays = 0;

  // Track consecutive bad conditions
  let consecutiveHumidity = 0;
  let consecutiveHeat = 0;
  let maxConsecutiveHumidity = 0;

  forecast.forEach((day) => {
    // 1. High Humidity Impact
    if (day.humidity >= 80) {
      etcl -= 10;
      highHumidityDays++;
      consecutiveHumidity++;
      if (consecutiveHumidity > maxConsecutiveHumidity) maxConsecutiveHumidity = consecutiveHumidity;
    } else {
      consecutiveHumidity = 0;
    }

    // 2. High Temperature Impact
    if (day.temp >= 35) {
      etcl -= 6;
      hotDays++;
      consecutiveHeat++;
      // Continuous heat doubles the penalty for that day
      if (consecutiveHeat >= 2) etcl -= 6;
    } else {
      consecutiveHeat = 0;
    }

    // 3. Rain Probability Impact
    if (day.rainProb >= 60) {
      etcl -= 8;
      rainyDays++;
      // Rain is significantly riskier if stored in open veranda
      if (storageType === "open") etcl -= 12;
    }
  });

  // 4. Consecutive humidity penalty (Aflatoxin risk)
  if (maxConsecutiveHumidity >= 3) {
    etcl -= 24; // Extra penalty for high aflatoxin risk due to sustained moisture
  }

  // 5. Initial Grain condition impact
  if (moistureLevel === "medium") {
    etcl -= 24;
  } else if (moistureLevel === "wet") {
    etcl -= 48;
  }

  // 6. Storage quality factor
  if (storageType === "open") {
    etcl -= 30; // Very high risk in open areas
  } else if (storageType === "silo") {
    etcl += 24; // Hermetic storage increases safety
  } else if (storageType === "tin") {
    etcl -= 10; // Better than open, but not hermetic
  }

  // Clamping
  if (etcl < 24) etcl = 24;
  if (etcl > 168) etcl = 168;

  return {
    etclHours: Math.round(etcl),
    highHumidityDays,
    hotDays,
    rainyDays,
    aflatoxinRisk: maxConsecutiveHumidity >= 3
  };
}

function classifyRisk(etclHours) {
  if (etclHours <= 48) {
    return {
      levelEn: "High risk",
      levelBn: "উচ্চ ঝুঁকি",
      color: "#c0392b"
    };
  } else if (etclHours <= 96) {
    return {
      levelEn: "Medium risk",
      levelBn: "মাঝারি ঝুঁকি",
      color: "#f39c12"
    };
  }
  return {
    levelEn: "Low risk",
    levelBn: "কম ঝুঁকি",
    color: "#27ae60"
  };
}

function applyLanguage(lang) {
  currentLanguage = lang;
  const t = uiText[lang];
  if (!t) return;

  const set = (id, key) => {
    const el = document.getElementById(id);
    if (el && t[key] != null) el.textContent = t[key];
    document.getElementById("go-home").textContent = t.goHome;

  };

  set("brand-sub", "brandSub");
  set("page-title", "pageTitle");
  set("subtitle", "subtitle");
  set("batch-title", "batchTitle");
  set("label-division", "labelDivision");
  set("label-cropType", "labelCropType");
  set("label-storageType", "labelStorageType");
  set("label-moisture", "labelMoisture");
  set("helper-text", "helperText");
  set("calculateBtn", "calcButton");
  set("forecast-title", "forecastTitle");
  set("forecast-note", "forecastNote");
  set("th-day", "thDay");
  set("th-temp", "thTemp");
  set("th-humidity", "thHumidity");
  set("th-rain", "thRain");
  set("result-title", "resultTitle");
  set("footer-text", "footer");

  // update select option text
  updateSelectLanguage(lang);

  const btnEn = document.getElementById("lang-en");
  const btnBn = document.getElementById("lang-bn");
  if (btnEn && btnBn) {
    btnEn.classList.toggle("active", lang === "en");
    btnBn.classList.toggle("active", lang === "bn");
  }

  document.documentElement.setAttribute("lang", lang === "bn" ? "bn" : "en");
}

function renderForecastRows(forecast) {
  const tbody = document.getElementById("forecastBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  forecast.forEach((day) => {
    const tr = document.createElement("tr");
    const temp = currentLanguage === "bn" ? toBanglaNumber(day.temp) : day.temp;
    const hum =
      currentLanguage === "bn" ? toBanglaNumber(day.humidity) : day.humidity;
    const rain =
      currentLanguage === "bn"
        ? toBanglaNumber(day.rainProb)
        : day.rainProb;
    const dayLabel = currentLanguage === "bn" ? day.dayBn : day.day;

    tr.innerHTML = `
      <td>${dayLabel}</td>
      <td>${temp}</td>
      <td>${hum}</td>
      <td>${rain}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const divisionSelect = document.getElementById("division");
  const storageSelect = document.getElementById("storageType");
  const moistureSelect = document.getElementById("moistureLevel");
  const calculateBtn = document.getElementById("calculateBtn");

  const resultCard = document.getElementById("resultCard");
  const riskHeadline = document.getElementById("riskHeadline");
  const riskDetail = document.getElementById("riskDetail");
  const etclNote = document.getElementById("etclNote");

  const btnEn = document.getElementById("lang-en");
  const btnBn = document.getElementById("lang-bn");

  if (btnEn) btnEn.addEventListener("click", () => {
    applyLanguage("en");
    renderForecastRows(mockForecast[divisionSelect.value]);
  });
  if (btnBn) btnBn.addEventListener("click", () => {
    applyLanguage("bn");
    renderForecastRows(mockForecast[divisionSelect.value]);
  });

  // initial language + select text + forecast
  applyLanguage("en");

  function updateForecastForSelected() {
    const forecast = mockForecast[divisionSelect.value];
    if (forecast) renderForecastRows(forecast);
  }

  calculateBtn.addEventListener("click", () => {
    const division = divisionSelect.value;
    const storage = storageSelect.value;
    const moisture = moistureSelect.value;

    const forecast = mockForecast[division];
    if (!forecast) {
      alert(
        currentLanguage === "bn"
          ? "এই অঞ্চলের জন্য মোক ডেটা পাওয়া যায়নি।"
          : "No mock data available for this region."
      );
      return;
    }

    updateForecastForSelected();

    const { etclHours, highHumidityDays, hotDays, rainyDays, aflatoxinRisk } =
      calculateETCL(forecast, storage, moisture);

    const risk = classifyRisk(etclHours);

    const etclDisplay =
      currentLanguage === "bn"
        ? toBanglaNumber(etclHours)
        : String(etclHours);

    const humidityText =
      currentLanguage === "bn"
        ? toBanglaNumber(highHumidityDays)
        : String(highHumidityDays);
    const rainText =
      currentLanguage === "bn"
        ? toBanglaNumber(rainyDays)
        : String(rainyDays);
    const hotText =
      currentLanguage === "bn"
        ? toBanglaNumber(hotDays)
        : String(hotDays);

    if (currentLanguage === "bn") {
      let riskMsg = `${risk.levelBn} – সম্ভাব্য গুরুতর ক্ষতির সময় (ETCL): ${etclDisplay} ঘণ্টা`;
      riskHeadline.textContent = riskMsg;

      let detail = `পরবর্তী ৭ দিনে ${humidityText} দিন বেশি আর্দ্রতা, ${rainText} দিন বৃষ্টির বেশি সম্ভাবনা এবং ${hotText} দিন বেশি তাপমাত্রা দেখা যাচ্ছে। `;
      if (aflatoxinRisk) {
        detail += `সতর্কতা: টানা ৩ দিনের বেশি উচ্চ আর্দ্রতার কারণে আফলাটক্সিন (Aflatoxin) ছত্রাকের উচ্চ ঝুঁকি রয়েছে। `;
      }
      if (storage === "open" && rainyDays > 0) {
        detail += `খোলা বারান্দায় রাখার ফলে বৃষ্টির কারণে আপনার ধান নষ্ট হওয়ার সম্ভাবনা অত্যন্ত বেশি। `;
      }
      detail += `সুপারিশ: ধানকে শুকনো ও বাতাস চলাচলযুক্ত ঘরের ভিতরে (Indoor Aeration) রাখুন, সরাসরি মেঝেতে না রেখে উঁচু পাটাতনে রাখুন।`;

      riskDetail.innerHTML = detail;
      etclNote.textContent =
        "ব্যাখ্যা: ETCL যত কম হবে, তত দ্রুত ধান নষ্ট হওয়ার ঝুঁকি বেশি। ETCL ৪৮ ঘণ্টার কম হলে দ্রুত করণীয় নেওয়া প্রয়োজন।";
    } else {
      let riskMsg = `${risk.levelEn} – Estimated Time to Critical Loss (ETCL): ${etclDisplay} hours`;
      riskHeadline.textContent = riskMsg;

      let detail = `Over the next 7 days there are ${humidityText} high-humidity days, ${rainText} days with high rain probability, and ${hotText} very hot days. `;
      if (aflatoxinRisk) {
        detail += `WARNING: Sustained high humidity for 3+ days indicates a HIGH RISK of Aflatoxin Mold. `;
      }
      if (storage === "open" && rainyDays > 0) {
        detail += `Open storage combined with predicted rain makes this batch extremely vulnerable. `;
      }
      detail += `Recommendation: Move grain to a dry indoor area with proper aeration. Keep bags off the floor using pallets and improve ventilation.`;

      riskDetail.innerHTML = detail;
      etclNote.textContent =
        "Interpretation: The lower the ETCL, the faster stored paddy may reach a critical spoilage point. ETCL below 48 hours means urgent action is needed.";
    }

    resultCard.style.display = "block";
    resultCard.style.borderLeftColor = risk.color;
  });

  // initial forecast render for default division
  updateForecastForSelected();
});

document.addEventListener("DOMContentLoaded", () => {
  const homeBtn = document.getElementById("go-home");

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../../../public/index.html";
    });
  }
});


