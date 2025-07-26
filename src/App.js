import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MediaUpload from "./pages/MediaUpload";
import ImageGeneration from "./pages/ImageGeneration"; // optional if you built this
import Descriptionpage from "./pages/Descriptionpage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/media-upload" element={<MediaUpload />} />
        <Route path="/image-generation" element={<ImageGeneration />} />
        <Route path="/description" element={<Descriptionpage />} />
        <Route path="/" element={<MediaUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
