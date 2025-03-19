<!-- src/components/PaymentForm.vue -->
<template>
    <div>
      <h2>Stripe Payment</h2>
      <form @submit.prevent="handleSubmit">
        <div id="card-element"></div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Processing..." : "Pay" }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { loadStripe } from "@stripe/stripe-js";
  
  export default {
    data() {
      return {
        stripe: null,
        elements: null,
        card: null,
        error: null,
        loading: false,
      };
    },
    async mounted() {
      this.stripe = await loadStripe("pk_test_"); // Replace with your Stripe public key
      this.elements = this.stripe.elements();
      this.card = this.elements.create("card");
      this.card.mount("#card-element");
    },
    methods: {
      async handleSubmit() {
        this.loading = true;
  
        const response = await fetch("http://localhost:3000/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1000, currency: "usd" }), // $10 payment
        });
  
        const { clientSecret, error: backendError } = await response.json();
  
        if (backendError) {
          this.error = backendError;
          this.loading = false;
          return;
        }
  
        const { error: stripeError, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: { name: "ASAD ZAMAN" },
          },
        });
  
        if (stripeError) {
          this.error = stripeError.message;
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          alert("Payment successful!");
        }
  
        this.loading = false;
      },
    },
  };
  </script>
  
  <style scoped>
  #card-element {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .error {
    color: red;
  }
  </style>
  