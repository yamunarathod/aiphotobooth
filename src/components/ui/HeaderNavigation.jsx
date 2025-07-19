import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import UserProfileDropdown from './UserProfileDropdown';
import CreateEventModal from './CreateEventModal';

const HeaderNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View dashboard overview and analytics'
    },
    {
      label: 'Events',
      path: '/event-management',
      icon: 'Calendar',
      tooltip: 'Manage your events and bookings'
    },
    {
      label: 'Account',
      path: '/user-profile',
      icon: 'User',
      tooltip: 'Manage profile and subscription',
      submenu: [
        {
          label: 'Profile',
          path: '/user-profile',
          icon: 'User'
        }
      ]
    }
  ];



  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 glass border-b border-white/20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <img
                      src="/assets/images/logo.png"
                      alt="Photobooth AI Logo"
                      className="w-full h-full object-contain"
                    />                  </div>
                  <span className="text-xl font-semibold text-gradient">
                    AI Photobooth
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${isActiveRoute(item.path)
                        ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-primary hover:text-primary'
                      }`}
                    title={item.tooltip}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </button>

                  {/* Desktop Submenu */}
                  {item.submenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-1100">
                      <div className="glass rounded-lg shadow-glass border border-white/20 py-2">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.path}
                            onClick={() => handleNavigation(subItem.path)}
                            className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/10 transition-colors duration-200 ${location.pathname === subItem.path
                                ? 'text-primary bg-primary/10' : 'text-text-primary hover:text-primary'
                              }`}
                          >
                            <Icon name={subItem.icon} size={16} />
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={handleCreateEvent}
                iconName="Plus"
                iconPosition="left"
                className="gradient-border"
              >
                Create Event
              </Button>
              <UserProfileDropdown />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={handleCreateEvent}
                iconName="Plus"
                size="sm"
                className="gradient-border"
              >
                Create
              </Button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-text-primary hover:text-primary hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-1150 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
            <div
              ref={mobileMenuRef}
              className="fixed top-0 right-0 h-full w-80 max-w-sm glass-interactive border-l border-white/20 animate-slide-in-right"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon name="Camera" size={16} color="white" />
                    </div>
                    <span className="font-semibold text-gradient">AI Photobooth</span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg text-text-primary hover:text-primary hover:bg-white/10 transition-colors duration-200"
                    aria-label="Close mobile menu"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.path}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${isActiveRoute(item.path)
                            ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-primary hover:text-primary'
                          }`}
                      >
                        <Icon name={item.icon} size={20} />
                        <span className="font-medium">{item.label}</span>
                      </button>

                      {/* Mobile Submenu */}
                      {item.submenu && isActiveRoute(item.path) && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem.path}
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-sm transition-colors duration-200 hover:bg-white/10 ${location.pathname === subItem.path
                                  ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary'
                                }`}
                            >
                              <Icon name={subItem.icon} size={16} />
                              <span>{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile User Profile */}
                <div className="p-4 border-t border-white/20">
                  <UserProfileDropdown isMobile={true} />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />
    </>
  );
};

export default HeaderNavigation;