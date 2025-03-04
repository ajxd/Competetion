import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestColoring.scss';
import coloringImg from '../assets/images/coloring.png';

const ContestColoring = () => {
  // Refs for canvas background, overlay, header, content, pointer tracking, and Easter egg clicks.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Canvas Background: Custom Paint Splashes
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Create full-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create an array of irregular polygon "splashes"
    const splatCount = 80;
    const splats = [];
    for (let i = 0; i < splatCount; i++) {
      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      const baseRadius = Math.random() * 40 + 20;
      const vertexCount = Math.floor(Math.random() * 4) + 5;
      let vertices = [];
      for (let j = 0; j < vertexCount; j++) {
        const angle = (j / vertexCount) * Math.PI * 2;
        const r = baseRadius * (0.7 + Math.random() * 0.6);
        vertices.push({
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
        });
      }
      splats.push({
        centerX,
        centerY,
        baseRadius,
        vertices,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hue: Math.floor(Math.random() * 360),
      });
    }
    
    const updateSplats = () => {
      splats.forEach(splat => {
        splat.centerX += splat.vx;
        splat.centerY += splat.vy;
        splat.vertices = splat.vertices.map(vertex => ({
          x: vertex.x + splat.vx,
          y: vertex.y + splat.vy,
        }));
        if (splat.centerX - splat.baseRadius < 0 || splat.centerX + splat.baseRadius > width) {
          splat.vx = -splat.vx;
        }
        if (splat.centerY - splat.baseRadius < 0 || splat.centerY + splat.baseRadius > height) {
          splat.vy = -splat.vy;
        }
        const dx = splat.centerX - pointerPosRef.current.x;
        const dy = splat.centerY - pointerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          splat.vx += (dx / dist) * force;
          splat.vy += (dy / dist) * force;
        }
      });
    };

    const drawSplats = () => {
      ctx.clearRect(0, 0, width, height);
      splats.forEach(splat => {
        const grad = ctx.createRadialGradient(
          splat.centerX,
          splat.centerY,
          splat.baseRadius * 0.2,
          splat.centerX,
          splat.centerY,
          splat.baseRadius
        );
        grad.addColorStop(0, `hsla(${splat.hue}, 100%, 85%, 0.8)`);
        grad.addColorStop(0.5, `hsla(${splat.hue}, 100%, 65%, 0.6)`);
        grad.addColorStop(1, `hsla(${splat.hue}, 100%, 45%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (splat.vertices.length > 0) {
          ctx.moveTo(splat.vertices[0].x, splat.vertices[0].y);
          splat.vertices.slice(1).forEach(vertex => {
            ctx.lineTo(vertex.x, vertex.y);
          });
          ctx.closePath();
          ctx.fill();
        }
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateSplats();
      drawSplats();
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const handlePointerMove = (e) => {
      let clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);
    
    const handlePointerDown = (e) => {
      let clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let clientY = e.touches ? e.touches[0].clientY : e.clientY;
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
    <div className="contest-coloring-page">
      {/* Container for the interactive background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay content */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="coloring-img-wrapper">
              <img src={coloringImg} alt="Coloring Competition" className="coloring-img" />
            </div>
            <h1 ref={headerRef}>Coloring Competition</h1>
            <p className="tagline">"Color Your World – Creativity Knows No Boundaries!"</p>
            {/* Contest Coordinator Info placed immediately below the tagline */}
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
              Welcome to the Coloring Competition! Express your creativity by bringing vibrant colors to life.
              Every hue, every shade, and every stroke is a chance to create something truly unique.
            </p>
            <p>
              Unleash your inner artist, experiment with colors, and let your imagination run wild on your canvas!
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

export default ContestColoring;
