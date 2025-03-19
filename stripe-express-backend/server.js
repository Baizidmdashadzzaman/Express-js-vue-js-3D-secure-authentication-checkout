// server.js
const express = require('express');
const cors = require("cors");
const app = express();
const stripe = require('stripe')('sk_test_51QbliuP2kqOTkjJTpRyqqpDDSPmEdY6ZIE6XWxXVwZnLAXKpUSMNp7GhNKuVuRJWDr4hFoLwGHIQeKhDZKVzciAl004XiNJL3q'); // Replace with your test secret key

app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from your Vue app
      methods: "GET,POST",
      allowedHeaders: "Content-Type",
    })
);


// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; // e.g., { amount: 1000, currency: 'usd' }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents: 1000 cents = $10.00
      currency,
      payment_method_types: ['card'], // Includes support for 3D Secure if required
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
