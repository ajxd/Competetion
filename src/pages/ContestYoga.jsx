import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestYoga.scss';

const ContestYoga = () => {
  // Refs for canvas container, overlay container, header, and content
  const canvasContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For tracking pointer position
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For storing our bubble objects
  const bubblesRef = useRef([]);
  const bubbleCount = 30; // Increase for a denser effect if desired

  // -------------------------------
  // Interactive Background: Gradient Bubbles
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

    // Function to create bubble objects with glass-like gradient fill
    const createBubbles = () => {
      bubblesRef.current = [];
      for (let i = 0; i < bubbleCount; i++) {
        const baseRadius = Math.random() * 30 + 20;
        bubblesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius,
          radius: baseRadius,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          // Choose a random pastel hue
          hue: Math.floor(Math.random() * 360),
          // Alpha between 0.5 and 0.8 for a glassy look
          alpha: Math.random() * 0.3 + 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };
    createBubbles();

    // Update bubble positions, pulsate sizes, and apply pointer repulsion
    const updateBubbles = () => {
      bubblesRef.current.forEach(bubble => {
        // Pulsate the bubble size gently
        bubble.phase += 0.02;
        bubble.radius = bubble.baseRadius * (0.95 + 0.05 * Math.sin(bubble.phase));
        // Move the bubble
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        // Bounce off canvas edges
        if (bubble.x - bubble.baseRadius < 0 || bubble.x + bubble.baseRadius > width) {
          bubble.vx = -bubble.vx;
        }
        if (bubble.y - bubble.baseRadius < 0 || bubble.y + bubble.baseRadius > height) {
          bubble.vy = -bubble.vy;
        }
        // Repulsion from pointer: if pointer is near, push bubble away
        const dx = bubble.x - pointerPosRef.current.x;
        const dy = bubble.y - pointerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const repulsion = (150 - dist) / 150;
          bubble.x += (dx / dist) * repulsion * 2;
          bubble.y += (dy / dist) * repulsion * 2;
        }
      });
    };

    // Draw each bubble with a radial gradient to simulate a glass-like effect
    const drawBubbles = () => {
      ctx.clearRect(0, 0, width, height);
      bubblesRef.current.forEach(bubble => {
        const grad = ctx.createRadialGradient(
          bubble.x - bubble.radius / 3,
          bubble.y - bubble.radius / 3,
          bubble.radius * 0.1,
          bubble.x,
          bubble.y,
          bubble.radius
        );
        grad.addColorStop(0, `hsla(${bubble.hue}, 80%, 95%, ${bubble.alpha})`);
        grad.addColorStop(1, `hsla(${bubble.hue}, 80%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let animationFrameId;
    const animateCanvas = () => {
      updateBubbles();
      drawBubbles();
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    // Handle canvas resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createBubbles();
    };
    window.addEventListener('resize', handleResize);

    // Update pointer position on move
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerPosRef.current = { x: clientX, y: clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  // -------------------------------
  // Animate Overlay Content with GSAP & Parallax
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
    <div className="contest-yoga-page">
      {/* Interactive background container */}
      <div ref={canvasContainerRef} className="canvas-container"></div>
      {/* Overlay content */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            <h1 ref={headerRef}>Yoga Competition</h1>
            <p className="tagline">"Stretch, Breathe, Achieve – Equal Flexibility for All!"</p>
          </div>
          <div className="right-panel" ref={contentRef}>
            <p>
              Welcome to the Yoga Competition! Experience the harmony of body, mind, and spirit as
              young yogis demonstrate balance, strength, and grace. Whether it’s traditional asanas,
              creative yoga flows, or fun poses, every movement celebrates flexibility and mindfulness.
            </p>
            <p>
              Embrace calm energy, let your spirit soar, and join us to showcase your passion for yoga
              with exciting prizes awaiting!
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

export default ContestYoga;
