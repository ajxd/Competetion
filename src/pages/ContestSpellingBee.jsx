import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestSpellingBee.scss';
import spellingImg from '../assets/images/spelling.png';

const ContestSpellingBee = () => {
  // Refs for interactive background, overlay, header, and content.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For interactive pointer tracking.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg feature.
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Background: Floating Letters Effect
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return; // Guard: proceed only if container exists

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Create a full-screen canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Create an array of floating letters from the alphabet
    const letters = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letterCount = 100;
    for (let i = 0; i < letterCount; i++) {
      letters.push({
        char: alphabet[Math.floor(Math.random() * alphabet.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: Math.random() * 1 + 0.5,
        fontSize: Math.random() * 20 + 30,
      });
    }

    // Update letter positions; wrap from bottom to top and sides.
    const updateLetters = () => {
      letters.forEach(letter => {
        letter.x += letter.vx;
        letter.y += letter.vy;
        if (letter.y - letter.fontSize > height) {
          letter.y = -letter.fontSize;
          letter.x = Math.random() * width;
        }
        if (letter.x < 0) letter.x = width;
        if (letter.x > width) letter.x = 0;
      });
    };

    // Draw each letter with a gradient fill for a vibrant effect
    const drawLetters = () => {
      ctx.clearRect(0, 0, width, height);
      letters.forEach(letter => {
        ctx.font = `${letter.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const grad = ctx.createLinearGradient(letter.x - letter.fontSize, letter.y, letter.x + letter.fontSize, letter.y);
        grad.addColorStop(0, `hsla(${Math.random()*360}, 80%, 60%, 1)`);
        grad.addColorStop(1, `hsla(${Math.random()*360}, 80%, 80%, 1)`);
        ctx.fillStyle = grad;
        ctx.fillText(letter.char, letter.x, letter.y);
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateLetters();
      drawLetters();
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (clientX < 100 && clientY < 100) {
        const now = Date.now();
        easterEggClicksRef.current = easterEggClicksRef.current.filter(t => now - t < 5000);
        easterEggClicksRef.current.push(now);
        if (easterEggClicksRef.current.length >= 3) {
          gsap.to(overlayRef.current, { duration: 1, rotation: 360, ease: 'power3.out' });
          easterEggClicksRef.current = [];
        }
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  // -------------------------------
  // Animate overlay content with GSAP and Parallax Effects
  // -------------------------------
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50, letterSpacing: '0px' },
      { opacity: 1, y: 0, letterSpacing: '3px', duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
    const handleOverlayParallax = (e) => {
      const offsetX = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 20;
      const offsetY = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 20;
      gsap.to(overlayRef.current, { x: offsetX, y: offsetY, duration: 0.5, ease: 'power2.out' });
    };
    window.addEventListener('pointermove', handleOverlayParallax);
    window.addEventListener('touchmove', handleOverlayParallax);
    return () => {
      window.removeEventListener('pointermove', handleOverlayParallax);
      window.removeEventListener('touchmove', handleOverlayParallax);
    };
  }, []);

  return (
    <div className="contest-spelling-page">
      <div ref={canvasContainerRef} className="canvas-container"></div>
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="spelling-img-wrapper">
              <img src={spellingImg} alt="Spelling Bee" className="spelling-img" />
            </div>
            <h1 ref={headerRef}>Spelling Bee</h1>
            <p className="tagline">"Spell Your Success – Equal Words for Every Child!"</p>
            {/* Coordinator Info placed immediately below the tagline */}
            <div className="coordinator-info">
              <div className="coordinator-photo">
                <img src={require('../assets/images/coordinator.jpg')} alt="Contest Coordinator" />
              </div>
              <div className="coordinator-details">
                <p><strong>Contest Coordinator 😊</strong></p>
                <p>Contact Number: 9884481399</p>
                <p>Mail Address: info@ranmars.com</p>
              </div>
            </div>
          </div>
          <div className="right-panel" ref={contentRef}>
            <p>
              Welcome to the Spelling Bee competition! This contest challenges young minds to
              spell words accurately and creatively. Every letter counts as you aim to spell your
              success. Are you ready to show off your spelling skills and become a champion?
            </p>
            <p>
              Embrace the challenge, learn new words, and let your knowledge shine!
            </p>
            <div className="cta">
              <a href="/registration" className="btn">Register Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestSpellingBee;
