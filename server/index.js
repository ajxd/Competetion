const express = require('express');
const cors = require('cors');
const app = express();

// Use JSON body parser and enable CORS
app.use(express.json());
app.use(cors());

// Initialize Stripe with your secret key (make sure to use environment variables in production)
const stripe = require('stripe')('sk_test_51Nb96uINWXfLdDEdGjnMi5cNeNW9KPTZW9i8JAGDb9mUe0aeIClRhkL6eb9Dfmck2CCq97q2xNwmV2kOYWrPaMjy00cfwdyXEg');

// Create a PaymentIntent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    // amount in cents (e.g., 5000 for $50)
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Return the client secret to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

// For production, serve the React build files
const path = require('path');
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
