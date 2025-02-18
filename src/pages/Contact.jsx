// src/pages/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2>Contact Us</h2>
      <p>If you have any questions, please reach out to us.</p>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" placeholder="Your name" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Your email" required />
        </div>
        <div>
          <label>Message:</label>
          <textarea placeholder="Your message" required />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
