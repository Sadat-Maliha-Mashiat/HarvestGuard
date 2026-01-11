import React, { useState } from "react";

const PestUploader = ({ setLoading, setResult }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading2] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("image", file);
    const resp = await fetch("/api/identify", {
      method: "POST",
      body: form,
    });
    const data = await resp.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="pest-uploader" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>পোকা/ক্ষতি চিহ্নিত করুন</h2>

      {/* Image selector – opens camera on mobile */}
      <input
        type="file"
        accept="image/jpeg,image/png"
        capture="environment"
        onChange={onFileChange}
      />

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={submit}
        disabled={!file || loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
        }}
      >
        {loading ? "প্রক্রিয়াকরণ…" : "পাঠান"}
      </button>
    </div>
  );
};

export default PestUploader;