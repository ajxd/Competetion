import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState('earlyBird');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://yourdomain.com/payment-success', // Replace with your success URL
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Select Payment Plan</h3>
      <div className="payment-options">
        <div className="option">
          <input
            type="radio"
            id="earlyBird"
            name="plan"
            value="earlyBird"
            checked={selectedPlan === 'earlyBird'}
            onChange={handlePlanChange}
          />
          <label htmlFor="earlyBird">Early Bird Registration – $50 (High Discount)</label>
        </div>
        <div className="option">
          <input
            type="radio"
            id="regular"
            name="plan"
            value="regular"
            checked={selectedPlan === 'regular'}
            onChange={handlePlanChange}
          />
          <label htmlFor="regular">Regular Registration – $75</label>
        </div>
        <div className="option">
          <input
            type="radio"
            id="late"
            name="plan"
            value="late"
            checked={selectedPlan === 'late'}
            onChange={handlePlanChange}
          />
          <label htmlFor="late">Late Registration – $100 (Less Discount)</label>
        </div>
      </div>
      <div className="card-element-container">
        <PaymentElement options={{ hidePostalCode: true }} />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit" className="submit-btn" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Submit Payment'}
      </button>
    </form>
  );
};

export default PaymentForm;
