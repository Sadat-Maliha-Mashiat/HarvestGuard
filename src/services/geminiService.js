import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Ensure VITE_GEMINI_API_KEY is set in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Identify pest/damage from an image file using Gemini 1.5 Flash.
 * Uses Visual RAG with Google Search Grounding if configured.
 * 
 * @param {File} imageFile - The image file object
 * @returns {Promise<Object>} - JSON result with pest_name_bn, risk_level, treatment_plan_bn
 */
export async function identifyPest(imageFile) {
    if (!API_KEY) {
        throw new Error("Missing API Key. Please set VITE_GEMINI_API_KEY in .env");
    }

    // Convert image to Base64
    const imagePart = await fileToGenerativePart(imageFile);

    // Configure model with tools
    // We use gemini-1.5-flash for speed and efficiency, or gemini-1.5-pro for deeper reasoning
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-001",
        tools: [
            {
                googleSearchRetrieval: {
                    dynamicRetrievalConfig: {
                        mode: "MODE_DYNAMIC",
                        dynamicThreshold: 0.7,
                    },
                },
            },
        ],
    });

    const prompt = `
    You are an agricultural expert for farmers in Bangladesh.
    Analyze this image to identify the pest or crop damage shown.
    Use Google Search to verify the specific pest details if needed.
    
    Provide the output strictly in the following JSON format:
    {
      "pest_name_bn": "Name of the pest or disease in Bangla",
      "risk_level": "High" | "Medium" | "Low",
      "treatment_plan_bn": "A practical, step-by-step treatment plan in Bangla, focusing on local, organic, or easily available chemical methods."
    }
    
    Do not use Markdown formatting (like \`\`\`json). Just return the raw JSON string.
    Ensure the Bangla is natural and helpful for a farmer.
  `;

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean potential markdown blocks just in case
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse JSON", text);
            throw new Error("Received invalid response from AI. Please try again.");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

/**
 * Helper to convert File to Generative Part
 */
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(",")[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
