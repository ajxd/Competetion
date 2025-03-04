import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './RegistrationForm.scss';
import RainbowBalls from '../components/RainbowBalls';
import PaymentForm from './PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe(
  'pk_test_51Nb96uINWXfLdDEdEiIrOoN0awlgKICINAFJiczSdoWBst3gqpZP06kpKmccg69WgDZoTZLhvMwyAaUHvl1QSjcA00kM0GhHF8'
);

const RegistrationForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    category: '',
    agreeTerms: false
  });

  const categories = [
    "Dance Challenge",
    "Singing Contest",
    "Drawing Competition",
    "Costume Parade",
    "Storytelling",
    "Spelling Bee",
    "Coloring Competition",
    "Handwriting",
    "Fastest Walking (9-15 months)",
    "Crawling (5-9 months)",
    "Art & Craft",
    "Yoga Competition"
  ];

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    fetch('http://localhost:3001/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: 5000 }) // Adjust amount as needed
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error fetching client secret:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    alert("Registration Successful! Redirecting...");
    navigate('/registration-success');
  };

  return (
    <div className="registration-page">
      <RainbowBalls />
      <div className="registration-container" ref={formRef}>
        <h2>Register Now</h2>
        <p>Join the competition and showcase your talent!</p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input type="number" name="age" required value={formData.age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Competition Category:</label>
            <select name="category" required value={formData.category} onChange={handleChange}>
              <option value="" disabled>Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group terms">
            <label>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
              I agree to the <a href="/terms">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="submit-btn">Proceed to Payment</button>
        </form>

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm />
          </Elements>
        ) : (
          <p>Loading payment details...</p>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
