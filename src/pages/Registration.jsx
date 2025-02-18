import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './Registration.scss';
import RainbowBalls from '../components/RainbowBalls';
import PaymentForm from './PaymentForm';

// Initialize Stripe with your test publishable key
const stripePromise = loadStripe(
  'pk_test_51Nb96uINWXfLdDEdEiIrOoN0awlgKICINAFJiczSdoWBst3gqpZP06kpKmccg69WgDZoTZLhvMwyAaUHvl1QSjcA00kM0GhHF8'
);

const Registration = () => {
  const formRef = useRef(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Animate the registration container into view
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Fetch the PaymentIntent client secret from your server
    fetch('http://localhost:3001/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Example: sending an amount of 5000 cents ($50); adjust as needed.
      body: JSON.stringify({ amount: 5000 })
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error fetching client secret:', error);
      });

    // Add subtle focus animations for form elements
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
      <RainbowBalls />
      <div className="registration-container" ref={formRef}>
        <h2>Registration</h2>
        <p>Please fill in the form below to register for the contest and complete your payment.</p>
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

export default Registration;
