// src/components/InteractiveParticles.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './InteractiveParticles.scss';

const InteractiveParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up basic Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.zIndex = '-1'; // Make sure particles are in the background

    containerRef.current.appendChild(renderer.domElement);

    // Create particles geometry
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Random positions spread in space
      positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(200);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(200);
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(200);
      
      // Random gradient-like colors (for example, hues around orange/blue)
      color.setHSL(Math.random() * 0.2 + 0.05, 0.7, 0.5);
      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a Points material with a small particle size and enable vertex colors.
    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    // Create the particle system and add to the scene
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation loop: rotate particles and update the renderer
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005; // Slow rotation for a dreamy effect
      renderer.render(scene, camera);
    };
    animate();

    // Add a mouse move event listener to create an interactive parallax effect.
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates (-1 to 1)
      const mouseX = (event.clientX / width) * 2 - 1;
      const mouseY = -(event.clientY / height) * 2 + 1;
      // Move the camera slightly based on mouse position for parallax effect.
      camera.position.x = mouseX * 20;
      camera.position.y = mouseY * 20;
      camera.lookAt(scene.position);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="interactive-particles" />;
};

export default InteractiveParticles;
