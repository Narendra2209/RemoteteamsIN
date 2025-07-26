import React, { useState } from "react";
import "./ImageGeneration.css";

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [webViewLink, setWebViewLink] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImages([]);
    setSelectedImage(null);
    setResponseData(null); // Reset previous response

    try {
      const webhookUrl =
        "https://rtaisrini.app.n8n.cloud/webhook/Image_generationIN";

      const formData = new FormData();
      formData.append("prompt", prompt);

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Webhook response:", data);

      setResponseData(data);
      
      setWebViewLink(data.webViewLink || null);

    } catch (error) {
      console.error("Error during webhook request:", error);
      setResponseData({ error: error.message }); 
    } finally {
      setLoading(false);
    }
  };

  function convertDriveUrlToPreview(driveUrl) {
  const match = driveUrl.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : driveUrl;
}

  const handleSelect = (img) => {
    setSelectedImage(img);
  };

  const renderImage = (url) => {
    if (url.includes("drive.google.com")) {
      return (
        <iframe
          src={convertDriveUrlToPreview(url)}
          width="320"
          height="240"
          allow="autoplay"
          style={{
            border: "none",
            borderRadius: "12px",
            marginBottom: "16px",
            display: "block",
          }}
          title="Drive Preview"
        />
      );
    }

    return (
      <img
        src={url}
        alt="Generated"
        style={{
          maxWidth: "320px",
          maxHeight: "240px",
          borderRadius: "12px",
          marginBottom: "16px",
          display: "block",
        }}
        onError={(e) => {
          e.target.src = "default-image.png";
        }}
      />
    );
  };

  return (
    <div className="image-generation-container">
      <h2>Generate Image</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="prompt-input"
      />
      <br />
      <button onClick={handleGenerate} className="generate-button">
        Generate Image
      </button>

      {loading && <p>Generating image...</p>}

      {images.length > 0 && (
        <div className="image-gallery">
          {images.map((img, index) => (
            <div key={index} onClick={() => handleSelect(img)}>
              {renderImage(img)}
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <strong>Selected Image URL:</strong>
          <p style={{ wordWrap: "break-word" }}>{selectedImage}</p>
        </div>
      )}

      {responseData && (
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          <strong>Generated Image</strong>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "12px",
              borderRadius: "8px",
              maxWidth: "90%",
              overflowX: "auto",
              margin: "12px auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            <iframe
      src={convertDriveUrlToPreview(webViewLink)}
      width="320"
      height="240"
      style={{
        border: "none",
        borderRadius: "12px",
        display: "block",
        margin: "0 auto"
      }}
      allow="autoplay"
    />
            {/* {JSON.stringify(responseData, null, 2)} */}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;
