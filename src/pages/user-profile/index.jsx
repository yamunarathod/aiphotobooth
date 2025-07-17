import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import SubscriptionTab from './components/SubscriptionTab';
import SecurityTab from './components/SecurityTab';
import NotificationTab from './components/NotificationTab';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();

  // Mock user data - in real app, this would come from Firebase/API
  const [userData, setUserData] = useState({
    id: 'user_12345',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    company: 'Kumar Photography Studio',
    website: 'https://kumarphotography.com',
    bio: 'Professional photographer specializing in weddings and corporate events. Over 10 years of experience in the industry.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    status: 'active',
    subscriptionStatus: 'active',
    stats: {
      eventsCreated: 24,
      licensesGenerated: 18,
      totalTransformations: 1250,
      totalSpent: 3580
    },
    subscription: {
      planId: 'professional',
      status: 'active',
      nextBillingDate: '2024-02-15T00:00:00Z',
      transformationsUsed: 145,
      paymentMethod: {
        type: 'card',
        last4: '4242'
      }
    },
    billingHistory: [
      {
        id: 'txn_001',
        description: 'Professional Plan - Monthly',
        amount: 149,
        date: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: 'txn_002',
        description: 'Professional Plan - Monthly',
        amount: 149,
        date: '2023-12-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: 'txn_003',
        description: 'Starter Plan - Monthly',
        amount: 49,
        date: '2023-11-15T10:30:00Z',
        status: 'completed'
      }
    ],
    security: {
      twoFactorEnabled: false,
      emailNotifications: true,
      loginAlerts: true
    },
    notifications: {
      email: {
        subscriptionRenewals: true,
        eventReminders: true,
        systemUpdates: false,
        marketingEmails: false,
        securityAlerts: true,
        paymentNotifications: true
      },
      push: {
        eventReminders: true,
        licenseGenerated: true,
        subscriptionExpiry: true,
        systemMaintenance: false
      },
      sms: {
        eventReminders: false,
        securityAlerts: false,
        paymentFailures: true
      }
    }
  });

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'User',
      description: 'Manage your personal information'
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: 'CreditCard',
      description: 'View and manage your subscription'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password and security settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Configure notification preferences'
    }
  ];

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In real app, fetch from Firebase
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserData(prev => ({
        ...prev,
        ...updatedData,
        updatedAt: new Date().toISOString()
      }));
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleUpdateSecurity = async (securityData) => {
    try {
      // Simulate API call to update security settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (securityData.type === 'password') {
        console.log('Password updated successfully');
      } else if (securityData.type === 'setting') {
        setUserData(prev => ({
          ...prev,
          security: {
            ...prev.security,
            ...securityData.data
          }
        }));
      } else if (securityData.type === 'terminateSession') {
        console.log('Session terminated:', securityData.data.sessionId);
      }
    } catch (error) {
      console.error('Error updating security:', error);
      throw error;
    }
  };

  const handleUpdateNotifications = async (notificationSettings) => {
    try {
      // Simulate API call to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => ({
        ...prev,
        notifications: notificationSettings
      }));
      
      console.log('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    // In real app, clear auth state and redirect
    console.log('User signed out');
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoTab 
            user={userData} 
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'subscription':
        return (
          <SubscriptionTab 
            user={userData}
          />
        );
      case 'security':
        return (
          <SecurityTab 
            user={userData}
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      case 'notifications':
        return (
          <NotificationTab 
            user={userData}
            onUpdateNotifications={handleUpdateNotifications}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="glass rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-surface rounded-full" />
                  <div className="space-y-2">
                    <div className="h-6 bg-surface rounded w-48" />
                    <div className="h-4 bg-surface rounded w-64" />
                    <div className="h-4 bg-surface rounded w-32" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-surface rounded-lg" />
                  ))}
                </div>
                <div className="lg:col-span-3">
                  <div className="h-96 bg-surface rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Profile Header */}
          <ProfileHeader 
            user={userData}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass rounded-lg p-4 border border-white/20 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary/20 text-primary border border-primary/30' :'text-text-primary hover:bg-white/10 hover:text-primary'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <div className="flex-1">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-text-secondary hidden sm:block">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Sign Out Button */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={handleSignOut}
                    iconName="LogOut"
                    iconPosition="left"
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-1200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowSignOutModal(false)} />
          <div className="relative glass-interactive rounded-xl p-6 border border-white/20 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
                <Icon name="LogOut" size={24} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Sign Out</h3>
                <p className="text-sm text-text-secondary">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmSignOut}
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;