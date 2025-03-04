import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import ranmarsLogo from "../assets/images/ranmars.png";
import "./Header.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);

  useEffect(() => {
    if (menuOpen) {
      // Slide in the menu from the right
      gsap.to(menuRef.current, { duration: 0.5, right: 0, opacity: 1, ease: "power3.out" });
      // Animate hamburger lines into an “X”
      gsap.to(line1.current, { rotation: 45, y: 8, duration: 0.3 });
      gsap.to(line2.current, { opacity: 0, duration: 0.3 });
      gsap.to(line3.current, { rotation: -45, y: -8, duration: 0.3 });
    } else {
      // Slide out the menu
      gsap.to(menuRef.current, { duration: 0.5, right: "-100%", opacity: 0, ease: "power3.in" });
      // Revert hamburger lines back to original state
      gsap.to(line1.current, { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(line2.current, { opacity: 1, duration: 0.3 });
      gsap.to(line3.current, { rotation: 0, y: 0, duration: 0.3 });
    }
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={ranmarsLogo} alt="Ranmars Logo" className="logo-img" />
        </Link>
      </div>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div ref={line1} className="line"></div>
        <div ref={line2} className="line"></div>
        <div ref={line3} className="line"></div>
      </div>
      <nav ref={menuRef} className="nav-menu">
        <ul>
          <li><Link to="/">Home</Link></li>
    
          <li><Link to="/registration">Register</Link></li>
         
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
