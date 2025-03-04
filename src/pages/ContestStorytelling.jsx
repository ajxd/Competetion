import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestStorytelling.scss';
import singImg from '../assets/images/sing.png'; // Replace with your storytelling image if needed

const ContestStorytelling = () => {
  // Refs for the interactive background, overlay, header, and content.
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For interactive pointer tracking.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg feature.
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive "Magical Ink" Background
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

    let time = 0;
    const animateCanvas = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);
      
      // Create several "ink blobs" that swirl and react to the pointer.
      const blobCount = 15;
      for (let i = 0; i < blobCount; i++) {
        const angle = time + (i * 2 * Math.PI) / blobCount;
        const radius = 80 + 30 * Math.sin(time * 2 + i);
        const x = width / 2 + (width / 3) * Math.cos(angle) + (pointerPosRef.current.x - width / 2) * 0.1;
        const y = height / 2 + (height / 3) * Math.sin(angle) + (pointerPosRef.current.y - height / 2) * 0.1;
        
        const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
        const hue = (360 * Math.abs(Math.sin(angle))) | 0;
        grad.addColorStop(0, `hsla(${hue}, 100%, 90%, 0.8)`);
        grad.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 100%, 70%, 0.6)`);
        grad.addColorStop(1, `hsla(${(hue + 60) % 360}, 100%, 50%, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animateCanvas);
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
    <div className="contest-storytelling-page">
      {/* Container for the interactive magical ink background */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay content container */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <div className="story-img-wrapper">
              <img src={singImg} alt="Storytelling" className="story-img" />
            </div>
            <h1 ref={headerRef}>Storytelling</h1>
            <p className="tagline">"Every Tale is Magical – Let Your Story Shine!"</p>
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
              Welcome to the Storytelling competition! This contest celebrates the art of narrative,
              inviting young storytellers to share their magical tales. Whether it’s a fairy tale, myth,
              or a personal story, every narrative has the power to inspire.
            </p>
            <p>
              Immerse yourself in a world of imagination—let your words soar and your stories come to life!
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

export default ContestStorytelling;
