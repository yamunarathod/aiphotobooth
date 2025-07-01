import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparisonTable = ({ currentPlan, onSelectPlan, isLoading }) => {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      originalPrice: null,
      description: 'Perfect for small events and personal use',
      features: [
        { name: 'AI Style Transformations', value: '1 Style', included: true },
        { name: 'Event Creation', value: 'Unlimited', included: true },
        { name: 'License Generation', value: 'Included', included: true },
        { name: 'Basic Support', value: 'Email', included: true },
        { name: 'Advanced Styles', value: 'Limited', included: false },
        { name: 'Priority Support', value: '24/7 Chat', included: false },
        { name: 'Custom Branding', value: 'Available', included: false },
        { name: 'Analytics Dashboard', value: 'Advanced', included: false }
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonVariant: 'outline'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 149,
      originalPrice: 199,
      description: 'Ideal for professional event organizers',
      features: [
        { name: 'AI Style Transformations', value: '3 Styles', included: true },
        { name: 'Event Creation', value: 'Unlimited', included: true },
        { name: 'License Generation', value: 'Included', included: true },
        { name: 'Basic Support', value: 'Email', included: true },
        { name: 'Advanced Styles', value: 'All Styles', included: true },
        { name: 'Priority Support', value: '24/7 Chat', included: true },
        { name: 'Custom Branding', value: 'Available', included: true },
        { name: 'Analytics Dashboard', value: 'Advanced', included: true }
      ],
      popular: true,
      buttonText: 'Upgrade Now',
      buttonVariant: 'primary'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isCurrentPlan = (planId) => {
    return currentPlan.type.toLowerCase() === planId;
  };

  const getButtonProps = (plan) => {
    if (isCurrentPlan(plan.id)) {
      return {
        text: 'Current Plan',
        variant: 'outline',
        disabled: true,
        onClick: null
      };
    }
    
    return {
      text: plan.id === 'professional' ? 'Upgrade Now' : 'Downgrade',
      variant: plan.id === 'professional' ? 'primary' : 'outline',
      disabled: false,
      onClick: () => onSelectPlan(plan.id)
    };
  };

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="glass rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Choose Your Plan</h3>
            <p className="text-text-secondary">Select the perfect plan for your photobooth needs</p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/20">
            {/* Features Column */}
            <div className="p-6 space-y-4">
              <div className="h-24 flex items-end">
                <h4 className="text-lg font-medium text-text-primary">Features</h4>
              </div>
              {plans[0].features.map((feature, index) => (
                <div key={index} className="py-3 border-b border-white/10 last:border-b-0">
                  <span className="text-sm text-text-secondary">{feature.name}</span>
                </div>
              ))}
              <div className="pt-4">
                <div className="h-12"></div>
              </div>
            </div>

            {/* Plan Columns */}
            {plans.map((plan) => (
              <div key={plan.id} className={`p-6 relative ${plan.popular ? 'bg-primary/5' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-xs font-medium text-white">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-text-primary mb-2">{plan.name}</h4>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-text-primary">{formatCurrency(plan.price)}</span>
                      <span className="text-text-secondary">/month</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-text-secondary line-through">
                        {formatCurrency(plan.originalPrice)}
                      </div>
                    )}
                    <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
                  </div>

                  {plan.features.map((feature, index) => (
                    <div key={index} className="py-3 border-b border-white/10 last:border-b-0 text-center">
                      {feature.included ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Icon name="Check" size={16} className="text-success" />
                          <span className="text-sm text-text-primary">{feature.value}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Icon name="X" size={16} className="text-text-secondary" />
                          <span className="text-sm text-text-secondary">Not included</span>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4">
                    <Button
                      variant={getButtonProps(plan).variant}
                      onClick={getButtonProps(plan).onClick}
                      disabled={getButtonProps(plan).disabled}
                      loading={isLoading && !getButtonProps(plan).disabled}
                      fullWidth
                      className={plan.id === 'professional' ? 'gradient-border' : ''}
                    >
                      {getButtonProps(plan).text}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-text-primary mb-2">Choose Your Plan</h3>
          <p className="text-text-secondary">Select the perfect plan for your photobooth needs</p>
        </div>

        {plans.map((plan) => (
          <div key={plan.id} className={`glass rounded-xl p-6 border border-white/20 relative ${
            plan.popular ? 'border-primary/50 bg-primary/5' : ''
          }`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-xs font-medium text-white">
                  Most Popular
                </div>
              </div>
            )}

            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-3 right-4">
                <div className="bg-success px-3 py-1 rounded-full text-xs font-medium text-white">
                  Current
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h4 className="text-xl font-semibold text-text-primary mb-2">{plan.name}</h4>
              <div className="mb-2">
                <span className="text-3xl font-bold text-text-primary">{formatCurrency(plan.price)}</span>
                <span className="text-text-secondary">/month</span>
              </div>
              {plan.originalPrice && (
                <div className="text-sm text-text-secondary line-through">
                  {formatCurrency(plan.originalPrice)}
                </div>
              )}
              <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{feature.name}</span>
                  {feature.included ? (
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-text-primary">{feature.value}</span>
                    </div>
                  ) : (
                    <Icon name="X" size={16} className="text-text-secondary" />
                  )}
                </div>
              ))}
            </div>

            <Button
              variant={getButtonProps(plan).variant}
              onClick={getButtonProps(plan).onClick}
              disabled={getButtonProps(plan).disabled}
              loading={isLoading && !getButtonProps(plan).disabled}
              fullWidth
              className={plan.id === 'professional' ? 'gradient-border' : ''}
            >
              {getButtonProps(plan).text}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanComparisonTable;