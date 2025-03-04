import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestDance.scss';
import danceImg from '../assets/images/dance.png'; // Ensure you have your dance image

const ContestDance = () => {
  // Refs for the canvas background, overlay container, header, and content.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // Pointer position for interactive background effects.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Easter egg click tracker (for top-left clicks).
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Canvas Background (Dance Icons / Bubbles)
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Example: Create an array of dance icons (or bubbles) for the background effect.
    const icons = ['💃', '🕺', '🎶'];
    const items = [];
    const itemCount = 100;
    for (let i = 0; i < itemCount; i++) {
      const baseFontSize = Math.random() * 20 + 30;
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        baseFontSize,
        char: icons[Math.floor(Math.random() * icons.length)],
        radius: baseFontSize / 2,
      });
    }

    const getGradientForIcon = (item, fontSize, time) => {
      const gradient = ctx.createRadialGradient(
        item.x, item.y, fontSize / 4,
        item.x, item.y, fontSize
      );
      const hue = Math.floor(Math.random() * 360);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 85%, 1)`);
      gradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 100%, 75%, 0.8)`);
      gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');
      return gradient;
    };

    const updateItems = () => {
      items.forEach(item => {
        item.x += item.vx;
        item.y += item.vy;
        if (item.x - item.radius < 0 || item.x + item.radius > width) {
          item.vx = -item.vx;
          item.x = Math.max(item.radius, Math.min(item.x, width - item.radius));
        }
        if (item.y - item.radius < 0 || item.y + item.radius > height) {
          item.vy = -item.vy;
          item.y = Math.max(item.radius, Math.min(item.y, height - item.radius));
        }
      });
    };

    const drawItems = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now();
      items.forEach(item => {
        ctx.font = `${item.baseFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const gradient = getGradientForIcon(item, item.baseFontSize, time);
        ctx.fillStyle = gradient;
        ctx.fillText(item.char, item.x, item.y);
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateItems();
      drawItems();
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
  // Animate overlay content with GSAP and Parallax
  // -------------------------------
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, scale: 0.8, y: -50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)' }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50, letterSpacing: '0px' },
      { opacity: 1, y: 0, letterSpacing: '3px', duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
    const handleOverlayParallax = (e) => {
      const offsetX = ((e.clientX - window.innerWidth/2) / window.innerWidth) * 20;
      const offsetY = ((e.clientY - window.innerHeight/2) / window.innerHeight) * 20;
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
    <div className="contest-dance-page">
      {/* Canvas container for interactive background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay container with glass-like content box */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="dance-img-wrapper">
              <img src={danceImg} alt="Dance Challenge" className="dance-img" />
            </div>
            <h1 ref={headerRef}>Dance Challenge</h1>
            <p className="tagline">"Let Your Feet Speak – Everyone's Stage, Equal for All!"</p>
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
              Welcome to the Dance Challenge! This competition celebrates the art of movement,
              where every step tells a story. Whether it’s classical ballet, contemporary,
              or street dance, let your creativity flow and show the world your passion.
            </p>
            <p>
              Get ready to light up the stage, dazzle the audience, and make your mark in the world of dance!
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

export default ContestDance;
