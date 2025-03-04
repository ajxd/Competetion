import React, { useEffect, useRef } from 'react';
import './RainbowBalls.scss';

const RainbowBalls = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'rainbow-canvas';
    // Set canvas size or additional properties if needed...
    container.appendChild(canvas);

    // (Your canvas animation logic goes here)

    // Cleanup: Remove the canvas safely
    return () => {
      if (container && canvas && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className="rainbow-balls-container"></div>;
};

export default RainbowBalls;
