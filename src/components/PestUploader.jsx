import React, { useState } from "react";
import "./PestUploader.css";
import { identifyPest } from "../services/geminiService";

export default function PestUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setError("");
      setResult(null); // Clear previous result
      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await identifyPest(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("API Key")) {
        setError("API Key কনফিগার করা নেই! দয়া করে .env ফাইলে VITE_GEMINI_API_KEY যুক্ত করুন।");
      } else {
        setError("দুঃখিত, বিশ্লেষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level) => {
    if (!level) return "";
    const l = level.toLowerCase();
    if (l.includes("high")) return "risk-high";
    if (l.includes("medium")) return "risk-medium";
    return "risk-low";
  };

  return (
    <div className="pest-uploader-container">
      <h2>পোকা বা ফসলের ক্ষতি চিহ্নিত করুন</h2>

      <div
        className="upload-section"
        onClick={() => document.getElementById('pest-file-input').click()}
      >
        <input
          id="pest-file-input"
          type="file"
          accept="image/jpeg, image/png"
          capture="environment"
          onChange={onFileChange}
          className="hidden-input"
        />
        <div className="upload-label">
          <span className="upload-icon">📷</span>
          <span>ছবি তুলুন বা আপলোড করুন</span>
          <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}>
            (JPEG বা PNG ফরম্যাট)
          </span>
        </div>
      </div>

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={submit}
          disabled={!file || loading}
          className="analyze-btn"
        >
          {loading ? (
            <>
              <span className="loader"></span> বিশ্লেষণ চলছে...
            </>
          ) : (
            <>🔍 সমাধান দেখুন</>
          )}
        </button>
      </div>

      {error && (
        <div style={{ color: '#d32f2f', marginTop: '1.5rem', fontWeight: '600', padding: '10px', background: '#ffebee', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="result-card">
          <div className="result-header">
            <h3 className="pest-title">{result.pest_name_bn}</h3>
            <span className={`risk-badge ${getRiskClass(result.risk_level)}`}>
              Risk: {result.risk_level}
            </span>
          </div>

          <div className="treatment-section">
            <h4>✅ পরামর্শ ও প্রতিকার:</h4>
            <div className="treatment-text">
              {result.treatment_plan_bn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}