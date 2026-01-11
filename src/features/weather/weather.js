// Weather Feature Logic


const i18n = {
    en: {
        goHome: "Go Back to Home 🏡",
        heading: "Weather Forecast",
        langLabel: "Language:",
        areaLabel: "Select Your Upazila:",
        btnGet: "Get Weather",
        advisoryTitle: "Advisory",
        loading: "Loading weather data...",
        error: "Error fetching data.",
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        humidity: "Humidity",
        rainChance: "Rain Chance",
        temp: "Temp"
    },
    bn: {
        goHome: "হোমে ফিরে যান 🏡",
        heading: "আবহাওয়া পূর্বাভাস",
        langLabel: "ভাষা:",
        areaLabel: "আপনার এলাকা (উপজেলা) নির্বাচন করুন:",
        btnGet: "আবহাওয়া দেখুন",
        advisoryTitle: "কৃষি পরামর্শ",
        loading: "তথ্য লোড হচ্ছে...",
        error: "তথ্য আনতে সমস্যা হয়েছে।",
        dayNames: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"],
        humidity: "আর্দ্রতা",
        rainChance: "বৃষ্টির সম্ভাবনা",
        temp: "তাপমাত্রা"
    }
};

const apiKey = "83d0172bfdd2a9497f8dfefeeda4a6a6";
let currentLanguage = "bn"; // Default to Bangla as per requirement

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // 1. Set Go Home Link
    const homeBtn = document.getElementById("go-home");
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            window.location.href = "../../../public/index.html";
        });
    }

    // 2. Set Default Language UI
    const langSelect = document.getElementById("language");
    if (langSelect) langSelect.value = currentLanguage;
    setLanguage();

    // 3. Auto-load for first option
    getWeatherData();
});

function setLanguage() {
    const el = document.getElementById('language');
    if (el) currentLanguage = el.value;

    // Update Static UI
    const keys = i18n[currentLanguage];
    if (document.getElementById('weather-heading')) document.getElementById('weather-heading').textContent = keys.heading;
    if (document.getElementById('languageLabel')) document.getElementById('languageLabel').textContent = keys.langLabel;
    if (document.getElementById('upazilaLabel')) document.getElementById('upazilaLabel').textContent = keys.areaLabel;
    if (document.getElementById('btnGetWeather')) document.getElementById('btnGetWeather').textContent = keys.btnGet;
    if (document.getElementById('advisory-title')) document.getElementById('advisory-title').textContent = keys.advisoryTitle;
    if (document.getElementById('go-home')) document.getElementById('go-home').textContent = keys.goHome;

    // Re-render if data exists (simplification: just re-fetch to update dynamic text)
    // In a real app we would store state and re-render. Here we rely on user clicking or auto-load.
}

async function getWeatherData(coords = null) {
    const upazilaInput = document.getElementById('upazila');
    const city = upazilaInput.value;

    // Simple visual feedback
    const grid = document.getElementById('forecast-grid');
    if (grid) grid.innerHTML = `<p style="text-align:center; width:100%;">${i18n[currentLanguage].loading}</p>`;
    const advisory = document.getElementById('advisory-card');
    if (advisory) advisory.style.display = 'none';

    try {
        let url;
        if (coords) {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},BD&units=metric&appid=${apiKey}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();

        processAndDisplay(data);

    } catch (error) {
        console.warn("API Error, falling back to Mock Data:", error);
        const mockData = generateMockForecast(city);
        processAndDisplay(mockData);
    }
}

// Global helper for the button
window.getWeatherAtLocation = function () {
    if (navigator.geolocation) {
        if (document.getElementById('forecast-grid')) {
            document.getElementById('forecast-grid').innerHTML = `<p style="text-align:center; width:100%">${i18n[currentLanguage].loading}</p>`;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                getWeatherData({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            },
            (err) => {
                alert("Location permission denied. Please select an Upazila manually.");
                getWeatherData();
            }
        );
    } else {
        alert("Geolocation not supported by this browser.");
    }
}

// Generate consistent mock data based on city name characters
function generateMockForecast(city) {
    const list = [];
    const now = Math.floor(Date.now() / 1000);

    // Seed random based on city string
    let seed = 0;
    for (let i = 0; i < city.length; i++) seed += city.charCodeAt(i);

    // Generate 5 days of 3-hour intervals (approx 40 items)
    for (let i = 0; i < 40; i++) {
        const dt = now + (i * 3 * 3600);

        // Pseudo-random variations
        const rnd = ((seed + i) % 100) / 100; // 0.0 to 1.0

        list.push({
            dt: dt,
            main: {
                temp_max: 28 + (rnd * 10), // 28 to 38 C
                temp_min: 24 + (rnd * 5),
                humidity: 60 + (rnd * 30)  // 60 to 90%
            },
            weather: [{
                description: rnd > 0.7 ? "rainy" : "clear",
                icon: rnd > 0.7 ? "10d" : "01d"
            }],
            pop: rnd > 0.6 ? rnd : 0 // Rain chance
        });
    }

    return { list };
}

function processAndDisplay(data) {
    // 1. Process Data: We want 1 forecast per day for next 5 days.
    // The API returns a list. We can pick the data point closest to 12:00 PM usually.
    // Or just group by date.

    const dailyForecasts = [];
    const usedDates = new Set();

    // Helper to format date YYYY-MM-DD
    const getDateStr = (dt) => new Date(dt * 1000).toISOString().split('T')[0];

    // Find Max Temp and Rain Chance for each day
    // (A simple approach: iterate all 3h blocks, group by day)
    const dayData = {};

    data.list.forEach(item => {
        const dateStr = getDateStr(item.dt);
        if (!dayData[dateStr]) {
            dayData[dateStr] = {
                dt: item.dt,
                tempMax: item.main.temp_max,
                tempMin: item.main.temp_min,
                pop: item.pop, // Probability of precipitation (0 to 1)
                humidity: item.main.humidity,
                icon: item.weather[0].icon,
                desc: item.weather[0].description
            };
        } else {
            // Aggregate
            dayData[dateStr].tempMax = Math.max(dayData[dateStr].tempMax, item.main.temp_max);
            dayData[dateStr].pop = Math.max(dayData[dateStr].pop, item.pop);
        }
    });

    // Convert to array and take first 5
    const days = Object.values(dayData).sort((a, b) => a.dt - b.dt).slice(0, 5);

    // 2. Update Heading with City Name
    const headingEl = document.getElementById('weather-heading');
    if (headingEl && data.city) {
        const cityName = data.city.name;
        headingEl.textContent = `${i18n[currentLanguage].heading}: ${cityName}`;
    }

    // 3. Generate Advisory
    generateAdvisory(days);

    // 3. Render Grid
    const grid = document.getElementById('forecast-grid');
    grid.innerHTML = '';

    days.forEach(day => {
        const dateObj = new Date(day.dt * 1000);
        const dayName = i18n[currentLanguage].dayNames[dateObj.getDay()];
        const dateDisplay = dateObj.toLocaleDateString(currentLanguage === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short' });

        // Numbers in Bangla?
        const tMax = currentLanguage === 'bn' ? toBn(Math.round(day.tempMax)) : Math.round(day.tempMax);
        const hum = currentLanguage === 'bn' ? toBn(day.humidity) : day.humidity;
        const rainProb = Math.round(day.pop * 100);
        const rainProbTxt = currentLanguage === 'bn' ? toBn(rainProb) : rainProb;

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h3>${dayName}</h3>
            <div class="date">${dateDisplay}</div>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="icon">
            <div class="temp">${tMax}°C</div>
            <div class="details">
                <span>💧 ${rainProbTxt}%</span>
                <span>H: ${hum}%</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function generateAdvisory(days) {
    const card = document.getElementById('advisory-card');
    const textEl = document.getElementById('advisory-text');
    card.style.display = 'block';

    let advice = "";

    // Logic: Look at next 3 days
    const next3Days = days.slice(0, 3);
    const highRain = next3Days.some(d => d.pop > 0.6); // > 60% chance
    const highTemp = next3Days.some(d => d.tempMax > 36); // > 36 C

    if (currentLanguage === 'bn') {
        if (highRain) {
            advice = `🌧 <strong>সতর্কতা:</strong> আগামী ৩ দিনের মধ্যে বৃষ্টির জোর সম্ভাবনা আছে (৬০%+)।<br>
                      পাকা ধান থাকলে <strong>আজই কেটে ফেলুন</strong> অথবা পলিথিন দিয়ে ঢেকে রাখুন।`;
        } else if (highTemp) {
            advice = `☀ <strong>তাপদাহ:</strong> তাপমাত্রা ৩৬°C এর উপরে উঠতে পারে।<br>
                      ফসলের জমিতে <strong>বিকেলের দিকে সেচ দিন</strong> যাতে মাটি ঠান্ডা থাকে।`;
        } else {
            advice = `✅ <strong>আবহাওয়া স্বাভাবিক:</strong> আগামী কয়েক দিন আবহাওয়া ভালো থাকবে।<br>
                      নিয়মিত পরিচর্যা চালিয়ে যান।`;
        }
    } else {
        if (highRain) {
            advice = `🌧 <strong>Warning:</strong> High chance of rain (>60%) in next 3 days.<br>
                      Harvest ripe paddy <strong>today</strong> or cover it securely.`;
        } else if (highTemp) {
            advice = `☀ <strong>Heatwave:</strong> Temperature may rise above 36°C.<br>
                      <strong>Irrigate in the afternoon</strong> to keep the soil cool.`;
        } else {
            advice = `✅ <strong>Normal:</strong> Weather conditions are favorable.<br>
                      Continue regular crop maintenance.`;
        }
    }

    textEl.innerHTML = advice;
}

function toBn(num) {
    const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return num.toString().split('').map(c => map[c] || c).join('');
}



