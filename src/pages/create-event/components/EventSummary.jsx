import React from 'react';
import Icon from '../../../components/AppIcon';

const EventSummary = ({ formData, selectedStyles, subscriptionPlan }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      return 'Not specified';
    }

    try {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      const diffMs = end - start;
      
      if (diffMs <= 0) return 'Invalid duration';
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours === 0) {
        return `${diffMinutes} minutes`;
      } else if (diffMinutes === 0) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
      } else {
        return `${diffHours}h ${diffMinutes}m`;
      }
    } catch (error) {
      return 'Invalid duration';
    }
  };

  const getStyleNames = () => {
    const styleMap = {
      'vintage': 'Vintage Classic',
      'modern': 'Modern Glam',
      'artistic': 'Artistic Portrait',
      'wedding': 'Wedding Romance',
      'party': 'Party Fun',
      'corporate': 'Corporate Professional'
    };

    return selectedStyles.map(styleId => styleMap[styleId] || styleId);
  };

  const summaryItems = [
    {
      icon: 'Calendar',
      label: 'Event Name',
      value: formData.eventName || 'Not specified',
      important: true
    },
    {
      icon: 'Clock',
      label: 'Start Date & Time',
      value: formData.startDate && formData.startTime 
        ? `${formatDate(formData.startDate)} at ${formatTime(formData.startTime)}`
        : 'Not specified'
    },
    {
      icon: 'Clock',
      label: 'End Date & Time',
      value: formData.endDate && formData.endTime 
        ? `${formatDate(formData.endDate)} at ${formatTime(formData.endTime)}`
        : 'Not specified'
    },
    {
      icon: 'Timer',
      label: 'Duration',
      value: calculateDuration()
    },
    {
      icon: 'MapPin',
      label: 'Location',
      value: formData.location || 'Not specified'
    },
    {
      icon: 'FileText',
      label: 'Description',
      value: formData.description || 'No description provided'
    },
    {
      icon: 'Palette',
      label: 'Selected Styles',
      value: selectedStyles.length > 0 ? getStyleNames().join(', ') : 'No styles selected',
      important: true
    },
    {
      icon: 'Crown',
      label: 'Subscription Plan',
      value: subscriptionPlan || 'Unknown'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Icon name="Eye" size={24} color="white" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">Event Summary</h3>
        <p className="text-sm text-text-secondary">
          Review your event details before creating the license
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass rounded-lg border border-white/20 overflow-hidden">
        <div className="p-6 space-y-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                item.important ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary'
              }`}>
                <Icon name={item.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className={`text-sm mt-1 ${
                  item.important ? 'text-text-primary font-medium' : 'text-text-secondary'
                }`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* License Info */}
        <div className="border-t border-white/20 bg-primary/5 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">License Information</span>
          </div>
          <p className="text-xs text-text-secondary">
            A JWT license key will be generated for this event configuration. The license will include all selected styles and event parameters for photobooth operation.
          </p>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Event Name</span>
          <div className="flex items-center space-x-1">
            <Icon 
              name={formData.eventName ? "CheckCircle" : "XCircle"} 
              size={16} 
              className={formData.eventName ? "text-success" : "text-error"} 
            />
            <span className={formData.eventName ? "text-success" : "text-error"}>
              {formData.eventName ? "Valid" : "Required"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Date & Time</span>
          <div className="flex items-center space-x-1">
            <Icon 
              name={formData.startDate && formData.startTime && formData.endDate && formData.endTime ? "CheckCircle" : "XCircle"} 
              size={16} 
              className={formData.startDate && formData.startTime && formData.endDate && formData.endTime ? "text-success" : "text-error"} 
            />
            <span className={formData.startDate && formData.startTime && formData.endDate && formData.endTime ? "text-success" : "text-error"}>
              {formData.startDate && formData.startTime && formData.endDate && formData.endTime ? "Valid" : "Required"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">AI Styles</span>
          <div className="flex items-center space-x-1">
            <Icon 
              name={selectedStyles.length > 0 ? "CheckCircle" : "XCircle"} 
              size={16} 
              className={selectedStyles.length > 0 ? "text-success" : "text-error"} 
            />
            <span className={selectedStyles.length > 0 ? "text-success" : "text-error"}>
              {selectedStyles.length > 0 ? `${selectedStyles.length} Selected` : "Required"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummary;