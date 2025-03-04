import React from 'react';
import './BackgroundVideo.scss';
import videoSrc from '../assets/images/bg.mp4';

const BackgroundVideo = () => {
  return (
    <div className="background-video-container">
      <video
        className="background-video"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default BackgroundVideo;
