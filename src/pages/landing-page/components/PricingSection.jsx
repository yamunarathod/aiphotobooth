import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PricingSection = () => {
  const [eventSize, setEventSize] = useState(100);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small events and testing',
      monthlyPrice: 49,
      yearlyPrice: 39,
      transformsIncluded: 200,
      features: [
        '200 AI transformations/month',
        '12 art styles included',
        'Basic customization',
        'Email support',
        'Social media sharing',
        'HD quality exports',
      ],
      limitations: [
        'No custom branding',
        'Standard processing speed'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Most popular for wedding & event planners',
      monthlyPrice: 149,
      yearlyPrice: 119,
      transformsIncluded: 1000,
      features: [
        '1,000 AI transformations/month',
        '24+ art styles included',
        'Full brand customization',
        'Priority support',
        'Advanced sharing options',
        '4K quality exports',
        'Analytics dashboard',
        'Custom style creation',
        'Bulk processing'
      ],
      limitations: [],
      popular: true,
      color: 'violet'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Unlimited power for agencies & corporations',
      monthlyPrice: 399,
      yearlyPrice: 319,
      transformsIncluded: 'unlimited',
      features: [
        'Unlimited AI transformations',
        'All art styles + custom styles',
        'White-label solution',
        'Dedicated account manager',
        'API access',
        '8K quality exports',
        'Advanced analytics',
        'Multi-brand management',
        'Priority processing',
        'Custom integrations'
      ],
      limitations: [],
      popular: false,
      color: 'amber'
    }
  ];

  const calculatePrice = (plan) => {
    const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return basePrice;
  };

  const calculatePerPhoto = (plan) => {
    if (plan.transformsIncluded === 'unlimited') return 0;
    const price = calculatePrice(plan);
    return (price / plan.transformsIncluded).toFixed(3);
  };

  const getEventSizeMultiplier = () => {
    if (eventSize <= 50) return 1;
    if (eventSize <= 100) return 1.2;
    if (eventSize <= 200) return 1.5;
    if (eventSize <= 500) return 2;
    return 3;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose the perfect plan for your events. All plans include unlimited support, 
            regular updates, and a 30-day money-back guarantee.
          </p>
        </div>

        {/* Event Size Slider */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Customize for Your Event Size
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Expected Guests: <span className="text-violet-400 font-bold">{eventSize}</span>
              </label>
              <input
                type="range"
                min="25"
                max="1000"
                value={eventSize}
                onChange={(e) => setEventSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((eventSize - 25) / 975) * 100}%, #374151 ${((eventSize - 25) / 975) * 100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>25</span>
                <span>250</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-violet-400">
                  {Math.round(eventSize * 0.8)}
                </div>
                <div className="text-xs text-slate-400">Expected Photos</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-400">
                  ${Math.round(1500 * getEventSizeMultiplier()).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Traditional Cost</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-amber-400">
                  ${Math.round(300 * getEventSizeMultiplier()).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">AI Photobooth Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/50 rounded-lg p-1 border border-slate-600">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                billingCycle === 'monthly' ?'bg-violet-500 text-white' :'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all duration-300 relative ${
                billingCycle === 'yearly' ?'bg-violet-500 text-white' :'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                plan.popular
                  ? 'border-violet-500 scale-105 shadow-2xl shadow-violet-500/20'
                  : selectedPlan === plan.id
                  ? 'border-violet-500/50'
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-2 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    ${calculatePrice(plan)}
                  </span>
                  <span className="text-slate-400 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-400 mb-4">
                    Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                  </div>
                )}

                <div className="text-sm text-slate-400">
                  {plan.transformsIncluded === 'unlimited' ?'Unlimited transformations'
                    : `${plan.transformsIncluded.toLocaleString()} transformations included`
                  }
                </div>
                
                {plan.transformsIncluded !== 'unlimited' && (
                  <div className="text-xs text-slate-500">
                    ${calculatePerPhoto(plan)} per photo
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Icon name="Check" size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-slate-400 mb-2">Limitations:</h5>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <Icon name="X" size={14} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-400 text-xs">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "primary" : "outline"}
                size="lg"
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600' 
                    : 'border-violet-400 text-violet-400 hover:bg-violet-500/10'
                }`}
                iconName={plan.id === 'enterprise' ? 'Phone' : 'Sparkles'}
                iconPosition="left"
              >
                {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </Button>

              {plan.id !== 'enterprise' && (
                <p className="text-center text-xs text-slate-400 mt-3">
                  No credit card required • Cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                What happens if I exceed my transform limit?
              </h4>
              <p className="text-slate-400 text-sm">
                You can purchase additional transforms at $0.10 each, or upgrade to a higher plan anytime.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-slate-400 text-sm">
                Yes! Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Do you offer custom enterprise solutions?
              </h4>
              <p className="text-slate-400 text-sm">
                Absolutely! Contact our sales team for custom pricing, white-label solutions, and API access.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                What's your refund policy?
              </h4>
              <p className="text-slate-400 text-sm">
                30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center">
              <Icon name="Shield" size={20} className="text-green-400 mr-2" />
              <span className="text-slate-400 text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Icon name="CreditCard" size={20} className="text-blue-400 mr-2" />
              <span className="text-slate-400 text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center">
              <Icon name="Award" size={20} className="text-amber-400 mr-2" />
              <span className="text-slate-400 text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center">
              <Icon name="Users" size={20} className="text-violet-400 mr-2" />
              <span className="text-slate-400 text-sm">10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;