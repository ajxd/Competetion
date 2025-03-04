import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestFastestWalking.scss';

const ContestFastestWalking = () => {
  // Refs for the background canvas container, overlay, header, and content.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For interactive pointer tracking.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg feature.
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Background: Baby Footprints Animation
  // -------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return; // Guard clause to prevent errors if container is null

    let width = window.innerWidth;
    let height = window.innerHeight;
    // Create a full-screen canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'background-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Create an array of baby footprints (using the emoji 👣)
    const footprintCount = 60;
    const footprints = [];
    for (let i = 0; i < footprintCount; i++) {
      footprints.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: Math.random() * 1 + 0.5,
        fontSize: Math.random() * 20 + 30,
        symbol: '👣'
      });
    }

    // Update footprint positions; bounce off canvas edges
    const updateFootprints = () => {
      footprints.forEach(fp => {
        fp.x += fp.vx;
        fp.y += fp.vy;
        if (fp.x < 0 || fp.x > width) {
          fp.vx = -fp.vx;
        }
        if (fp.y < 0 || fp.y > height) {
          fp.vy = -fp.vy;
        }
      });
    };

    // Draw each footprint with a pastel gradient fill for a soft look
    const drawFootprints = () => {
      ctx.clearRect(0, 0, width, height);
      footprints.forEach(fp => {
        ctx.font = `${fp.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const grad = ctx.createLinearGradient(fp.x - fp.fontSize, fp.y, fp.x + fp.fontSize, fp.y);
        const pastel1 = `hsla(${Math.floor(Math.random() * 360)}, 70%, 85%, 1)`;
        const pastel2 = `hsla(${Math.floor(Math.random() * 360)}, 70%, 95%, 1)`;
        grad.addColorStop(0, pastel1);
        grad.addColorStop(1, pastel2);
        ctx.fillStyle = grad;
        ctx.fillText(fp.symbol, fp.x, fp.y);
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateFootprints();
      drawFootprints();
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
    <div className="contest-fastest-walking-page">
      <div ref={canvasContainerRef} className="canvas-container"></div>
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <h1 ref={headerRef}>Fastest Walking (9-15 months)</h1>
            <p className="tagline">"Step by Step, Everyone Can Win!"</p>
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
              Welcome to the Fastest Walking competition for our little champions!
              This contest celebrates every first step, encouraging toddlers to explore, move, and shine.
              Every tiny step counts in this fun race!
            </p>
            <p>
              Join us in this joyful celebration and let your little one be the star of the show!
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

export default ContestFastestWalking;
