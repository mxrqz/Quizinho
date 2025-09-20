import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_example';
const stripe = new Stripe(stripeKey);

export const stripeService = {
  // Create a checkout session for premium plan
  async createCheckoutSession(id: string): Promise<Stripe.Checkout.Session | null> {
    try {
      // Check if we have a valid Stripe key
      if (stripeKey === 'sk_test_example') {
        console.warn('Stripe not configured, returning mock checkout session');
        return {
          url: `${process.env.NEXT_PUBLIC_URL}/?mock_payment=true&id=${id}`
        } as Stripe.Checkout.Session;
      }

      const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60); // 30 minutes

      const checkout = await stripe.checkout.sessions.create({
        client_reference_id: id,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Quizinho Premium'
            },
            unit_amount: 500, // R$ 5.00 in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/?loading=false&qrCodeURL=${process.env.NEXT_PUBLIC_URL}/${id}&modal=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/?loading=false&modal=true&id=${id}`,
        expires_at: expiresAt
      });

      return checkout;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      return null;
    }
  },

  // Verify webhook signature
  verifyWebhookSignature(body: string, signature: string): Stripe.Event | null {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      return event;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return null;
    }
  }
};

export default stripe;