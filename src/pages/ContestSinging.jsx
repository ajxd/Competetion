import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContestSinging.scss';
import singImg from '../assets/images/sing.png';

const ContestSinging = () => {
  // Define refs for shader, notes, overlay, header, and content.
  const shaderContainerRef = useRef(null);
  const notesContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  // For tracking pointer position for interactive effects.
  const pointerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // For the Easter egg feature.
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
    
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;
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
  
  // (Optional: Interactive musical notes code would go here.)
  
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
    <div className="contest-singing-page">
      <div ref={shaderContainerRef} className="shader-container"></div>
      <div ref={notesContainerRef} className="notes-container"></div>
      <div className="overlay" ref={overlayRef}>
        <div className="content-wrapper">
          <div className="box main-box">
            <div className="left-panel">
              <div className="sing-img-wrapper">
                <img src={singImg} alt="Indian Girl Singing" className="sing-img" />
              </div>
              <h1 ref={headerRef}>Singing Contest</h1>
              <p className="tagline">"Sing Your Heart Out – A Voice for Every Dream!"</p>
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
          {/* Optionally, if you prefer a separate coordinator box, you can add it here */}
        </div>
      </div>
    </div>
  );
};

export default ContestSinging;
