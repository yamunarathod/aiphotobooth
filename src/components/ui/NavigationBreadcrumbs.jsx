import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/create-event': { label: 'Create Event', icon: 'Plus', parent: '/dashboard' },
    '/event-management': { label: 'Event Management', icon: 'Calendar' },
    '/user-profile': { label: 'User Profile', icon: 'User' }
  };

  const generateBreadcrumbs = () => {
    const currentRoute = routeMap[location.pathname];
    if (!currentRoute) return [];

    const breadcrumbs = [];
    let current = currentRoute;
    let currentPath = location.pathname;

    // Build breadcrumb chain
    while (current) {
      breadcrumbs.unshift({
        label: current.label,
        icon: current.icon,
        path: currentPath,
        isActive: currentPath === location.pathname
      });

      if (current.parent) {
        currentPath = current.parent;
        current = routeMap[current.parent];
      } else {
        break;
      }
    }

    // Always include Home/Dashboard as root if not already present
    if (breadcrumbs.length > 0 && breadcrumbs[0].path !== '/dashboard') {
      breadcrumbs.unshift({
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        path: '/dashboard',
        isActive: false
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on dashboard or if no breadcrumbs
  if (location.pathname === '/dashboard' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-text-secondary" 
              />
            )}
            
            {breadcrumb.isActive ? (
              <div className="flex items-center space-x-2 text-primary">
                <Icon name={breadcrumb.icon} size={16} />
                <span className="font-medium">{breadcrumb.label}</span>
              </div>
            ) : (
              <button
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200 hover:bg-white/5 px-2 py-1 rounded-md"
              >
                <Icon name={breadcrumb.icon} size={16} />
                <span>{breadcrumb.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Back Button */}
      <div className="md:hidden ml-auto">
        {breadcrumbs.length > 1 && (
          <button
            onClick={() => {
              const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
              if (parentBreadcrumb) {
                handleBreadcrumbClick(parentBreadcrumb.path);
              }
            }}
            className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/5"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Back</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBreadcrumbs;