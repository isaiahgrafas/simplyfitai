// api/checkout.js — Stripe $5 one-time payment
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Simply Fit AI — Lifetime Access',
            description: 'Unlimited 24/7 access to your personal AI fitness coach. One-time payment, no subscription.',
            images: [],
          },
          unit_amount: 500, // $5.00 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success.html`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
