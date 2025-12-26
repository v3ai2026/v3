import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { PRICING_PLANS, stripePromise, createCheckoutSession } from '../lib/stripe';
import { GlassCard, NeuralButton, NeuralBadge, NeuralSpinner } from '../components/UIElements';
import { format } from 'date-fns';

export const Billing: React.FC = () => {
  const { profile } = useAuth();
  const { subscription, isLoading } = useSubscription();
  const [processingPlan, setProcessingPlan] = React.useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planName: string) => {
    if (!profile) return;

    setProcessingPlan(planName);
    
    try {
      const sessionId = await createCheckoutSession(priceId, profile.id);
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NeuralSpinner />
      </div>
    );
  }

  const currentPlan = profile?.subscription_tier || 'free';

  return (
    <div className="p-4 md:p-12 space-y-8 max-w-7xl mx-auto animate-modal-fade">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
          Billing & Subscription
        </h1>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Subscription */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">Current Plan</h3>
          <NeuralBadge variant="primary" className="text-lg px-6 py-2">
            {currentPlan.toUpperCase()}
          </NeuralBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Status
            </p>
            <p className="text-lg font-bold text-white">
              {subscription?.status || 'Active'}
            </p>
          </div>

          {subscription?.current_period_end && (
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Renewal Date
              </p>
              <p className="text-lg font-bold text-white">
                {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              AI Credits
            </p>
            <p className="text-lg font-bold text-[#00DC82]">
              {profile?.ai_credits || 0} remaining
            </p>
          </div>
        </div>

        {currentPlan === 'free' && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-sm text-slate-400">
              Upgrade to Pro or Enterprise to unlock more features and AI generations
            </p>
          </div>
        )}
      </GlassCard>

      {/* Pricing Plans */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            Choose Your Plan
          </h2>
          <p className="text-slate-400 text-sm">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => {
            const isCurrentPlan = currentPlan === key;
            const isPlanHigher = 
              (currentPlan === 'free' && (key === 'pro' || key === 'enterprise')) ||
              (currentPlan === 'pro' && key === 'enterprise');

            return (
              <GlassCard
                key={key}
                className={`p-8 space-y-6 relative ${
                  isCurrentPlan ? 'border-[#00DC82] bg-[#00DC82]/5' : ''
                } ${key === 'pro' ? 'md:scale-105 md:shadow-2xl' : ''}`}
              >
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <NeuralBadge variant="primary" pulse>
                      Most Popular
                    </NeuralBadge>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#00DC82]">
                      ${plan.price}
                    </span>
                    <span className="text-slate-500 text-sm font-bold">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#00DC82] mt-1">✓</span>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <NeuralButton
                  className="w-full"
                  variant={isCurrentPlan ? 'secondary' : 'primary'}
                  size="lg"
                  disabled={isCurrentPlan || !isPlanHigher}
                  loading={processingPlan === key}
                  onClick={() => {
                    if (plan.priceId && isPlanHigher) {
                      handleUpgrade(plan.priceId, key);
                    }
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : 
                   isPlanHigher ? 'Upgrade' : 
                   key === 'free' ? 'Free Forever' : 'Contact Sales'}
                </NeuralButton>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Usage Limits */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-xl font-black text-white">Usage Limits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Projects</span>
              <span className="text-sm font-black text-white">
                {/* This would be dynamic based on actual usage */}
                {PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.projects === -1
                  ? 'Unlimited'
                  : `0 / ${PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.projects}`}
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00DC82]" 
                style={{ width: '0%' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">AI Generations</span>
              <span className="text-sm font-black text-white">
                {/* This would be dynamic */}
                0 / {PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.aiGenerations}
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00DC82]" 
                style={{ width: '0%' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Storage</span>
              <span className="text-sm font-black text-white">
                0 MB / {PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.storage} MB
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00DC82]" 
                style={{ width: '0%' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Team Members</span>
              <span className="text-sm font-black text-white">
                {PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.teamMembers === -1
                  ? 'Unlimited'
                  : `1 / ${PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS].limits.teamMembers}`}
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00DC82]" 
                style={{ width: '20%' }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Payment History */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xl font-black text-white">Payment History</h3>
          <NeuralBadge variant="secondary">0 payments</NeuralBadge>
        </div>

        <div className="text-center py-12 text-slate-600">
          <p className="text-sm">No payment history yet</p>
        </div>
      </GlassCard>
    </div>
  );
};
