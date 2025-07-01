import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionTab = ({ user }) => {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      features: ['1 AI Style', '50 Transformations/month', 'Basic Support', 'Standard Quality'],
      color: 'accent'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 149,
      features: ['3 AI Styles', '200 Transformations/month', 'Priority Support', 'HD Quality', 'Custom Branding'],
      color: 'primary',
      popular: true
    }
  ];

  const currentPlan = subscriptionPlans.find(plan => plan.id === user.subscription.planId);
  const nextBillingDate = new Date(user.subscription.nextBillingDate);
  const daysUntilBilling = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));

  const getUsagePercentage = () => {
    const maxTransformations = currentPlan?.id === 'professional' ? 200 : 50;
    return (user.subscription.transformationsUsed / maxTransformations) * 100;
  };

  const handleManageSubscription = () => {
    navigate('/subscription-management');
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Icon name="Crown" size={20} />
              Current Subscription
            </h3>
            <p className="text-text-secondary">Manage your subscription and billing</p>
          </div>
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            iconName="Settings"
            iconPosition="left"
          >
            Manage Subscription
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              currentPlan?.color === 'primary' ?'border-primary bg-primary/10' :'border-accent bg-accent/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-xl font-bold ${
                  currentPlan?.color === 'primary' ? 'text-primary' : 'text-accent'
                }`}>
                  {currentPlan?.name} Plan
                </h4>
                {currentPlan?.popular && (
                  <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-text-primary">
                ₹{currentPlan?.price}
                <span className="text-sm font-normal text-text-secondary">/month</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-text-primary">Plan Features:</h5>
              <ul className="space-y-1">
                {currentPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon name="Check" size={16} className="text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Usage & Billing */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Transformations Used</span>
                <span className="text-sm text-text-secondary">
                  {user.subscription.transformationsUsed} / {currentPlan?.id === 'professional' ? '200' : '50'}
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getUsagePercentage() > 80 ? 'bg-warning' : 
                    getUsagePercentage() > 60 ? 'bg-accent' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-surface rounded-lg">
                <div className="text-lg font-bold text-text-primary">{daysUntilBilling}</div>
                <div className="text-xs text-text-secondary">Days until billing</div>
              </div>
              <div className="text-center p-3 bg-surface rounded-lg">
                <div className="text-lg font-bold text-success">
                  {user.subscription.status === 'active' ? 'Active' : 'Inactive'}
                </div>
                <div className="text-xs text-text-secondary">Status</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Next billing date:</span>
                <span className="text-text-primary">
                  {nextBillingDate.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Payment method:</span>
                <span className="text-text-primary flex items-center gap-1">
                  <Icon name="CreditCard" size={14} />
                  •••• {user.subscription.paymentMethod.last4}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Available Plans
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                plan.id === user.subscription.planId
                  ? `border-${plan.color} bg-${plan.color}/10`
                  : 'border-white/20 glass hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-bold ${
                  plan.id === user.subscription.planId 
                    ? `text-${plan.color}` 
                    : 'text-text-primary'
                }`}>
                  {plan.name}
                </h4>
                {plan.popular && (
                  <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="text-2xl font-bold text-text-primary mb-4">
                ₹{plan.price}
                <span className="text-sm font-normal text-text-secondary">/month</span>
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon name="Check" size={14} className="text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.id === user.subscription.planId ? (
                <Button variant="outline" fullWidth disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  variant={plan.color === 'primary' ? 'primary' : 'secondary'} 
                  fullWidth
                  onClick={handleManageSubscription}
                >
                  {plan.price > currentPlan?.price ? 'Upgrade' : 'Downgrade'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Receipt" size={20} />
            Recent Billing History
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManageSubscription}
            iconName="ExternalLink"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {user.billingHistory.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.status === 'completed' 
                    ? 'bg-success/20 text-success' :'bg-warning/20 text-warning'
                }`}>
                  <Icon 
                    name={transaction.status === 'completed' ? 'CheckCircle' : 'Clock'} 
                    size={16} 
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  ₹{transaction.amount.toLocaleString('en-IN')}
                </div>
                <div className={`text-xs capitalize ${
                  transaction.status === 'completed' ? 'text-success' : 'text-warning'
                }`}>
                  {transaction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;