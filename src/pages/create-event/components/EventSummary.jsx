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

      {/* Summary Card - Redesigned Layout */}
      <div className="glass rounded-lg border border-white/20 overflow-hidden">
        {/* Top Section: Event Name & Date/Time Side by Side */}
        <div className="flex flex-col md:flex-row">
          {/* Event Name */}
          <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-white/20 bg-primary/10 p-3 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center mr-2">
              <Icon name="Calendar" size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-text-secondary">Event Name</p>
              <h4 className="text-base font-semibold text-text-primary truncate">
                {formData.eventName || 'Not specified'}
              </h4>
            </div>
          </div>
          {/* Date and Time Section */}
          <div className="md:w-1/2 p-3">
            <h5 className="text-sm font-medium text-text-primary mb-2 flex items-center">
              <Icon name="Clock" size={14} className="mr-1 text-primary" />
              Date & Time Details
            </h5>
            <div className="grid grid-cols-1 gap-2">
              <div className="glass rounded-md p-2 bg-surface/30">
                <p className="text-xs text-text-secondary">Start</p>
                <p className="text-sm font-medium text-text-primary">
                  {formData.startDate && formData.startTime 
                    ? `${formatDate(formData.startDate)} at ${formatTime(formData.startTime)}`
                    : 'Not specified'}
                </p>
              </div>
              <div className="glass rounded-md p-2 bg-surface/30">
                <p className="text-xs text-text-secondary">End</p>
                <p className="text-sm font-medium text-text-primary">
                  {formData.endDate && formData.endTime 
                    ? `${formatDate(formData.endDate)} at ${formatTime(formData.endTime)}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location and Description */}
        <div className="p-3 border-b border-white/20">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-surface text-text-secondary flex items-center justify-center mt-1">
                <Icon name="MapPin" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-secondary">Location</p>
                <p className="text-sm text-text-primary truncate">
                  {formData.location || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-surface text-text-secondary flex items-center justify-center mt-1">
                <Icon name="FileText" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-secondary">Description</p>
                <p className="text-sm text-text-primary line-clamp-2">
                  {formData.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Styles and Subscription */}
        <div className="p-3 border-b border-white/20">
          <h5 className="text-sm font-medium text-text-primary mb-2 flex items-center">
            <Icon name="Palette" size={14} className="mr-1 text-primary" />
            Styles & Subscription
          </h5>
          
          <div className="glass rounded-md p-2 bg-primary/5 mb-2">
            <p className="text-xs text-text-secondary">Selected Styles</p>
            <p className="text-sm font-medium text-text-primary line-clamp-1">
              {selectedStyles.length > 0 ? getStyleNames().join(', ') : 'No styles selected'}
            </p>
          </div>
          
          <div className="glass rounded-md p-2 bg-surface/30 flex items-center">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-1">
              <Icon name="Crown" size={12} />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Subscription Plan</p>
              <p className="text-sm font-medium text-text-primary">{subscriptionPlan || 'Unknown'}</p>
            </div>
          </div>
        </div>

     
      </div>

      {/* Validation Status */}
      <div className="glass rounded-lg border border-white/20 p-3">
        <h5 className="text-sm font-medium text-text-primary mb-2">Validation Status</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary text-xs">Event Name</span>
            <div className="flex items-center space-x-1">
              <Icon 
                name={formData.eventName ? "CheckCircle" : "XCircle"} 
                size={14} 
                className={formData.eventName ? "text-success" : "text-error"} 
              />
              <span className={`text-xs ${formData.eventName ? "text-success" : "text-error"}`}>
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
    </div>
  );
};

export default EventSummary;