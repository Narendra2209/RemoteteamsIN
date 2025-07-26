import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Descriptionpage.css";

const DescriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const {
    mediaSrc,
    mediaUrl,
    mediaType,
    prompt,
    facebookCaption,
    instagramCaption,
    linkedinCaption,
    description,
    file, // Pass file if available
  } = location.state || {};

  // State for editing mode and captions
  const [isEditing, setIsEditing] = useState(false);
  const [fbCaption, setFbCaption] = useState(facebookCaption || "");
  const [igCaption, setIgCaption] = useState(instagramCaption || "");
  const [liCaption, setLiCaption] = useState(linkedinCaption || "");

  const handlePost = async () => {
    try {
      await fetch(
        "https://rtaisrini.app.n8n.cloud/webhook/Caption_generateIN",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaSrc,
            mediaUrl,
            mediaType,
            prompt,
            facebookCaption: fbCaption,
            instagramCaption: igCaption,
            linkedinCaption: liCaption,
            description,
          }),
        }
      );
      alert("Posted successfully!");
    } catch (err) {
      alert("Failed to post.");
    }
  };

  const handleReject = () => {
    navigate("/"); // Go to home page
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  // Regenerate: navigate to MediaUpload and pass media info
  const handleRegenerate = () => {
    navigate("/upload", {
      state: {
        mediaSrc,
        mediaType,
        prompt,
        file,
        autoUpload: true, // flag to trigger upload
      },
    });
  };

  if (!mediaSrc && !mediaUrl) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No media found. Go back and upload.</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

function convertDriveUrlToPreview(driveUrl) {
  const match = driveUrl.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : driveUrl;
}


  return (
    <div className="description-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Media Description</h1>
        {!isEditing ? (
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
        ) : (
          <button className="save-btn" onClick={handleSaveClick}>Save</button>
        )}
      </div>
      
{mediaType === "image" ? (
  mediaUrl.includes("drive.google.com") ? (
    <iframe
      src={convertDriveUrlToPreview(mediaUrl)}
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
  ) : (
    <img
      src={mediaUrl}
      alt="Uploaded Media"
      style={{
        maxWidth: "320px",
        maxHeight: "240px",
        borderRadius: "12px",
        display: "block",
        margin: "0 auto"
      }}
    />
  )
) : (
  <video
    src={mediaUrl}
    controls
    style={{
      maxWidth: "320px",
      maxHeight: "240px",
      borderRadius: "12px",
      margin: "0 auto",
      display: "block"
    }}
  />
)}


      <div className="platform-captions">
        {isEditing ? (
          <>
            <div>
              <strong>Facebook:</strong>
              <input
                type="text"
                value={fbCaption}
                onChange={e => setFbCaption(e.target.value)}
                style={{ width: "80%", marginLeft: "8px" }}
              />
            </div>
            <div>
              <strong>Instagram:</strong>
              <input
                type="text"
                value={igCaption}
                onChange={e => setIgCaption(e.target.value)}
                style={{ width: "80%", marginLeft: "8px" }}
              />
            </div>
            <div>
              <strong>LinkedIn:</strong>
              <input
                type="text"
                value={liCaption}
                onChange={e => setLiCaption(e.target.value)}
                style={{ width: "80%", marginLeft: "8px" }}
              />
            </div>
          </>
        ) : (
          <>
            {fbCaption && (
              <p>
                <strong>Facebook:</strong> {fbCaption}
              </p>
            )}
            {igCaption && (
              <p>
                <strong>Instagram:</strong> {igCaption}
              </p>
            )}
            {liCaption && (
              <p>
                <strong>LinkedIn:</strong> {liCaption}
              </p>
            )}
          </>
        )}
      </div>

      {/* {mediaUrl && (
        <div className="media-link">
          <strong>Uploaded File Link:</strong>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {mediaUrl}
          </a>
        </div>
      )} */}

      <div style={{ marginTop: "24px" }}>
        <button className="upload-btn" onClick={handlePost}>
          Post
        </button>
        {/* <button
          className="regenerate-btn"
          onClick={handleRegenerate}
          style={{ marginLeft: "12px" }}
        >
          Regenerate
        </button> */}
        <button
          className="cancel-btn"
          onClick={handleReject}
          style={{ marginLeft: "12px" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default DescriptionPage;