import { identifyPest } from "../../services/geminiService.js";

// --- State Variables ---
let currentFile = null;
let currentLanguage = "en";

// --- DOM Elements ---
const components = {
  uploadSection: null,
  fileInput: null,
  previewContainer: null,
  previewImage: null,
  analyzeBtn: null,
  btnText: null,
  loader: null,
  errorContainer: null,
  resultCard: null,
  pestTitle: null,
  riskBadge: null,
  treatmentText: null
};

// --- Initialization ---
// Since this is a module script, it runs deferred. We can assume DOM is ready or almost ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initGlobal();
    initPestUploader();
  });
} else {
  initGlobal();
  initPestUploader();
}

function initGlobal() {
  // Bind global language selector if it exists
  const langSelect = document.getElementById("language");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      currentLanguage = e.target.value;
      updateLanguage();
    });
  }
}

function initPestUploader() {
  const root = document.getElementById("root");
  if (!root) {
    console.error("Root element not found for PestUploader");
    return;
  }

  // Render inner HTML structure similar to the React component
  root.innerHTML = `
      <div class="pest-uploader-container">
        <h2 id="uploader-title">পোকা বা ফসলের ক্ষতি চিহ্নিত করুন</h2>

        <div class="upload-section" id="upload-section">
          <input id="pest-file-input" type="file" accept="image/jpeg, image/png" capture="environment" class="hidden-input" />
          <div class="upload-label">
            <span class="upload-icon">📷</span>
            <span id="upload-text">ছবি তুলুন বা আপলোড করুন</span>
            <span style="font-size: 0.9rem; color: #666; font-weight: 400;">(JPEG বা PNG ফরম্যাট)</span>
          </div>
        </div>

        <div id="preview-container" class="preview-container" style="display: none;">
          <img id="preview-image" src="" alt="Preview" class="preview-image" />
        </div>

        <div style="margin-top: 1rem;">
          <button id="analyze-btn" class="analyze-btn" disabled>
            <span id="loader" class="loader" style="display: none;"></span> 
            <span id="btn-text">🔍 সমাধান দেখুন</span>
          </button>
        </div>

        <div id="error-container" style="display: none; color: #d32f2f; margin-top: 1.5rem; font-weight: 600; padding: 10px; background: #ffebee; border-radius: 8px;"></div>

        <div id="result-card" class="result-card" style="display: none;">
          <div class="result-header">
            <h3 id="pest-title" class="pest-title"></h3>
            <span id="risk-badge" class="risk-badge"></span>
          </div>

          <div class="treatment-section">
            <h4>✅ পরামর্শ ও প্রতিকার:</h4>
            <div id="treatment-text" class="treatment-text"></div>
          </div>
        </div>
      </div>
    `;

  // Bind elements
  components.uploadSection = document.getElementById("upload-section");
  components.fileInput = document.getElementById("pest-file-input");
  components.previewContainer = document.getElementById("preview-container");
  components.previewImage = document.getElementById("preview-image");
  components.analyzeBtn = document.getElementById("analyze-btn");
  components.btnText = document.getElementById("btn-text");
  components.loader = document.getElementById("loader");
  components.errorContainer = document.getElementById("error-container");
  components.resultCard = document.getElementById("result-card");
  components.pestTitle = document.getElementById("pest-title");
  components.riskBadge = document.getElementById("risk-badge");
  components.treatmentText = document.getElementById("treatment-text");

  // Event Listeners
  if (components.uploadSection && components.fileInput) {
    components.uploadSection.addEventListener("click", () => components.fileInput.click());
    components.fileInput.addEventListener("change", handleFileSelect);
  }
  if (components.analyzeBtn) {
    components.analyzeBtn.addEventListener("click", handleSubmit);
  }

  console.log("PestUploader Initialized");
}

// --- Handlers ---
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    currentFile = file;
    components.errorContainer.style.display = "none";
    components.resultCard.style.display = "none";
    components.analyzeBtn.disabled = false;

    const reader = new FileReader();
    reader.onload = (e) => {
      components.previewImage.src = e.target.result;
      components.previewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

async function handleSubmit() {
  if (!currentFile) return;

  // Check for API Key presence implicitly
  try {
    // We can't check process.env here directly, so we rely on the service to throw
  } catch (e) { }

  // Loading State
  setLoading(true);
  components.errorContainer.style.display = "none";
  components.resultCard.style.display = "none";

  try {
    const data = await identifyPest(currentFile);
    displayResult(data);
  } catch (err) {
    console.error("Analysis failed:", err);
    const isKeyError = err.message && (err.message.includes("API Key") || err.message.includes("400") || err.message.includes("403"));

    components.errorContainer.textContent = isKeyError
      ? "API Key Error: Please ensure VITE_GEMINI_API_KEY is set in Vercel Environment Variables. (Redeploy required after adding)"
      : "দুঃখিত, বিশ্লেষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। (" + err.message + ")";

    components.errorContainer.style.display = "block";
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  components.analyzeBtn.disabled = isLoading;
  if (isLoading) {
    components.loader.style.display = "inline-block";
    components.btnText.textContent = " বিশ্লেষণ চলছে...";
  } else {
    components.loader.style.display = "none";
    components.btnText.textContent = "🔍 সমাধান দেখুন";
  }
}

function displayResult(data) {
  if (!data) return;

  components.pestTitle.textContent = data.pest_name_bn || "অজানা সমস্যা";
  components.riskBadge.textContent = "Risk: " + (data.risk_level || "Unknown");
  components.riskBadge.className = "risk-badge " + getRiskClass(data.risk_level);
  components.treatmentText.textContent = data.treatment_plan_bn || "কোন পরামর্শ পাওয়া যায়নি।";

  components.resultCard.style.display = "block";
}

function getRiskClass(level) {
  if (!level) return "";
  const l = level.toLowerCase();
  if (l.includes("high")) return "risk-high";
  if (l.includes("medium")) return "risk-medium";
  return "risk-low";
}

// Optional: Language updates (if needed later)
function updateLanguage() {
  // Implement text switching if needed
}
