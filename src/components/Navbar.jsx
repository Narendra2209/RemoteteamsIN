import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Company Logo" className="logo" />
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <Link to="/media-upload" onClick={() => setIsOpen(false)}>Media Upload</Link>
        <Link to="/image-generation" onClick={() => setIsOpen(false)}>Image Generation</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
