import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanComparisonTable from './components/PlanComparisonTable';
import PaymentHistoryTable from './components/PaymentHistoryTable';
import BillingInformationCard from './components/BillingInformationCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPlan, setCurrentPlan] = useState({
    type: 'Starter',
    price: 49,
    status: 'active',
    renewalDate: '2024-02-15',
    autoRenewal: true,
    stylesUsed: 2,
    stylesLimit: 1
  });

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN_2024_001',
      date: '2024-01-15T10:30:00Z',
      description: 'Starter Plan Subscription',
      planType: 'Starter',
      amount: 49,
      method: 'card',
      status: 'success'
    },
    {
      id: 'TXN_2024_002',
      date: '2024-01-10T14:20:00Z',
      description: 'Professional Plan Upgrade',
      planType: 'Professional',
      amount: 149,
      method: 'upi',
      status: 'success'
    },
    {
      id: 'TXN_2024_003',
      date: '2024-01-05T09:15:00Z',
      description: 'Starter Plan Subscription',
      planType: 'Starter',
      amount: 49,
      method: 'netbanking',
      status: 'failed'
    },
    {
      id: 'TXN_2024_004',
      date: '2023-12-15T16:45:00Z',
      description: 'Professional Plan Subscription',
      planType: 'Professional',
      amount: 149,
      method: 'card',
      status: 'success'
    },
    {
      id: 'TXN_2024_005',
      date: '2023-12-10T11:30:00Z',
      description: 'Starter Plan Refund',
      planType: 'Starter',
      amount: 49,
      method: 'card',
      status: 'refunded'
    }
  ]);

  const [billingInfo, setBillingInfo] = useState({
    companyName: 'Magic Events Pvt Ltd',
    email: 'billing@magicevents.com',
    phone: '+91 98765 43210',
    address: '123 Business Park, Tech City',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gstin: '27AAAAA0000A1Z5',
    paymentMethods: [
      {
        id: 'pm_1',
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiry: '12/25',
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'upi',
        upiId: 'user@paytm',
        isDefault: false
      }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'plans', label: 'Plans', icon: 'Package' },
    { id: 'history', label: 'Payment History', icon: 'Receipt' },
    { id: 'billing', label: 'Billing Info', icon: 'CreditCard' }
  ];

  useEffect(() => {
    // Simulate loading subscription data from Firebase
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePlanUpgrade = async () => {
    setIsLoading(true);
    try {
      // Simulate Razorpay payment integration
      console.log('Initiating Razorpay payment for Professional plan upgrade');
      
      // Mock payment success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentPlan(prev => ({
        ...prev,
        type: 'Professional',
        price: 149,
        stylesLimit: 3
      }));
      
      // Add new transaction
      const newTransaction = {
        id: `TXN_${Date.now()}`,
        date: new Date().toISOString(),
        description: 'Professional Plan Upgrade',
        planType: 'Professional',
        amount: 149,
        method: 'card',
        status: 'success'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      console.log('Plan upgraded successfully');
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanDowngrade = async () => {
    setIsLoading(true);
    try {
      console.log('Processing plan downgrade to Starter');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlan(prev => ({
        ...prev,
        type: 'Starter',
        price: 49,
        stylesLimit: 1
      }));
      
      console.log('Plan downgraded successfully');
    } catch (error) {
      console.error('Error downgrading plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (planId) => {
    if (planId === 'professional') {
      await handlePlanUpgrade();
    } else {
      await handlePlanDowngrade();
    }
  };

  const handleUpdateBilling = async (billingData) => {
    setIsLoading(true);
    try {
      console.log('Updating billing information:', billingData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBillingInfo(prev => ({
        ...prev,
        ...billingData
      }));
      
      console.log('Billing information updated successfully');
    } catch (error) {
      console.error('Error updating billing information:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <CurrentPlanCard
              currentPlan={currentPlan}
              onUpgrade={handlePlanUpgrade}
              onDowngrade={handlePlanDowngrade}
              isLoading={isLoading}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-accent flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Usage Stats</h3>
                    <p className="text-text-secondary text-sm">This month</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Events Created</span>
                    <span className="text-text-primary font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Styles Used</span>
                    <span className="text-text-primary font-medium">{currentPlan.stylesUsed}/{currentPlan.stylesLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">License Generated</span>
                    <span className="text-text-primary font-medium">8</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="Calendar" size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Next Billing</h3>
                    <p className="text-text-secondary text-sm">Upcoming payment</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-text-primary">
                    {new Date(currentPlan.renewalDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-sm text-text-secondary">
                    ₹{currentPlan.price} will be charged
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error flex items-center justify-center">
                    <Icon name="Shield" size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Account Status</h3>
                    <p className="text-text-secondary text-sm">Security & compliance</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm text-text-primary">Payment verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm text-text-primary">Account active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'plans':
        return (
          <PlanComparisonTable
            currentPlan={currentPlan}
            onSelectPlan={handleSelectPlan}
            isLoading={isLoading}
          />
        );

      case 'history':
        return (
          <PaymentHistoryTable
            transactions={transactions}
            isLoading={isLoading}
          />
        );

      case 'billing':
        return (
          <BillingInformationCard
            billingInfo={billingInfo}
            onUpdateBilling={handleUpdateBilling}
            isLoading={isLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Subscription Management</h1>
              <p className="text-text-secondary">
                Manage your subscription, billing, and payment preferences
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-white/20">
              <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-white/20'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;