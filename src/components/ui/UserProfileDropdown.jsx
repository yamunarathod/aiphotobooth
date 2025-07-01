import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/assets/images/avatar-placeholder.jpg',
    subscriptionTier: 'Pro',
    subscriptionStatus: 'active'
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profileMenuItems = [
    {
      label: 'View Profile',
      icon: 'User',
      action: () => navigate('/user-profile'),
      description: 'Manage your account settings'
    },
    {
      label: 'Subscription',
      icon: 'CreditCard',
      action: () => navigate('/subscription-management'),
      description: 'Manage billing and plans'
    },
    {
      label: 'Settings',
      icon: 'Settings',
      action: () => console.log('Settings clicked'),
      description: 'App preferences and configuration'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => console.log('Help clicked'),
      description: 'Get help and contact support'
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: handleSignOut,
      description: 'Sign out of your account',
      variant: 'danger'
    }
  ];

  function handleSignOut() {
    console.log('Sign out clicked');
    setIsOpen(false);
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const getSubscriptionBadgeColor = (status, tier) => {
    if (status !== 'active') return 'bg-warning/20 text-warning border-warning/30';
    
    switch (tier.toLowerCase()) {
      case 'pro':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'enterprise':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      default:
        return 'bg-accent/20 text-accent border-accent/30';
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile User Info */}
        <div className="flex items-center space-x-3 p-4 glass rounded-lg">
          <div className="relative">
            <Image
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${
              user.subscriptionStatus === 'active' ? 'bg-success' : 'bg-warning'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <p className="text-xs text-text-secondary truncate">{user.email}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${
              getSubscriptionBadgeColor(user.subscriptionStatus, user.subscriptionTier)
            }`}>
              {user.subscriptionTier} Plan
            </div>
          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="space-y-1">
          {profileMenuItems.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} className="border-t border-white/20 my-2" />;
            }

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                  item.variant === 'danger' ?'text-error hover:bg-error/10' :'text-text-primary hover:text-primary'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={18} 
                  color={item.variant === 'danger' ? 'currentColor' : 'currentColor'} 
                />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-text-secondary">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop User Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="User menu"
      >
        <div className="relative">
          <Image
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
            user.subscriptionStatus === 'active' ? 'bg-success' : 'bg-warning'
          }`} />
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-glass border border-white/20 py-2 z-1100 animate-slide-down">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${
                  user.subscriptionStatus === 'active' ? 'bg-success' : 'bg-warning'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${
                  getSubscriptionBadgeColor(user.subscriptionStatus, user.subscriptionTier)
                }`}>
                  <Icon name="Crown" size={12} className="mr-1" />
                  {user.subscriptionTier} Plan
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {profileMenuItems.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={index} className="border-t border-white/20 my-2" />;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/10 ${
                    item.variant === 'danger' ?'text-error hover:bg-error/10' :'text-text-primary hover:text-primary'
                  }`}
                >
                  <Icon 
                    name={item.icon} 
                    size={18} 
                    color={item.variant === 'danger' ? 'currentColor' : 'currentColor'} 
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-text-secondary">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;