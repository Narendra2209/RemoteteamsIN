import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './MediaUpload.css';


const MediaUpload = () => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef();

  const log = (label, data) => console.log(`[MediaUpload] ${label}:`, data);

  const getMediaType = (type) => {
    if (type.startsWith("image")) return "image";
    if (type.startsWith("video")) return "video";
    return null;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    const type = getMediaType(selectedFile.type);

    setFile(selectedFile);
    setMediaSrc(url);
    setMediaType(type);
    setMediaUrl(null);

    log("File selected", {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
      mediaType: type,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("media", file);
    formData.append("prompt", prompt || "Describe this media");

    try {
      const response = await fetch(
        "https://rtaisrini.app.n8n.cloud/webhook/media-caption-receive",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Server response", result);

      if (response.status !== 200) {
        throw new Error(`Upload failed with status ${response.status}`);
      } else {
        const content = result?.message?.content || {};
        const webViewLink = result?.webViewLink;
        setMediaUrl(webViewLink);

        const facebookCaption = content?.Facebook?.caption || "";
        const instagramCaption = content?.Instagram?.caption || "";
        const linkedinCaption = content?.LinkedIn?.caption || "";

        const description =
          facebookCaption ||
          instagramCaption ||
          linkedinCaption ||
          "No description returned.";

        navigate("/description", {
          state: {
            mediaSrc,
            mediaUrl: webViewLink,
            facebookCaption,
            instagramCaption,
            linkedinCaption,
            mediaType,
            prompt,
            description,
          },
        });
      }
    } catch (error) {
      console.error("[MediaUpload] Upload failed:", error);
      alert("Upload failed. Please check the console for more details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <p>Upload your images or videos to generate an AI-generated description</p>

      <div
        className={`drop-area ${isDragging ? "dragging" : ""}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="icon">&#8682;</div>
        <p>Drag and drop your media here</p>
        <span>or</span>
        <button type="button" className="browse-btn">
          Browse Files
        </button>
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {mediaSrc && (
        <div className="preview">
          {mediaType === "image" ? (
            <img src={mediaSrc} alt="Uploaded preview" />
          ) : (
            <video src={mediaSrc} controls />
          )}
          <input
            type="text"
            placeholder="Enter an optional prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      )}

      <button
        className="submit-btn"
        onClick={handleUpload}
        disabled={!file || isLoading}
      >
        {isLoading ? "Loading..." : "Generate Description →"}
      </button>

      {mediaUrl && (
        <div className="media-link">
          <p>Uploaded File Link:</p>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {mediaUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
