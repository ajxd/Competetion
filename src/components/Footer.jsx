// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/registration">Register</Link>
        <Link to="/events">Events</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} Your Organization. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
