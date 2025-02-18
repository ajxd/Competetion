// src/components/InteractivePebbles.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const InteractivePebbles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,   // Allow transparency
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append renderer's canvas to the container
    containerRef.current.appendChild(renderer.domElement);

    // Create a group to hold our pebbles
    const pebblesGroup = new THREE.Group();
    scene.add(pebblesGroup);

    // Create a custom gradient texture for the pebbles
    const createPebbleTexture = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      // Create a radial gradient from the center outward
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      // Feel free to change the colors for a different look
      gradient.addColorStop(0, 'rgba(255, 100, 50, 1)'); // bright center
      gradient.addColorStop(0.5, 'rgba(50, 200, 250, 0.8)'); // mid-tone
      gradient.addColorStop(1, 'rgba(50, 50, 200, 0)'); // transparent edge
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    const pebbleTexture = createPebbleTexture();

    // Create a material using the gradient texture
    const pebbleMaterial = new THREE.MeshBasicMaterial({
      map: pebbleTexture,
      transparent: true,
      depthWrite: false,
    });

    // Create a sphere geometry for each pebble
    const pebbleGeometry = new THREE.SphereGeometry(1, 16, 16);

    // Create many pebbles with random positions, rotations, and scales
    const pebbleCount = 300;
    for (let i = 0; i < pebbleCount; i++) {
      const pebble = new THREE.Mesh(pebbleGeometry, pebbleMaterial.clone());
      pebble.position.set(
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(50)
      );
      const scale = THREE.MathUtils.randFloat(0.5, 3);
      pebble.scale.setScalar(scale);
      // Optionally, give each pebble a random rotation
      pebble.rotation.set(
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(0, 360))
      );
      pebblesGroup.add(pebble);
    }

    // Animation loop: update the scene and render
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Create a subtle group rotation for a fluid dynamic effect
      pebblesGroup.rotation.y += 0.001;
      pebblesGroup.rotation.x += 0.0005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Add mousemove event to create a parallax effect on the pebblesGroup
    const onMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      // Calculate offset from center
      const offsetX = (mouseX - width / 2) * 0.002;
      const offsetY = (mouseY - height / 2) * 0.002;
      // Smoothly move the group based on mouse offset
      pebblesGroup.position.x = offsetX * 50;
      pebblesGroup.position.y = -offsetY * 50;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Update the renderer on window resize
    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default InteractivePebbles;
