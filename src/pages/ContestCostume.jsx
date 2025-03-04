import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestCostume.scss';
import costumeImg from '../assets/images/costume.png'; // Ensure you have a costume image

const ContestCostume = () => {
  // Refs for canvas container and overlay elements
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // Pointer position for interactive effects
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Easter egg clicks (for rotation)
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Canvas Background with Physics‑Based Bubbles
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

    // Create an array of bubbles ("glass" bubbles)
    const bubbleCount = 150;
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.random() * 20 + 10;
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius,
        colorStops: [
          { offset: 0, color: `hsla(${Math.random() * 360}, 100%, 80%, 1)` },
          { offset: 1, color: `hsla(${Math.random() * 360}, 100%, 50%, 0)` }
        ]
      });
    }

    const updateBubbles = () => {
      bubbles.forEach(bubble => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > width) {
          bubble.vx = -bubble.vx;
          bubble.x = Math.max(bubble.radius, Math.min(bubble.x, width - bubble.radius));
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > height) {
          bubble.vy = -bubble.vy;
          bubble.y = Math.max(bubble.radius, Math.min(bubble.y, height - bubble.radius));
        }
        const dx = bubble.x - pointerPosRef.current.x;
        const dy = bubble.y - pointerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          bubble.vx += (dx / dist) * force;
          bubble.vy += (dy / dist) * force;
        }
      });
    };

    const drawBubbles = () => {
      ctx.clearRect(0, 0, width, height);
      bubbles.forEach(bubble => {
        const grad = ctx.createRadialGradient(
          bubble.x, bubble.y, bubble.radius * 0.3,
          bubble.x, bubble.y, bubble.radius
        );
        bubble.colorStops.forEach(stop => {
          grad.addColorStop(stop.offset, stop.color);
        });
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let animationFrameId;
    const animate = () => {
      updateBubbles();
      drawBubbles();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

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
    <div className="contest-costume-page">
      {/* Container for the interactive background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay container with content box */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="costume-img-wrapper">
              <img src={costumeImg} alt="Costume Parade" className="costume-img" />
            </div>
            <h1 ref={headerRef}>Costume Parade</h1>
            <p className="tagline">"Dress to Impress, Show Your Best – Equal for All!"</p>
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
              Welcome to the Costume Parade! This competition celebrates creativity in dressing and style.
              Unleash your imagination, wear your favorite costume, and make a bold statement.
            </p>
            <p>
              Show your unique style and let your personality shine through your outfit.
              Get ready for a day full of fun, fashion, and excitement!
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

export default ContestCostume;
