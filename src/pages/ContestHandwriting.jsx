import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestHandwriting.scss';

const ContestHandwriting = () => {
  // Refs for the canvas container, overlay, header, content, pointer tracking, and Easter egg clicks.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Background: Handwritten Scribbles
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return; // Guard: proceed only if container exists

    let width = window.innerWidth;
    let height = window.innerHeight;
    // Create a full‑screen canvas.
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Create an array of "scribbles" that simulate flowing handwriting strokes.
    const scribbles = [];
    const scribbleCount = 80;
    for (let i = 0; i < scribbleCount; i++) {
      scribbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        length: Math.random() * 150 + 50,
        opacity: Math.random() * 0.5 + 0.3,
        lineWidth: Math.random() * 2 + 1,
        // Warm ink tones
        color: `hsla(${Math.floor(Math.random() * 20 + 20)}, 70%, 30%, 0.7)`
      });
    }

    const updateScribbles = () => {
      scribbles.forEach(scribble => {
        scribble.x += Math.cos(scribble.angle) * scribble.speed;
        scribble.y += Math.sin(scribble.angle) * scribble.speed;
        if (scribble.x < 0 || scribble.x > width) {
          scribble.angle = Math.PI - scribble.angle;
        }
        if (scribble.y < 0 || scribble.y > height) {
          scribble.angle = -scribble.angle;
        }
        // Modify the angle if the pointer is nearby.
        const dx = scribble.x - pointerPosRef.current.x;
        const dy = scribble.y - pointerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          scribble.angle += (dx / dist) * force * 0.05;
        }
      });
    };

    const drawScribbles = () => {
      ctx.clearRect(0, 0, width, height);
      scribbles.forEach(scribble => {
        ctx.beginPath();
        ctx.moveTo(scribble.x, scribble.y);
        const endX = scribble.x + Math.cos(scribble.angle) * scribble.length;
        const endY = scribble.y + Math.sin(scribble.angle) * scribble.length;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = scribble.color;
        ctx.globalAlpha = scribble.opacity;
        ctx.lineWidth = scribble.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateScribbles();
      drawScribbles();
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
    <div className="contest-handwriting-page">
      <div ref={canvasContainerRef} className="canvas-container"></div>
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="handwriting-img-wrapper">
              <img src={require('../assets/images/handwriting.png')} alt="Handwriting Competition" className="handwriting-img" />
            </div>
            <h1 ref={headerRef}>Handwriting Competition</h1>
            <p className="tagline">"Write Your Way to Success – Every Stroke Matters!"</p>
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
              Welcome to the Handwriting Competition! This contest celebrates the art of beautiful penmanship.
              Every stroke is an expression of creativity and discipline. Show us your best handwriting,
              and let your words make an impression!
            </p>
            <p>
              Whether it’s calligraphy, neat writing, or a unique style, every letter tells a story.
              Join us to showcase your skills and win exciting prizes!
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

export default ContestHandwriting;
