import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestDrawing.scss';
import drawingImg from '../assets/images/drawing.png';

const ContestDrawing = () => {
  // Refs for the canvas container, overlay, header, content, pointer tracking, and Easter egg clicks.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Canvas Background: Painter’s Canvas Effect
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Create a full-screen canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create an array of paint splash circles
    const splashCount = 80;
    const splashes = [];
    for (let i = 0; i < splashCount; i++) {
      const radius = Math.random() * 30 + 20; // High-definition splashes
      splashes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius,
        // Two random hues for a dynamic gradient effect
        hue1: Math.floor(Math.random() * 360),
        hue2: Math.floor(Math.random() * 360)
      });
    }
    
    // Update splash positions with basic physics and bounce off edges
    const updateSplashes = () => {
      splashes.forEach(splash => {
        splash.x += splash.vx;
        splash.y += splash.vy;
        if (splash.x - splash.radius < 0 || splash.x + splash.radius > width) {
          splash.vx = -splash.vx;
          splash.x = Math.max(splash.radius, Math.min(splash.x, width - splash.radius));
        }
        if (splash.y - splash.radius < 0 || splash.y + splash.radius > height) {
          splash.vy = -splash.vy;
          splash.y = Math.max(splash.radius, Math.min(splash.y, height - splash.radius));
        }
        // Repulsion effect if pointer is nearby
        const dx = splash.x - pointerPosRef.current.x;
        const dy = splash.y - pointerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          splash.vx += (dx / dist) * force;
          splash.vy += (dy / dist) * force;
        }
      });
    };

    // Draw each splash using a radial gradient for a fluid, painted look
    const drawSplashes = () => {
      ctx.clearRect(0, 0, width, height);
      splashes.forEach(splash => {
        const grad = ctx.createRadialGradient(
          splash.x, splash.y, splash.radius * 0.2,
          splash.x, splash.y, splash.radius
        );
        grad.addColorStop(0, `hsla(${splash.hue1}, 80%, 90%, 0.8)`);
        grad.addColorStop(0.5, `hsla(${splash.hue2}, 90%, 70%, 0.6)`);
        grad.addColorStop(1, `hsla(${splash.hue1}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateSplashes();
      drawSplashes();
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    // Handle window resize events
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Update pointer position for interactive effects
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Easter Egg: if clicked in the top-left corner three times within 5 seconds, rotate overlay
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
  // Animate overlay content with GSAP and interactive parallax
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
    <div className="contest-drawing-page">
      {/* Canvas container for interactive background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay container */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            {/* Circular drawing image */}
            <div className="draw-img-wrapper">
              <img src={require('../assets/images/drawing.png')} alt="Drawing Competition" className="draw-img" />
            </div>
            <h1 ref={headerRef}>Drawing Competition</h1>
            <p className="tagline">"Every Line Tells a Story – Equal Canvas for All!"</p>
          </div>
          <div className="right-panel" ref={contentRef}>
            <p>
              Welcome to the Drawing Competition! This contest celebrates artistic expression.
              Every line, every stroke, and every color is your chance to tell a unique story.
            </p>
            <p>
              Unleash your creativity, explore new techniques, and share your masterpiece with the world!
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

export default ContestDrawing;
