// src/pages/Events.jsx
import React from 'react';

const Events = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2>Events & Schedule</h2>
      <ul>
        <li><strong>Registration Deadline:</strong> [Date]</li>
        <li><strong>Event Date:</strong> [Date]</li>
        <li><strong>Results Announcement:</strong> [Date]</li>
      </ul>
    </div>
  );
};

export default Events;
