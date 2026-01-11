// Store the current language
let currentLanguage = "en"; // Default language is English

// Language content for English and Bangla
const languageContent = {
    en: {
        headline: "Basic Crop Health Scanner",
        description: "Upload an image of a crop to determine whether it is \"Fresh\" or \"Rotten\".",
        scanButton: "Scan Crop",
        resultHeading: "Result:",
        healthStatus: "Please upload an image for analysis.",
        languageLabel: "Choose Language:",
    },
    bn: {
        headline: "বেসিক ফসল স্বাস্থ্য স্ক্যানার",
        description: "একটি ফসলের ছবি আপলোড করুন এবং এটি \"তাজা\" না \"পচে গিয়েছে\" তা নির্ধারণ করুন।",
        scanButton: "ফসল স্ক্যান করুন",
        resultHeading: "ফলাফল:",
        healthStatus: "বিশ্লেষণের জন্য একটি ছবি আপলোড করুন।",
        languageLabel: "ভাষা নির্বাচন করুন:",
    }
};

// Function to change language dynamically
function setLanguage() {
    currentLanguage = document.getElementById('language').value;

    // Update the text content dynamically based on selected language
    document.getElementById('headline').innerText = languageContent[currentLanguage].headline;
    document.getElementById('description').innerText = languageContent[currentLanguage].description;
    document.getElementById('scanButton').innerText = languageContent[currentLanguage].scanButton;
    document.getElementById('resultHeading').innerText = languageContent[currentLanguage].resultHeading;
    document.getElementById('healthStatus').innerText = languageContent[currentLanguage].healthStatus;
    document.getElementById('languageLabel').innerText = languageContent[currentLanguage].languageLabel;
}

// Crop Health Feature Logic


// Function to trigger the crop health scan
async function scanCropHealth() {
    const imageInput = document.getElementById('imageInput');
    const resultSection = document.getElementById('result');
    const healthStatus = document.getElementById('healthStatus');
    const cropImage = document.getElementById('cropImage');

    // Check if an image is uploaded
    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please upload an image!');
        return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    // Preview the uploaded image
    reader.onloadend = function () {
        cropImage.src = reader.result;
    };

    reader.readAsDataURL(file);

    // Show the result section
    resultSection.style.display = 'block';
    healthStatus.textContent = 'Analyzing...';

    // Call the AI model (using a pre-trained model like HuggingFace or Teachable Machine)
    const result = await analyzeImage(file);

    // Display the result (Fresh or Rotten)
    healthStatus.textContent = result ? 'Fresh' : 'Rotten';
}

// Function to analyze the uploaded image using AI model (use a pre-trained model or API)
async function analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    // Example: Calling an AI model endpoint (HuggingFace API or Teachable Machine model)
    const response = await fetch('https://your-ai-model-endpoint', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        console.error('Error analyzing image');
        return false;
    }

    const data = await response.json();

    // Assume the model returns a prediction (true for "Fresh" and false for "Rotten")
    return data.prediction;
}

// Automatically set the language on page load
window.onload = setLanguage;
