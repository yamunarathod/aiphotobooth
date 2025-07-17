import React, { useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EventDetailsModal = ({ isOpen, onClose, event, onDownloadLicense, onEditEvent }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'completed':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'cancelled':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-text-secondary/20 text-text-secondary border-text-secondary/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMinutes === 0) {
      return `${diffHours} hours`;
    }
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] glass-interactive rounded-xl shadow-glass-lg border border-white/20 animate-scale-in overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{event.eventName}</h2>
              <p className="text-sm text-text-secondary">{event.location}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors duration-200"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Calendar" size={20} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Date</div>
                      <div className="text-sm text-text-secondary">{formatDate(event.eventDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Icon name="Clock" size={20} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Time</div>
                      <div className="text-sm text-text-secondary">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        <span className="ml-2 text-xs">({calculateDuration(event.startTime, event.endTime)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Icon name="MapPin" size={20} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Location</div>
                      <div className="text-sm text-text-secondary">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Icon name="Users" size={20} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Expected Guests</div>
                      <div className="text-sm text-text-secondary">{event.guestCount} people</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Icon name="Tag" size={20} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Event Type</div>
                      <div className="text-sm text-text-secondary capitalize">{event.eventType}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size={18} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{event.contactName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Mail" size={18} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{event.contactEmail}</span>
                  </div>
                  {event.contactPhone && (
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={18} className="text-text-secondary" />
                      <span className="text-sm text-text-primary">{event.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {event.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Special Requests</h3>
                  <div className="glass rounded-lg p-4 border border-white/20">
                    <p className="text-sm text-text-secondary">{event.specialRequests}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Styles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Selected Art Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.selectedStyles.map((style, index) => (
                    <div key={index} className="glass rounded-lg p-4 border border-white/20">
                      <Image
                        src={style.thumbnail}
                        alt={style.name}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                      <div className="text-sm font-medium text-text-primary">{style.name}</div>
                      <div className="text-xs text-text-secondary">{style.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* License Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">License Information</h3>
                <div className="glass rounded-lg p-4 border border-white/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">License ID</span>
                    <span className="text-sm font-mono text-text-primary">{event.licenseId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Generated</span>
                    <span className="text-sm text-text-primary">
                      {new Date(event.licenseGenerated).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Valid Until</span>
                    <span className="text-sm text-text-primary">
                      {new Date(event.licenseExpiry).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Status</span>
                    <span className={`text-sm font-medium ${
                      event.licenseStatus === 'active' ? 'text-success' : 'text-warning'
                    }`}>
                      {event.licenseStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Event Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-lg p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-primary">{event.stats.photosGenerated}</div>
                    <div className="text-xs text-text-secondary">Photos Generated</div>
                  </div>
                  <div className="glass rounded-lg p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-accent">{event.stats.transformationsUsed}</div>
                    <div className="text-xs text-text-secondary">Transformations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20">
          <div className="text-sm text-text-secondary">
            Created on {new Date(event.createdAt).toLocaleDateString('en-IN')}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onEditEvent(event)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Event
            </Button>
            
            <Button
              variant="primary"
              onClick={() => onDownloadLicense(event)}
              iconName="Download"
              iconPosition="left"
              className="gradient-border"
            >
              Download License
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;