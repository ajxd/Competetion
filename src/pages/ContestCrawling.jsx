import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestCrawling.scss';

const ContestCrawling = () => {
  // Refs for canvas background, overlay container, header, and content.
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For interactive pointer tracking.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg (triple-click in top-left).
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive Background: "Crawling Trails"
  // -------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Generate several "trails" that flow across the canvas
    const trailCount = 12;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
      // Each trail is a set of control points for a smooth curve.
      const pointCount = 5;
      const points = [];
      for (let j = 0; j < pointCount; j++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Each control point moves slowly.
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
        });
      }
      trails.push(points);
    }

    // Update trails positions and add a subtle pointer repulsion.
    const updateTrails = () => {
      trails.forEach(points => {
        points.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          // Bounce off edges
          if (p.x < 0 || p.x > width) p.vx = -p.vx;
          if (p.y < 0 || p.y > height) p.vy = -p.vy;
          // If the pointer is near, push the point away.
          const dx = p.x - pointerPosRef.current.x;
          const dy = p.y - pointerPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        });
      });
    };

    // Draw each trail as a smooth bezier curve with a soft, glowing gradient.
    const drawTrails = () => {
      ctx.clearRect(0, 0, width, height);
      trails.forEach((points, idx) => {
        // Choose a unique pastel color for each trail.
        const hue = (idx * 360) / trailCount;
        ctx.strokeStyle = `hsla(${hue}, 70%, 85%, 0.8)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Use the first point as the start.
        ctx.moveTo(points[0].x, points[0].y);
        // For each segment, use quadratic curves between points.
        for (let i = 0; i < points.length - 1; i++) {
          const midX = (points[i].x + points[i + 1].x) / 2;
          const midY = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
        }
        // Connect to the last point.
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateTrails();
      drawTrails();
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    // Update canvas size on resize.
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Update pointer position.
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Easter Egg: Rotate overlay if top-left is clicked three times in 5 seconds.
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
    };
  }, []);

  // -------------------------------
  // Animate Overlay Content with GSAP and Parallax Effects
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
    <div className="contest-crawling-page">
      {/* Full-screen interactive background canvas */}
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      {/* Overlay content */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <h1 ref={headerRef}>Crawling (5-9 months)</h1>
            <p className="tagline">"Crawl, Explore, and Grow – Equal for Every Little One!"</p>
          </div>
          <div className="right-panel" ref={contentRef}>
            <p>
              This page explains the Crawling competition. Encourage your little one to explore and take those first steps.
              Every tiny movement is a milestone on their journey to growth and discovery!
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

export default ContestCrawling;
