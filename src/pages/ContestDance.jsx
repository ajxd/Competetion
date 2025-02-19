import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestDance.scss';
import danceImg from '../assets/images/dance.png';

const ContestDance = () => {
  // Refs for the canvas background, overlay container, header, and content.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // Pointer position for interactive background effects.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Easter egg click tracker (for top-left corner clicks).
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Canvas Background (Dance Icons)
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

    // Array of dance icons – you can add more as needed.
    const icons = ['💃', '🕺', '👯‍♀️', '🎶'];
    const items = [];
    const itemCount = 100; // Increase for a denser effect
    for (let i = 0; i < itemCount; i++) {
      const baseFontSize = Math.random() * 20 + 30;
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        baseFontSize,
        char: icons[Math.floor(Math.random() * icons.length)],
        radius: baseFontSize / 2
      });
    }

    // (Optional) Arrays for sparkles or ripples on pointer down can be added here
    const sparkles = [];
    const ripples = [];

    // Helper: Create a radial gradient for each dance icon
    const getGradientForIcon = (item, fontSize, time) => {
      const gradient = ctx.createRadialGradient(
        item.x, item.y, fontSize / 4,
        item.x, item.y, fontSize
      );
      // For a dynamic, colorful effect, use random HSL values
      const hue1 = Math.floor(Math.random() * 360);
      const hue2 = (hue1 + 60) % 360;
      gradient.addColorStop(0, `hsla(${hue1}, 100%, 80%, 1)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 100%, 70%, 0.8)`);
      gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');
      return gradient;
    };

    // Update physics: move items, bounce off edges and simple collision response.
    const updatePhysics = () => {
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
      // Simple collision detection and response (swap velocities)
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i];
          const b = items[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < a.radius + b.radius) {
            const tempVx = a.vx;
            const tempVy = a.vy;
            a.vx = b.vx;
            a.vy = b.vy;
            b.vx = tempVx;
            b.vy = tempVy;
          }
        }
      }
    };

    let animationFrameId;
    const animateItems = () => {
      const time = Date.now();
      ctx.clearRect(0, 0, width, height);
      updatePhysics();
      // Draw each dance icon
      const pointerX = pointerPosRef.current.x;
      const pointerY = pointerPosRef.current.y;
      const threshold = 100;
      items.forEach(item => {
        const dx = item.x - pointerX;
        const dy = item.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scaleFactor = distance < threshold ? 1 + ((threshold - distance) / threshold) * 0.5 : 1;
        const currentFontSize = item.baseFontSize * scaleFactor;
        ctx.font = `${currentFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const gradient = getGradientForIcon(item, currentFontSize, time);
        ctx.fillStyle = gradient;
        ctx.fillText(item.char, item.x, item.y);
      });
      animationFrameId = requestAnimationFrame(animateItems);
    };
    animateItems();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMove = (e) => {
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('touchmove', handleMove);

    const handlePointerDown = (e) => {
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      // Easter Egg: if clicked in the top-left corner three times within 5 seconds, trigger an overlay rotation
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
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode === container) {
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
      {/* Canvas container for interactive dance icons background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay container with glass-like gradient content box */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            {/* Circular dance image */}
            <div className="dance-img-wrapper">
              <img src={danceImg} alt="Dance Challenge" className="dance-img" />
            </div>
            <h1 ref={headerRef}>Dance Challenge</h1>
            <p className="tagline">"Let Your Feet Speak – Everyone's Stage, Equal for All!"</p>
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
