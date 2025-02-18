import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './RainbowBalls.scss';

const RainbowBalls = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    // Ensure this layer is behind your content
    renderer.domElement.style.zIndex = '-1';

    container.appendChild(renderer.domElement);

    // Create a group to hold our gradient balls
    const ballsGroup = new THREE.Group();
    scene.add(ballsGroup);

    // Function to create a high-resolution gradient texture with new colors.
    const createGradientTexture = () => {
      const size = 1024; // High resolution for 4K definition
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Clear the canvas
      ctx.clearRect(0, 0, size, size);
      
      // Create a radial gradient from the center to the edge.
      const gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      
      // New gradient stops:
      // Start with deep blue, move to a rich purple, then fade to a soft pink (transparent)
      gradient.addColorStop(0, 'rgba(0, 123, 255, 1)');   // Deep blue at the center
      gradient.addColorStop(0.5, 'rgba(123, 0, 255, 1)');   // Rich purple in the middle
      gradient.addColorStop(1, 'rgba(255, 0, 123, 0)');     // Soft pink, fading to transparent at the edge

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    };

    const gradientTexture = createGradientTexture();

    // Use MeshBasicMaterial so the gradient colors display clearly.
    const ballMaterial = new THREE.MeshBasicMaterial({
      map: gradientTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.5,
    });

    // Create a sphere geometry for round balls.
    const ballGeometry = new THREE.SphereGeometry(3, 64, 64);

    // Increase the ball count for more visual density (e.g., 300)
    const ballCount = 300;
    for (let i = 0; i < ballCount; i++) {
      const ball = new THREE.Mesh(ballGeometry, ballMaterial.clone());
      ball.position.set(
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloatSpread(100)
      );
      const scale = THREE.MathUtils.randFloat(0.8, 1.5);
      ball.scale.setScalar(scale);
      ball.rotation.set(
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360))
      );
      ballsGroup.add(ball);
    }

    // Animation loop: slowly rotate the group and render the scene.
    const animate = () => {
      requestAnimationFrame(animate);
      ballsGroup.rotation.y += 0.001;
      ballsGroup.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // Add mouse parallax effect: move the group slightly based on mouse position.
    const onMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const offsetX = (mouseX - width / 2) * 0.001;
      const offsetY = (mouseY - height / 2) * 0.001;
      ballsGroup.position.x = offsetX * 50;
      ballsGroup.position.y = -offsetY * 50;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Handle window resize events.
    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="rainbow-balls-container" />;
};

export default RainbowBalls;
