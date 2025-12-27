import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(stripePublishableKey);

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '', // Free plan doesn't need a price ID
    interval: 'month',
    features: [
      '3 projects',
      '100 AI generations/month',
      'Basic deployment',
      'Community support'
    ],
    limits: {
      projects: 3,
      aiGenerations: 100,
      storage: 1024, // MB
      teamMembers: 1
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || '',
    interval: 'month',
    features: [
      'Unlimited projects',
      '1000 AI generations/month',
      'Advanced AI models',
      'Custom domains',
      'Priority support',
      'Team collaboration (5 people)'
    ],
    limits: {
      projects: -1, // unlimited
      aiGenerations: 1000,
      storage: 10240, // MB
      teamMembers: 5
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || '',
    interval: 'month',
    features: [
      'Everything in Pro',
      '5000 AI generations/month',
      'Dedicated AI models',
      'Unlimited team members',
      'SLA guarantee',
      'Dedicated account manager',
      'White-label customization'
    ],
    limits: {
      projects: -1,
      aiGenerations: 5000,
      storage: 51200, // MB
      teamMembers: -1
    }
  }
};

export async function createCheckoutSession(priceId: string, userId: string): Promise<string> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId })
  });
  
  const { sessionId } = await response.json();
  return sessionId;
}

export async function createCustomerPortalSession(customerId: string): Promise<string> {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId })
  });
  
  const { url } = await response.json();
  return url;
}
