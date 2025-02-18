import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Registration.scss';
import RainbowBalls from '../components/RainbowBalls';

const Registration = () => {
  const formRef = useRef(null);

  useEffect(() => {
    // Animate the registration form container into view
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Optional: Animate focus effects for form elements
    const inputs = formRef.current.querySelectorAll('input, select, button');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        gsap.to(input, { scale: 1.02, duration: 0.2, ease: 'power1.out' });
      });
      input.addEventListener('blur', () => {
        gsap.to(input, { scale: 1, duration: 0.2, ease: 'power1.out' });
      });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('focus', () => {});
        input.removeEventListener('blur', () => {});
      });
    };
  }, []);

  return (
    <div className="registration-page">
      {/* RainbowBalls background for registration page */}
      <RainbowBalls />
      <div className="registration-container">
        <h2>Registration</h2>
        <p>Please fill in the form below to register for the contest.</p>
        <form ref={formRef} className="registration-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="Your email" required />
          </div>
          <div className="form-group">
            <label>Age Group:</label>
            <select required>
              <option value="">Select Age Group</option>
              <option value="kindergarten">Kindergarten</option>
              <option value="grade1-2">Grade 1-2</option>
              <option value="grade3-5">Grade 3-5</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contest Category:</label>
            <select required>
              <option value="">Select Category</option>
              <option value="dance">Dance</option>
              <option value="singing">Singing/Vocal</option>
              <option value="art">Coloring/Art</option>
              <option value="costume">Costume</option>
              <option value="storytelling">Storytelling</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
