import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const CreateEventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    eventType: 'wedding',
    guestCount: '',
    duration: '4',
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const eventTypes = [
    { value: 'wedding', label: 'Wedding', icon: 'Heart' },
    { value: 'birthday', label: 'Birthday Party', icon: 'Gift' },
    { value: 'corporate', label: 'Corporate Event', icon: 'Building' },
    { value: 'graduation', label: 'Graduation', icon: 'GraduationCap' },
    { value: 'anniversary', label: 'Anniversary', icon: 'Calendar' },
    { value: 'other', label: 'Other', icon: 'Star' }
  ];

  const durationOptions = [
    { value: '2', label: '2 Hours' },
    { value: '4', label: '4 Hours' },
    { value: '6', label: '6 Hours' },
    { value: '8', label: '8 Hours' },
    { value: 'full-day', label: 'Full Day' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Event created:', formData);
      
      // Reset form and close modal
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        location: '',
        eventType: 'wedding',
        guestCount: '',
        duration: '4',
        specialRequests: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.eventName && formData.eventDate && formData.eventTime && formData.location;
      case 2:
        return formData.eventType && formData.guestCount && formData.duration;
      case 3:
        return formData.contactName && formData.contactEmail;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
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

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Event Name *
              </label>
              <Input
                ref={firstInputRef}
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Event Date *
                </label>
                <Input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Event Time *
                </label>
                <Input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Location *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Event Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, eventType: type.value }))}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                      formData.eventType === type.value
                        ? 'border-primary bg-primary/10 text-primary' :'border-white/20 glass hover:border-primary/50 text-text-primary'
                    }`}
                  >
                    <Icon name={type.icon} size={24} className="mx-auto mb-2" />
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Expected Guest Count *
                </label>
                <Input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  placeholder="Number of guests"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements or requests..."
                rows={3}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contact Name *
              </label>
              <Input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Primary contact name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contact Email *
              </label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contact Phone
              </label>
              <Input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Phone number"
              />
            </div>

            {/* Event Summary */}
            <div className="glass rounded-lg p-4 border border-white/20">
              <h4 className="text-sm font-medium text-text-primary mb-3">Event Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Event:</span>
                  <span className="text-text-primary">{formData.eventName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date & Time:</span>
                  <span className="text-text-primary">{formData.eventDate} at {formData.eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Location:</span>
                  <span className="text-text-primary">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Type:</span>
                  <span className="text-text-primary capitalize">{formData.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Guests:</span>
                  <span className="text-text-primary">{formData.guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-text-primary">{formData.duration} hours</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
        className="relative w-full max-w-2xl max-h-[90vh] glass-interactive rounded-xl shadow-glass-lg border border-white/20 animate-scale-in overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Create New Event</h2>
            <p className="text-sm text-text-secondary mt-1">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Event Details' :
                currentStep === 2 ? 'Event Configuration': 'Contact Information'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors duration-200"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-white/20">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  step <= currentStep
                    ? 'bg-primary text-white' :'bg-surface border border-white/20 text-text-secondary'
                }`}>
                  {step < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors duration-200 ${
                    step < currentStep ? 'bg-primary' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-96 overflow-y-auto scrollbar-hide">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/20">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={!isStepValid()}
                  iconName="Plus"
                  iconPosition="left"
                  className="gradient-border"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;