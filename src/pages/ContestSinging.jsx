import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestSinging.scss';
// We import the image only if you plan to use it via an import.
// Otherwise, since we are using require in the JSX, you can remove this import.
// import singImg from '../assets/images/sing.png';

const ContestSinging = () => {
  // Define refs for the shader and notes container, overlay, header, and content.
  const shaderContainerRef = useRef(null);
  const notesContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For tracking pointer position for interactive effects.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg feature (clicks in the top-left corner).
  const easterEggClicksRef = useRef([]);

  // -------------------------------
  // Interactive WebGL Shader Background
  // -------------------------------
  useEffect(() => {
    const container = shaderContainerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'shader-canvas';
    container.appendChild(canvas);
    
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    
    // Vertex shader (passthrough)
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;
    // Fragment shader (fluid-like effect that reacts to time and pointer)
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_pointer;
      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        float color = 0.0;
        color += sin(st.x * 10.0 + u_time) * 0.5 + 0.5;
        color += sin(st.y * 10.0 - u_time) * 0.5 + 0.5;
        color += sin((st.x + st.y) * 10.0 + u_time) * 0.5 + 0.5;
        color /= 3.0;
        vec2 pointerNorm = u_pointer / u_resolution;
        float pointerEffect = distance(st, pointerNorm);
        color = mix(color, 1.0 - pointerEffect, 0.3);
        gl_FragColor = vec4(vec3(color), 0.8);
      }
    `;
    
    // Shader compilation helper
    const compileShader = (gl, source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    
    // Set up full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uPointer = gl.getUniformLocation(program, 'u_pointer');
    gl.uniform2f(uResolution, width, height);
    
    let shaderAnimationId;
    const renderShader = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uTime, performance.now() / 1000);
      gl.uniform2f(uPointer, pointerPosRef.current.x, pointerPosRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      shaderAnimationId = requestAnimationFrame(renderShader);
    };
    renderShader();
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(shaderAnimationId);
      container.removeChild(canvas);
    };
  }, []);
  
  // -------------------------------
  // 2D Interactive Musical Notes with Physics and Easter Eggs
  // -------------------------------
  useEffect(() => {
    const container = notesContainerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'notes-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create musical note objects with physics properties
    const noteChars = ['♪', '♫', '♩', '♬'];
    const notes = [];
    const noteCount = 100;
    for (let i = 0; i < noteCount; i++) {
      const baseFontSize = Math.random() * 20 + 30;
      notes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        baseFontSize,
        char: noteChars[Math.floor(Math.random() * noteChars.length)],
        radius: baseFontSize / 2
      });
    }
    
    const sparkles = [];
    const ripples = [];
    
    // Helper: Generate radial gradient for each note
    const getGradientForNote = (note, fontSize, time) => {
      const gradient = ctx.createRadialGradient(
        note.x, note.y, fontSize / 4,
        note.x, note.y, fontSize
      );
      const mod = 0.8 + 0.2 * Math.abs(Math.sin(time / 1000 + note.x));
      switch (note.char) {
        case '♪':
          gradient.addColorStop(0, 'rgba(255,80,80,1)');
          gradient.addColorStop(0.5, `rgba(255,160,80,${mod})`);
          gradient.addColorStop(1, 'rgba(255,240,200,0)');
          break;
        case '♫':
          gradient.addColorStop(0, 'rgba(150,80,255,1)');
          gradient.addColorStop(0.5, `rgba(200,150,255,${mod})`);
          gradient.addColorStop(1, 'rgba(240,200,255,0)');
          break;
        case '♩':
          gradient.addColorStop(0, 'rgba(80,150,255,1)');
          gradient.addColorStop(0.5, `rgba(80,200,255,${mod})`);
          gradient.addColorStop(1, 'rgba(200,240,255,0)');
          break;
        case '♬':
          gradient.addColorStop(0, 'rgba(80,255,150,1)');
          gradient.addColorStop(0.5, `rgba(150,255,200,${mod})`);
          gradient.addColorStop(1, 'rgba(200,255,240,0)');
          break;
        default:
          gradient.addColorStop(0, 'rgba(255,100,150,1)');
          gradient.addColorStop(0.5, `rgba(100,200,255,${mod})`);
          gradient.addColorStop(1, 'rgba(150,255,100,0)');
      }
      return gradient;
    };
    
    // Helper: Gradient for sparkles
    const getGradientForSparkle = (sparkle) => {
      const gradient = ctx.createRadialGradient(
        sparkle.x, sparkle.y, sparkle.fontSize / 4,
        sparkle.x, sparkle.y, sparkle.fontSize
      );
      gradient.addColorStop(0, `rgba(255,215,0,${sparkle.opacity})`);
      gradient.addColorStop(1, `rgba(255,215,0,0)`);
      return gradient;
    };
    
    // Helper: Draw ripple effect
    const drawRipple = (ripple) => {
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,165,0,${ripple.opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    };
    
    // Physics update: update positions, bounce off edges and each other
    const updatePhysics = () => {
      notes.forEach(note => {
        note.x += note.vx;
        note.y += note.vy;
        if (note.x - note.radius < 0 || note.x + note.radius > width) {
          note.vx = -note.vx;
          note.x = Math.max(note.radius, Math.min(note.x, width - note.radius));
        }
        if (note.y - note.radius < 0 || note.y + note.radius > height) {
          note.vy = -note.vy;
          note.y = Math.max(note.radius, Math.min(note.y, height - note.radius));
        }
      });
      for (let i = 0; i < notes.length; i++) {
        for (let j = i + 1; j < notes.length; j++) {
          const noteA = notes[i];
          const noteB = notes[j];
          const dx = noteA.x - noteB.x;
          const dy = noteA.y - noteB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < noteA.radius + noteB.radius) {
            const tempVx = noteA.vx;
            const tempVy = noteA.vy;
            noteA.vx = noteB.vx;
            noteA.vy = noteB.vy;
            noteB.vx = tempVx;
            noteB.vy = tempVy;
          }
        }
      }
    };
    
    let animationFrameId;
    const animateNotes = () => {
      const time = Date.now();
      ctx.clearRect(0, 0, width, height);
      updatePhysics();
      
      // Draw persistent musical notes with interactive scaling
      const pointerX = pointerPosRef.current.x;
      const pointerY = pointerPosRef.current.y;
      const threshold = 100;
      notes.forEach(note => {
        const dx = note.x - pointerX;
        const dy = note.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scaleFactor = distance < threshold ? 1 + ((threshold - distance) / threshold) * 0.5 : 1;
        const currentFontSize = note.baseFontSize * scaleFactor;
        ctx.font = `${currentFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const gradient = getGradientForNote(note, currentFontSize, time);
        ctx.fillStyle = gradient;
        ctx.fillText(note.char, note.x, note.y);
      });
      
      // Update and draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.fontSize += sparkle.growth;
        sparkle.opacity -= 0.01;
        if (sparkle.opacity <= 0) {
          sparkles.splice(i, 1);
        } else {
          ctx.font = `${sparkle.fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const gradient = getGradientForSparkle(sparkle);
          ctx.fillStyle = gradient;
          ctx.fillText(sparkle.char, sparkle.x, sparkle.y);
        }
      }
      
      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.growth;
        ripple.opacity -= 0.02;
        if (ripple.opacity <= 0) {
          ripples.splice(i, 1);
        } else {
          drawRipple(ripple);
        }
      }
      
      animationFrameId = requestAnimationFrame(animateNotes);
    };
    animateNotes();
    
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
      // Easter Egg: if clicked in the top-left corner three times in 5 seconds, trigger a 360° overlay rotation.
      if (clientX < 100 && clientY < 100) {
        const now = Date.now();
        easterEggClicksRef.current = easterEggClicksRef.current.filter(t => now - t < 5000);
        easterEggClicksRef.current.push(now);
        if (easterEggClicksRef.current.length >= 3) {
          gsap.to('.overlay', { duration: 1, rotation: 360, ease: 'power3.out' });
          easterEggClicksRef.current = [];
        }
      }
      sparkles.push({
        x: clientX,
        y: clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        fontSize: 30,
        growth: 0.5,
        opacity: 1,
        char: '★'
      });
      ripples.push({
        x: clientX,
        y: clientY,
        radius: 0,
        growth: 3,
        opacity: 1
      });
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
      container.removeChild(canvas);
    };
  }, []);

  // -------------------------------
  // Animate overlay content with GSAP
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
    <div className="contest-singing-page">
      {/* WebGL shader background container */}
      <div ref={shaderContainerRef} className="shader-container"></div>
      {/* 2D interactive notes canvas container */}
      <div ref={notesContainerRef} className="notes-container"></div>
      {/* Overlay content */}
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="left-panel">
            {/* Image of the Indian girl singing inside the overlay */}
            <div className="sing-img-wrapper">
              <img src={require('../assets/images/sing.png')} alt="Indian Girl Singing" className="sing-img" />
            </div>
            <h1 ref={headerRef}>Singing Contest</h1>
            <p className="tagline">"Sing Your Heart Out – A Voice for Every Dream!"</p>
          </div>
          <div className="right-panel" ref={contentRef}>
            <p>
              Welcome to the Singing Contest! This competition celebrates every voice,
              encouraging young talents to sing with passion and confidence. Whether it’s
              lullabies, pop, or classical tunes, your voice has the power to inspire.
            </p>
            <p>
              Step into the spotlight, hit every note, and let your musical journey begin!
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

export default ContestSinging;
