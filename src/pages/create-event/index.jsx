import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import EventFormFields from './components/EventFormFields';
import StyleSelector from './components/StyleSelector';
import EventSummary from './components/EventSummary';
import LicenseDownload from './components/LicenseDownload';
import { supabase } from '../../utils/supabase'; // Use this import

const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [duration, setDuration] = useState(0);

  // Mock user subscription data
  const [userSubscription] = useState({
    plan: 'Professional', // or 'Starter'
    maxStyles: 3, // 3 for Professional, 1 for Starter
    isActive: true,
    planPrice: '₹149' // ₹149 for Professional, ₹49 for Starter
  });

  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    subscriptionPlan: userSubscription.plan
  });

  const [selectedStyles, setSelectedStyles] = useState([]);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Event Details', icon: 'Calendar' },
    { id: 2, title: 'AI Styles', icon: 'Palette' },
    { id: 3, title: 'Review', icon: 'Eye' },
    { id: 4, title: 'License', icon: 'Shield' }
  ];

  useEffect(() => {
    // Check if user has active subscription
    if (!userSubscription.isActive) {
      navigate('/subscription-management');
    }
  }, [userSubscription, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStyleToggle = (styleId, isSelected) => {
    if (isSelected) {
      if (selectedStyles.length < userSubscription.maxStyles) {
        setSelectedStyles(prev => [...prev, styleId]);
      }
    } else {
      setSelectedStyles(prev => prev.filter(id => id !== styleId));
    }

    // Clear styles error when user selects a style
    if (errors.styles && isSelected) {
      setErrors(prev => ({
        ...prev,
        styles: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.eventName.trim()) {
          newErrors.eventName = 'Event name is required';
        }
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required';
        }
        if (!formData.startTime) {
          newErrors.startTime = 'Start time is required';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'End date is required';
        }
        if (!formData.endTime) {
          newErrors.endTime = 'End time is required';
        }

        // Validate date/time logic
        if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
          const start = new Date(`${formData.startDate}T${formData.startTime}`);
          const end = new Date(`${formData.endDate}T${formData.endTime}`);
          
          if (start >= end) {
            newErrors.endDate = 'End date/time must be after start date/time';
          }

          // Check if start date is in the past
          const now = new Date();
          if (start < now) {
            newErrors.startDate = 'Start date/time cannot be in the past';
          }
        }
        break;

      case 2:
        if (selectedStyles.length === 0) {
          newErrors.styles = 'Please select at least one AI style';
        }
        break;

      case 3:
        // Final validation before submission
        if (!formData.eventName.trim()) {
          newErrors.eventName = 'Event name is required';
        }
        if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
          newErrors.dateTime = 'All date and time fields are required';
        }
        if (selectedStyles.length === 0) {
          newErrors.styles = 'At least one AI style must be selected';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      // Calculate duration
      if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
        const start = new Date(`${formData.startDate}T${formData.startTime}`);
        const end = new Date(`${formData.endDate}T${formData.endTime}`);
        const diffInMs = end - start;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        setDuration(diffInDays);
      }

      // Prepare event data
      const eventData = {
        ...formData,
        selectedStyles,
        createdAt: new Date().toISOString(),
        userId: 'mock-user-id', // Replace with real user id if available
        status: 'active'
      };

      cosnole.log('Event dataaaaaaaaaaaaaaaaaaaaaaaaaaa:', eventData);

  


      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEvent = () => {
    // Reset form for new event
    setFormData({
      eventName: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      description: '',
      subscriptionPlan: userSubscription.plan
    });
    setSelectedStyles([]);
    setErrors({});
    setCurrentStep(1);
    setEventCreated(false);
    setNewEventData(null);
  };

  const handleClose = () => {
    if (eventCreated && newEventData) {
      navigate('/dashboard', { state: { newEvent: newEventData } });
    } else {
      navigate('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );

      case 2:
        return (
          <StyleSelector
            selectedStyles={selectedStyles}
            onStyleToggle={handleStyleToggle}
            subscriptionPlan={userSubscription.plan}
            maxStyles={userSubscription.maxStyles}
            errors={errors}
          />
        );

      case 3:
        return (
          <EventSummary
            formData={formData}
            selectedStyles={selectedStyles}
            subscriptionPlan={userSubscription.plan}
          />
        );

      case 4:
        return (
          <LicenseDownload
            eventData={formData}
            selectedStyles={selectedStyles}
            duration={duration}
            onClose={handleClose}
            onNewEvent={handleNewEvent}
          />
        );

      default:
        return null;
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Plus" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Create New Event</h1>
                <p className="text-text-secondary">
                  Configure your AI photobooth event with custom styles
                </p>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="glass rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Crown" size={20} className="text-primary" />
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      {userSubscription.plan} Plan
                    </span>
                    <span className="text-xs text-text-secondary ml-2">
                      {userSubscription.planPrice}/month
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-primary">
                    {userSubscription.maxStyles} AI Style{userSubscription.maxStyles > 1 ? 's' : ''} Available
                  </p>
                  <p className="text-xs text-text-secondary">Per event</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        status === 'completed' 
                          ? 'bg-success text-white' 
                          : status === 'current' ?'bg-primary text-white' :'bg-surface border border-white/20 text-text-secondary'
                      }`}>
                        {status === 'completed' ? (
                          <Icon name="Check" size={16} />
                        ) : (
                          <Icon name={step.icon} size={16} />
                        )}
                      </div>
                      <span className={`text-xs mt-2 ${
                        status === 'current' ? 'text-primary font-medium' : 'text-text-secondary'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${
                        step.id < currentStep ? 'bg-success' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="glass rounded-lg border border-white/20 p-6 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
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
                  variant="ghost"
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                {currentStep < 3 ? (
                  <Button
                    variant="primary"
                    onClick={nextStep}
                    iconName="ChevronRight"
                    iconPosition="right"
                    className="gradient-border"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    iconName="Zap"
                    iconPosition="left"
                    className="gradient-border"
                  >
                    {isSubmitting ? 'Creating Event...' : 'Create Event & Generate License'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.submit && (
            <div className="mt-4 glass rounded-lg p-4 border border-error/30 bg-error/10">
              <p className="text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-2" />
                {errors.submit}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;