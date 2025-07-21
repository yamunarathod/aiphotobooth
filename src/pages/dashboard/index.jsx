import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase'; // Main supabase client
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
  console.log('User Subscription>>>>>>>>>>>>>>>>>>>>>>>:', subscription?.metadata?.planName);
  const [events, setEvents] = useState([]);
  const [totalAggregatedCreditsUsed, setTotalAggregatedCreditsUsed] = useState(0);
  const [totalImagesGenerated, setTotalImagesGenerated] = useState(0); // NEW: State for total images generated

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
  const [savedEventId, setSavedEventId] = useState(null);

  // Default object for users without a subscription
  const noSubscription = {
    status: 'inactive',
    metadata: {
      planName: 'No Plan',
      transformsIncluded: 0,
      transformsUsed: 0,
    }
  };

  // Helper function to fetch events from the main Supabase database
  const fetchEventsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events from main supabase:', error);
        throw error;
      }

      console.log('Fetched events from main database:', data);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch events from main database:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch ALL active subscriptions for the user
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('userId', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (subError && subError.code !== 'PGRST116') {
          throw subError;
        }

        let processedSubscription = noSubscription;
        if (subscriptions && subscriptions.length > 0) {
          const planTotals = subscriptions.reduce((acc, sub) => {
            const planName = sub.plan_name || 'Unknown';
            if (!acc[planName]) {
              acc[planName] = {
                transformsIncluded: 0,
                transformsUsed: 0,
                count: 0,
                latestSubscription: sub
              };
            }
            
            // Handle transforms_included which can be 'unlimited' or a number string
            const transformsIncluded = sub.transforms_included === 'unlimited' 
              ? Number.MAX_SAFE_INTEGER 
              : parseInt(sub.transforms_included) || 0;
            
            acc[planName].transformsIncluded += transformsIncluded;
            acc[planName].transformsUsed += sub.transforms_used || 0;
            acc[planName].count += 1;
            
            if (new Date(sub.created_at) > new Date(acc[planName].latestSubscription.created_at)) {
              acc[planName].latestSubscription = sub;
            }
            return acc;
          }, {});

          const mostRecentPlan = Object.values(planTotals).reduce((latest, current) => {
            return new Date(current.latestSubscription.created_at) > new Date(latest.latestSubscription.created_at)
              ? current
              : latest;
          });

          processedSubscription = {
            status: 'active',
            id: mostRecentPlan.latestSubscription.id,
            metadata: {
              planName: mostRecentPlan.latestSubscription.plan_name || 'Unknown',
              transformsIncluded: mostRecentPlan.latestSubscription.transforms_included === 'unlimited' 
                ? 'unlimited' 
                : mostRecentPlan.transformsIncluded,
              transformsUsed: mostRecentPlan.transformsUsed,
              subscriptionCount: mostRecentPlan.count,
              billingCycle: mostRecentPlan.latestSubscription.billing_cycle,
              nextBillingDate: mostRecentPlan.latestSubscription.next_billing_date
            },
            allSubscriptions: subscriptions,
            planTotals: planTotals
          };
          console.log('Processed subscription data:', processedSubscription);
          console.log('Plan totals:', planTotals);
        }
        setSubscription(processedSubscription);

        // Fetch user's events from main database
        const eventsData = await fetchEventsFromDatabase();
        setEvents(eventsData);

        // Calculate total aggregated credits from fetched events
        const totalCreditsFromEvents = eventsData.reduce((sum, event) => sum + (event.metadata?.creditsUsed || 0), 0);
        setTotalAggregatedCreditsUsed(totalCreditsFromEvents);

        // NEW: Calculate total images generated from fetched events
        const totalImagesFromEvents = eventsData.reduce((sum, event) => {
          // Check both direct field and metadata field for images_generated
          const imagesGenerated = event.images_generated || event.metadata?.photosGenerated || 0;
          return sum + imagesGenerated;
        }, 0);
        setTotalImagesGenerated(totalImagesFromEvents);

        // Fetch user credits from user_credits table
        const { data: userCredits, error: creditsError } = await supabase
          .from('user_credits')
          .select('credits_left')
          .eq('user_id', user.id)
          .single();

        if (creditsError && creditsError.code !== 'PGRST116') {
          console.error('Error fetching user credits:', creditsError);
        }

        // If we have user credits, update the subscription metadata
        if (userCredits && processedSubscription.status === 'active') {
          const creditsLeft = parseInt(userCredits.credits_left) || 0;
          processedSubscription.metadata.creditsLeft = creditsLeft;
          processedSubscription.metadata.transformsIncluded = creditsLeft + totalCreditsFromEvents;
          setSubscription({ ...processedSubscription });
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSubscription(noSubscription);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time listener for the 'events' table in the main Supabase client
    const eventsChannel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Change received in main supabase events table:', payload);
          const updatedEvent = payload.new;
          if (updatedEvent) {
            setEvents(prevEvents => {
              const newEvents = prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
              );
              
              // Recalculate total aggregated credits
              const newTotalAggregated = newEvents.reduce((sum, event) => sum + (event.metadata?.creditsUsed || 0), 0);
              setTotalAggregatedCreditsUsed(newTotalAggregated);
              
              // NEW: Recalculate total images generated
              const newTotalImages = newEvents.reduce((sum, event) => {
                const imagesGenerated = event.images_generated || event.metadata?.photosGenerated || 0;
                return sum + imagesGenerated;
              }, 0);
              setTotalImagesGenerated(newTotalImages);
              
              return newEvents;
            });
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(eventsChannel);
    };

  }, [user]);

  // Derived values from subscription state
  const hasActiveSubscription = subscription && subscription.status === 'active';
  const planName = subscription?.metadata?.planName || 'No Plan';
  const transformsUsedDisplay = totalAggregatedCreditsUsed;
  const transformsIncluded = subscription?.metadata?.transformsIncluded ?? 0;
  const transformsRemaining = transformsIncluded - transformsUsedDisplay;
  const subscriptionCount = subscription?.metadata?.subscriptionCount || 0;

  // Determine max styles based on plan name from metadata
  const getMaxStyles = () => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return 6;
      case 'starter':
        return 2;
      default:
        return 0;
    }
  };
  const maxStyles = getMaxStyles();

  // Handlers (keeping existing handlers)
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
    setCreatedEvent({ ...formData, selectedStyles, subscriptionPlan: planName, userId: user.id });
    setStep('summary');
  };

  const handleNextFromSummary = async () => {
    try {
      const savedEvent = await saveEventToDatabase(createdEvent);
      setSavedEventId(savedEvent.id);
      setCreatedEvent(prev => ({ ...prev, eventId: savedEvent.id }));
      setStep('license');
    } catch (error) {
      console.error('Error saving event:', error);
      
      let errorMessage = 'Failed to save event. ';
      if (error.message.includes('Network connection error')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const saveEventToDatabase = async (eventData) => {
    console.log('Saving event to database:', eventData);
    try {
      const formatDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return date;
      };

      const eventToSave = {
        user_id: user.id,
        event_name: eventData.eventName,
        start_date: formatDate(eventData.startDate),
        start_time: eventData.startTime,
        end_date: formatDate(eventData.endDate),
        end_time: eventData.endTime,
        location: eventData.location || '',
        description: eventData.description || '',
        selected_styles: eventData.selectedStyles || [],
        subscription_plan: eventData.subscriptionPlan || 'No Plan',
        subscription_id: subscription?.id || null,
        status: 'active',
        images_generated: 0, // NEW: Initialize images_generated field
        metadata: {
          transformsUsedAtCreation: transformsUsedDisplay,
          transformsIncludedAtCreation: transformsIncluded,
          email: user.email,
          userName: userProfile?.username || userProfile?.full_name || 'Unknown',
          creditsUsed: 0,
          photosGenerated: 0
        }
      };

      console.log('Event to save:', eventToSave);
      
      const { data, error } = await supabase
        .from('events')
        .insert([eventToSave])
        .select('*')
        .single();

      if (error) {
        console.error('Error saving event:', error);
        console.error('Event data that failed:', eventToSave);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INTERNET_DISCONNECTED')) {
          throw new Error('Network connection error. Please check your internet connection and try again.');
        }
        throw error;
      }

      console.log('Event saved successfully:', data);

      // Update events list immediately with the new event
      setEvents(prev => [data, ...prev]);

      // Update totals
      setTotalAggregatedCreditsUsed(prev => prev + (data.metadata?.creditsUsed || 0));
      setTotalImagesGenerated(prev => prev + (data.images_generated || 0));

      return data;
    } catch (error) {
      console.error('Failed to save event to database:', error);
      throw error;
    }
  };

  const updateEventWithLicense = async (eventId, licenseKey) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          license_key: licenseKey,
          license_generated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating license key:', error);
        throw error;
      }

      console.log('Event updated with license key:', data);

      setEvents(prev => prev.map(event =>
        event.id === eventId ? data : event
      ));

      return data;
    } catch (error) {
      console.error('Failed to update event with license:', error);
      throw error;
    }
  };

  const handleBackToEdit = () => setStep('form');
  const handleBackToStyles = () => setStep('styles');

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) navigate('/');
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

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleDownloadLicense = async (eventId) => {
    try {
      setIsDownloading(true);
      setDownloadingEvent(eventId);

      const { data: eventDetails, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (!eventDetails.license_key) {
        alert("This event doesn't have a license key yet.");
        return;
      }

      const content = `
  ${eventDetails.license_key}
  `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const filename = `License_${eventDetails.event_name.replace(/[^a-zA-Z0-9]/g, '_')}_${eventDetails.start_date}.txt`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('License downloaded successfully');

    } catch (error) {
      console.error('Error downloading license:', error);
      alert('Failed to download license. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadingEvent(null);
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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
 <img
                src="/assets/images/logo.png"
                alt="Photobooth AI Logo"
                className="w-full h-full object-contain"
              />              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Photobooth AI</h1>
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
            Here's what's happening with your AI photobooth today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Existing Images Generated card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Sparkles" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{totalImagesGenerated}</span>
              <span className="text-slate-400 text-sm ml-2">total</span>
            </div>
            <p className="text-slate-400 text-sm">Images Generated</p>
            {subscriptionCount > 1 && (
              <p className="text-xs text-violet-400 mt-1">
                {subscriptionCount} active subscriptions
              </p>
            )}
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
                          {/* Display creditsUsed for each event */}
                          {event.metadata?.creditsUsed > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-violet-300">{event.metadata.creditsUsed} credits used</span>
                            </>
                          )}
                          {/* NEW: Display images generated for each event */}
                          {(event.images_generated > 0 || event.metadata?.photosGenerated > 0) && (
                            <>
                              <span>•</span>
                              <span className="text-green-300">
                                {event.images_generated || event.metadata?.photosGenerated || 0} images generated
                              </span>
                            </>
                          )}
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
                  <span className="text-violet-300 font-medium">
                    {planName}
                    {subscriptionCount > 1 && (
                      <span className="text-xs text-violet-400 ml-2">
                        (×{subscriptionCount})
                      </span>
                    )}
                  </span>
                  <Icon name="Crown" size={20} className="text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{transformsRemaining < 0 ? 0 : transformsRemaining}</div>
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
        {step === 'license' && createdEvent && savedEventId && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
              <button className="absolute top-4 right-4 text-white" onClick={() => setStep(null)}>
                <Icon name="X" size={20} />
              </button>
              <LicenseDownload
                eventData={createdEvent}
                eventId={savedEventId}
                selectedStyles={createdEvent.selectedStyles}
                onClose={() => setStep(null)}
                onNewEvent={() => {
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
                  setSavedEventId(null);
                  setErrors({});
                  setStep('form');
                }}
                onSave={async (finalData) => {
                  // Update the event with the license key
                  await updateEventWithLicense(savedEventId, finalData.licenseKey);

                  // Subscription management data is no longer needed
                  // The subscriptions table already tracks all necessary data
                  console.log('Event created successfully with ID:', savedEventId);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;