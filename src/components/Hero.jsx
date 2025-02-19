import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Hero.scss';

// Import your 12 video files from the images folder
import video0 from '../assets/images/0.mp4';
import video1 from '../assets/images/1.mp4';
import video2 from '../assets/images/2.mp4';
import video3 from '../assets/images/3.mp4';
import video4 from '../assets/images/4.mp4';
import video5 from '../assets/images/5.mp4';
import video6 from '../assets/images/6.mp4';
import video7 from '../assets/images/7.mp4';
import video8 from '../assets/images/8.mp4';
import video9 from '../assets/images/9.mp4';
import video10 from '../assets/images/10.mp4';
import video11 from '../assets/images/11.mp4';

const videos = [
  video0, video1, video2, video3, video4, video5,
  video6, video7, video8, video9, video10, video11
];

const Hero = () => {
  const videoRefs = useRef([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const transitionDuration = 0.3; // seconds for crossfade transition
  const waitTime = 3; // seconds each video plays before ending

  // Handler for when a video ends
  const handleVideoEnded = () => {
    const currIdx = currentVideo;
    const nextIdx = (currIdx + 1) % videos.length;
    
    // Fade out current video
    if (videoRefs.current[currIdx]) {
      gsap.to(videoRefs.current[currIdx], {
        opacity: 0,
        duration: transitionDuration,
        ease: 'linear'
      });
    }
    // Fade in next video and play it once the fade is complete
    if (videoRefs.current[nextIdx]) {
      gsap.to(videoRefs.current[nextIdx], {
        opacity: 1,
        duration: transitionDuration,
        ease: 'linear',
        onComplete: () => {
          if (videoRefs.current[nextIdx]) {
            videoRefs.current[nextIdx].play().catch((err) => {
              console.error("Error playing video:", err);
            });
          }
        }
      });
    }
    setCurrentVideo(nextIdx);
  };

  useEffect(() => {
    // Play the first video when component mounts
    if (videoRefs.current[currentVideo]) {
      videoRefs.current[currentVideo].play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }

    // Add a parallax effect to the hero content (if any additional content is added later)
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = ((clientX - centerX) / centerX) * 15;
      const moveY = ((clientY - centerY) / centerY) * 15;
      gsap.to('.hero-content', {
        x: moveX,
        y: moveY,
        ease: 'power2.out',
        duration: 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentVideo]);

  return (
    <section className="hero">
      <div className="hero-videos">
        {videos.map((vid, index) => (
          <video
            key={index}
            className="hero-video"
            src={vid}
            autoPlay={index === currentVideo}
            muted
            playsInline
            loop={false}  // We rely on onEnded to trigger the next video
            preload="auto"
            style={{ opacity: index === currentVideo ? 1 : 0 }}
            ref={(el) => (videoRefs.current[index] = el)}
            onEnded={handleVideoEnded}
          />
        ))}
      </div>
      {/* If you want to keep hero content uncomment the below block */}
      {/*
      <div className="hero-content">
        <h1>CELEBRATING YOUNG TALENTS OF INDIA</h1>
        <p>Showcase Your Creativity and Skills</p>
        <a href="/registration" className="btn">Register Now</a>
      </div>
      */}
    </section>
  );
};

export default Hero;
