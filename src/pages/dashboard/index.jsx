import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase'; // Ensure supabase is imported
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import EventFormFields from '../create-event/components/EventFormFields';
import StyleSelector from '../create-event/components/StyleSelector';
import EventSummary from '../create-event/components/EventSummary';
import LicenseDownload from '../create-event/components/LicenseDownload';


const Dashboard = () => {
  const { user, userProfile, signOut } = useAuth();


  // View and download states
  const [viewingEvent, setViewingEvent] = useState(null);
  const [downloadingEvent, setDownloadingEvent] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  // Loading and data states
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [events, setEvents] = useState([]);

  // Event creation flow states
  const [step, setStep] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [createdEvent, setCreatedEvent] = useState(null);

  // Default object for users without a subscription
  const noSubscription = {
    status: 'inactive',
    metadata: {
      planName: 'No Plan',
      transformsIncluded: 0,
      transformsUsed: 0,
    }
  };

  // Fetch subscription and events data on component mount
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }


    // Updated fetchDashboardData function
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch the most recent active subscription for the user
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('userId', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subError && subError.code !== 'PGRST116') {
          throw subError;
        }

        setSubscription(subData || noSubscription);

        // Fetch user's events from database
        const eventsData = await fetchEventsFromDatabase();
        setEvents(eventsData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSubscription(noSubscription);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);


  // Derived values from subscription state
  const hasActiveSubscription = subscription && subscription.status === 'active';
  const planName = subscription?.metadata?.planName || 'No Plan';
  const transformsUsed = subscription?.metadata?.transformsUsed ?? 0;
  const transformsIncluded = subscription?.metadata?.transformsIncluded ?? 0;
  const transformsRemaining = transformsIncluded - transformsUsed;

  // Determine max styles based on plan name from metadata
  const getMaxStyles = () => {
    switch (planName.toLowerCase()) {
      case 'professional':
        return 6;
      case 'starter':
        return 2;
      default:
        return 0;
    }
  };
  const maxStyles = getMaxStyles();

  // Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEventClick = () => {
    if (!hasActiveSubscription) {
      alert("You need an active subscription to create an event. Please subscribe to a plan.");
      navigate('/subscription');
      return;
    }
    setStep('form');
  };

  const handleEventFormSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setStep('styles');
  };

  const handleStyleToggle = (styleId, isSelected) => {
    setSelectedStyles((prev) =>
      isSelected
        ? [...prev, styleId]
        : prev.filter((id) => id !== styleId)
    );
  };

  const handleStylesSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (selectedStyles.length === 0) newErrors.styles = "Please select at least one AI style.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setCreatedEvent({ ...formData, selectedStyles, subscriptionPlan: planName });
    setStep('summary');
  };

  const handleNextFromSummary = () => {
    setStep('license');
  };



  // Updated handleLicenseDone function
  const handleLicenseDone = async () => {
    try {
      // Save event to database
      const savedEvent = await saveEventToDatabase(createdEvent);

      // Log the event details to console
      console.log('=== EVENT CREATED ===');
      console.log('Event Details:', {
        id: savedEvent.id,
        eventName: savedEvent.event_name,
        startDate: savedEvent.start_date,
        startTime: savedEvent.start_time,
        endDate: savedEvent.end_date,
        endTime: savedEvent.end_time,
        location: savedEvent.location,
        description: savedEvent.description,
        selectedStyles: savedEvent.selected_styles,
        subscriptionPlan: savedEvent.subscription_plan,
        createdAt: savedEvent.created_at,
        userId: savedEvent.user_id,
        metadata: savedEvent.metadata
      });

      // Log selected styles details if any
      if (savedEvent.selected_styles && savedEvent.selected_styles.length > 0) {
        console.log('Selected AI Styles:', savedEvent.selected_styles);
        console.log('Number of styles selected:', savedEvent.selected_styles.length);
      }

      // Log subscription info
      console.log('Subscription Info:', {
        planName: savedEvent.subscription_plan,
        subscriptionId: savedEvent.subscription_id,
        transformsUsed: transformsUsed,
        transformsIncluded: transformsIncluded,
        transformsRemaining: transformsRemaining
      });

      console.log('=== END EVENT LOG ===');

      // Add to local events array (this will be replaced by fresh data from database)
      setEvents(prevEvents => [savedEvent, ...prevEvents]);

      // Reset form state
      setFormData({
        eventName: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        description: ''
      });
      setSelectedStyles([]);
      setCreatedEvent(null);
      setStep(null);
      setErrors({});

    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };



  const handleBackToEdit = () => setStep('form');
  const handleBackToStyles = () => setStep('styles');

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) navigate('/');
  };


  // Function to save event to database
  const saveEventToDatabase = async (eventData) => {
    try {
      const licenseKey = generateLicenseKey({ id: Date.now().toString() });
      
      const eventToSave = {
        user_id: user.id,
        event_name: eventData.eventName,
        start_date: eventData.startDate,
        start_time: eventData.startTime,
        end_date: eventData.endDate,
        end_time: eventData.endTime,
        location: eventData.location || '',
        description: eventData.description || '',
        selected_styles: eventData.selectedStyles || [],
        subscription_plan: eventData.subscriptionPlan || 'No Plan',
        subscription_id: subscription?.id || null,
        license_key: licenseKey,
        license_generated_at: new Date().toISOString(),
        status: 'active',
        metadata: {
          transformsUsedAtCreation: transformsUsed,
          transformsIncludedAtCreation: transformsIncluded,
          userEmail: user.email,
          userName: userProfile?.username || userProfile?.full_name || 'Unknown'
        }
      };

      console.log('Saving event to database:', eventToSave);

      const { data, error } = await supabase
        .from('events')
        .insert([eventToSave])
        .select()
        .single();

      if (error) {
        console.error('Error saving event:', error);
        throw error;
      }

      console.log('Event saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to save event to database:', error);
      throw error;
    }
  };

   const generateLicenseKey = (eventData) => {
    const timestamp = new Date().getTime();
    const eventId = eventData.id.slice(0, 8);
    const userId = user.id.slice(0, 8);
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MPB-${eventId}-${userId}-${randomString}-${timestamp}`;
  };

  // Function to update license key for existing event
  const updateLicenseKey = async (eventId) => {
    try {
      const newLicenseKey = generateLicenseKey({ id: eventId });
      
      const { data, error } = await supabase
        .from('events')
        .update({
          license_key: newLicenseKey,
          license_generated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating license key:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update license key:', error);
      throw error;
    }
  };

  const downloadLicense = (eventData) => {
    const licenseContent = ` `.trim();

    const blob = new Blob([licenseContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MPB_License_${eventData.event_name.replace(/[^a-zA-Z0-9]/g, '_')}_${eventData.start_date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


    const fetchEventDetails = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      throw error;
    }
  };


  const handleViewEvent = async (eventId) => {
    try {
      const eventDetails = await fetchEventDetails(eventId);
      setViewingEvent(eventDetails);
      console.log('Viewing event details:', eventDetails);
    } catch (error) {
      console.error('Error viewing event:', error);
      alert('Failed to load event details. Please try again.');
    }
  };


  // Handle download license
  const handleDownloadLicense = async (eventId) => {
    try {
      setIsDownloading(true);
      setDownloadingEvent(eventId);
      
      // Fetch current event details
      const eventDetails = await fetchEventDetails(eventId);
      
      // Update license key (generate new one each time)
      const updatedEvent = await updateLicenseKey(eventId);
      
      // Download the license
      downloadLicense(updatedEvent);
      
      // Update local events array with new license info
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, license_key: updatedEvent.license_key, license_generated_at: updatedEvent.license_generated_at }
            : event
        )
      );
      
      console.log('License downloaded successfully:', updatedEvent.license_key);
      
    } catch (error) {
      console.error('Error downloading license:', error);
      alert('Failed to download license. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadingEvent(null);
    }
  };


  // Add this new function to fetch events from database
  const fetchEventsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Fetched events from database:', data);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch events from database:', error);
      return [];
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Magic Photobooth AI</h1>
                <p className="text-sm text-slate-400">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{userProfile?.full_name || user?.email}</p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-slate-400">
            Here's what's happening with your AI photobooth magic today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Sparkles" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{transformsUsed}</span>
              <span className="text-slate-400 text-sm ml-2">/ {transformsIncluded}</span>
            </div>
            <p className="text-slate-400 text-sm">Transformations Used</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Calendar" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{events.length}</span>
            </div>
            <p className="text-slate-400 text-sm">Events This Month</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Users" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <p className="text-slate-400 text-sm">Total Guests Served</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Download" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <p className="text-slate-400 text-sm">Photos Downloaded</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Events</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-400 text-violet-400 disabled:border-slate-600 disabled:text-slate-500 disabled:cursor-not-allowed"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleCreateEventClick}
                  disabled={!hasActiveSubscription}
                  title={!hasActiveSubscription ? "You need an active subscription to create an event" : "Create a new event"}
                >
                  New Event
                </Button>
              </div>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-slate-400 text-center py-8">No events yet. Click "New Event" to create one.</div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-violet-500/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{event.event_name || event.eventName}</h4>
                        <p className="text-slate-400 text-sm mb-2">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>
                            {event.selected_styles?.length || 0} styles
                          </span>
                          <span>•</span>
                          <span>{event.location}</span>
                          <span>•</span>
                          <span>{event.start_date} at {event.start_time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300"
                          onClick={() => handleViewEvent(event.id)}
                        >
                          View
                        </Button>
                       <Button
                          variant="outline"
                          size="sm"
                          className="border-violet-400 text-violet-400 disabled:opacity-50"
                          iconName="Download"
                          onClick={() => handleDownloadLicense(event.id)}
                          disabled={isDownloading && downloadingEvent === event.id}
                        >
                          {isDownloading && downloadingEvent === event.id ? 'Downloading...' : 'Download'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Plan Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
              <div className="bg-violet-500/20 rounded-lg p-4 border border-violet-500/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-violet-300 font-medium">{planName}</span>
                  <Icon name="Crown" size={20} className="text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{transformsRemaining < 0 ? 0 : transformsRemaining}</div>
                <div className="text-sm text-slate-400">transformations remaining</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-violet-400 text-violet-400"
                onClick={() => navigate('/subscription')}
              >
                {hasActiveSubscription ? 'Upgrade Plan' : 'View Plans'}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed"
                  iconName="Sparkles"
                  iconPosition="left"
                  onClick={handleCreateEventClick}
                  disabled={!hasActiveSubscription}
                >
                  Start New Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300"
                  iconName="Palette"
                  iconPosition="left"
                >
                  Browse Styles
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals for event creation */}
        {step === 'form' && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-white" onClick={() => setStep(null)}>
                <Icon name="X" size={20} />
              </button>
              <EventFormFields formData={formData} handleInputChange={handleInputChange} errors={errors} onSubmit={handleEventFormSubmit} />
            </div>
          </div>
        )}
        {step === 'styles' && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-white" onClick={() => setStep(null)}>
                <Icon name="X" size={20} />
              </button>
              <form onSubmit={handleStylesSubmit}>
                <StyleSelector selectedStyles={selectedStyles} onStyleToggle={handleStyleToggle} subscriptionPlan={planName} maxStyles={maxStyles} errors={errors} />
                {errors.styles && <p className="mt-2 text-sm text-red-500">{errors.styles}</p>}
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="ghost" onClick={handleBackToEdit}>Back</Button>
                  <Button type="submit" variant="primary">Next</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {step === 'summary' && createdEvent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-white" onClick={() => setStep(null)}><Icon name="X" size={20} /></button>
              <EventSummary formData={createdEvent} selectedStyles={createdEvent.selectedStyles} subscriptionPlan={createdEvent.subscriptionPlan} />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={handleBackToStyles}>Back</Button>
                <Button variant="primary" onClick={handleNextFromSummary}>Create & Generate License</Button>
              </div>
            </div>
          </div>
        )}
        {step === 'license' && createdEvent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-white" onClick={handleLicenseDone}><Icon name="X" size={20} /></button>
              <LicenseDownload eventData={createdEvent} selectedStyles={createdEvent.selectedStyles} onClose={handleLicenseDone} onNewEvent={() => { handleLicenseDone(); handleCreateEventClick(); }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
