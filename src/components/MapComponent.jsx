import React from 'react';

const MapComponent = () => {
  return (
    <div className="map-responsive">
      <iframe
        title="Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9997612525424!2d80.24791161425137!3d12.966319790897005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526748b1a5b9d1%3A0x186deae3f7e1e9d8!2sNew%20Convention%20Centre%2C%20CTC%20Complex%2C%20Nandambakkam%2C%20Chennai-600089!5e0!3m2!1sen!2sin!4v1614941522031!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default MapComponent;
