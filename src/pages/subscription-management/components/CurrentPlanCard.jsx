import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanCard = ({ currentPlan, onUpgrade, onDowngrade, isLoading }) => {
  const getPlanIcon = (planType) => {
    switch (planType.toLowerCase()) {
      case 'professional':
        return 'Crown';
      case 'starter':
        return 'Star';
      default:
        return 'Package';
    }
  };

  const getPlanColor = (planType) => {
    switch (planType.toLowerCase()) {
      case 'professional':
        return 'from-primary to-secondary';
      case 'starter':
        return 'from-accent to-primary';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="glass rounded-xl p-6 border border-white/20 shadow-glass">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getPlanColor(currentPlan.type)} flex items-center justify-center`}>
            <Icon name={getPlanIcon(currentPlan.type)} size={24} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Current Plan</h2>
            <p className="text-text-secondary text-sm">Manage your subscription</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
          currentPlan.status === 'active' ?'bg-success/20 text-success border-success/30' :'bg-warning/20 text-warning border-warning/30'
        }`}>
          {currentPlan.status === 'active' ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center md:text-left">
          <div className="text-2xl font-bold text-text-primary mb-1">
            {currentPlan.type}
          </div>
          <div className="text-lg font-semibold text-primary mb-2">
            {formatCurrency(currentPlan.price)}/month
          </div>
          <div className="text-sm text-text-secondary">
            Billed monthly
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary mb-1">
            {currentPlan.stylesUsed}/{currentPlan.stylesLimit}
          </div>
          <div className="text-sm text-text-secondary mb-2">
            Styles Used
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPlan.stylesUsed / currentPlan.stylesLimit) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="text-lg font-semibold text-text-primary mb-1">
            Next Billing
          </div>
          <div className="text-sm text-text-secondary mb-2">
            {formatDate(currentPlan.renewalDate)}
          </div>
          <div className="text-xs text-text-secondary">
            Auto-renewal {currentPlan.autoRenewal ? 'enabled' : 'disabled'}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {currentPlan.type.toLowerCase() === 'starter' && (
          <Button
            variant="primary"
            onClick={onUpgrade}
            loading={isLoading}
            iconName="ArrowUp"
            iconPosition="left"
            className="gradient-border flex-1"
          >
            Upgrade to Professional
          </Button>
        )}
        
        {currentPlan.type.toLowerCase() === 'professional' && (
          <Button
            variant="outline"
            onClick={onDowngrade}
            loading={isLoading}
            iconName="ArrowDown"
            iconPosition="left"
            className="flex-1"
          >
            Downgrade to Starter
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => console.log('Manage billing clicked')}
          iconName="Settings"
          iconPosition="left"
        >
          Manage Billing
        </Button>
      </div>

      {currentPlan.stylesUsed >= currentPlan.stylesLimit && (
        <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Style Limit Reached</span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            You've used all available styles for this month. Upgrade to Professional for more styles.
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentPlanCard;