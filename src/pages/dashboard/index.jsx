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
<<<<<<< HEAD
// import { supabase2 } from '../../utils/supabase2'; // REMOVED: No longer needed
=======
>>>>>>> abraham

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
<<<<<<< HEAD
  const [totalAggregatedCreditsUsed, setTotalAggregatedCreditsUsed] = useState(0); // State for total credits used across all events
=======
  const [totalAggregatedCreditsUsed, setTotalAggregatedCreditsUsed] = useState(0);
  const [totalImagesGenerated, setTotalImagesGenerated] = useState(0); // NEW: State for total images generated
>>>>>>> abraham

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
<<<<<<< HEAD
  const [savedEventId, setSavedEventId] = useState(null); // New state to store the saved event ID
=======
  const [savedEventId, setSavedEventId] = useState(null);
>>>>>>> abraham

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
<<<<<<< HEAD
        .select('*, creditsUsed, photosGenerated') // Ensure creditsUsed and photosGenerated are selected
=======
        .select('*')
>>>>>>> abraham
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

<<<<<<< HEAD
  // REMOVED: syncCreditsForEvent is no longer needed as data is assumed to be in the main events table.
  // const syncCreditsForEvent = async (eventId) => { ... };

=======
>>>>>>> abraham
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
<<<<<<< HEAD
            const planName = sub.metadata?.planName || 'Unknown';
=======
            const planName = sub.plan_name || 'Unknown';
>>>>>>> abraham
            if (!acc[planName]) {
              acc[planName] = {
                transformsIncluded: 0,
                transformsUsed: 0,
                count: 0,
                latestSubscription: sub
              };
            }
<<<<<<< HEAD
            acc[planName].transformsIncluded += sub.metadata?.transformsIncluded || 0;
            acc[planName].transformsUsed += sub.metadata?.transformsUsed || 0;
            acc[planName].count += 1;
=======
            
            // Handle transforms_included which can be 'unlimited' or a number string
            const transformsIncluded = sub.transforms_included === 'unlimited' 
              ? Number.MAX_SAFE_INTEGER 
              : parseInt(sub.transforms_included) || 0;
            
            acc[planName].transformsIncluded += transformsIncluded;
            acc[planName].transformsUsed += sub.transforms_used || 0;
            acc[planName].count += 1;
            
>>>>>>> abraham
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
<<<<<<< HEAD
              planName: mostRecentPlan.latestSubscription.metadata?.planName || 'Unknown',
              transformsIncluded: mostRecentPlan.transformsIncluded,
              transformsUsed: mostRecentPlan.transformsUsed,
              subscriptionCount: mostRecentPlan.count
=======
              planName: mostRecentPlan.latestSubscription.plan_name || 'Unknown',
              transformsIncluded: mostRecentPlan.latestSubscription.transforms_included === 'unlimited' 
                ? 'unlimited' 
                : mostRecentPlan.transformsIncluded,
              transformsUsed: mostRecentPlan.transformsUsed,
              subscriptionCount: mostRecentPlan.count,
              billingCycle: mostRecentPlan.latestSubscription.billing_cycle,
              nextBillingDate: mostRecentPlan.latestSubscription.next_billing_date
>>>>>>> abraham
            },
            allSubscriptions: subscriptions,
            planTotals: planTotals
          };
          console.log('Processed subscription data:', processedSubscription);
          console.log('Plan totals:', planTotals);
        }
        setSubscription(processedSubscription);

<<<<<<< HEAD
        // Fetch user's events from main database, which now includes 'creditsUsed' and 'photosGenerated'
        const eventsData = await fetchEventsFromDatabase();
        setEvents(eventsData);

        // Calculate initial total aggregated credits from fetched events
        // Now directly sum 'creditsUsed' from the events table
        const totalCreditsFromEvents = eventsData.reduce((sum, event) => sum + (event.creditsUsed || 0), 0);
        setTotalAggregatedCreditsUsed(totalCreditsFromEvents);

=======
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

>>>>>>> abraham
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSubscription(noSubscription);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

<<<<<<< HEAD
    // REMOVED: Real-time listener for supabase2 inputimagetable
    // This is no longer needed as we're not syncing from supabase2
    /*
    const supabase2Channel = supabase2
      .channel('input_image_table_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inputimagetable'
        },
        async (payload) => {
          console.log('Change received in supabase2 inputimagetable:', payload);
          const eventId = payload.new?.eventId;
          if (eventId) {
            // Trigger synchronization for the affected event
            await syncCreditsForEvent(eventId);
          }
        }
      )
      .subscribe();
    */

    // Real-time listener for the 'events' table in the main Supabase client
    // This will now handle updates to 'creditsUsed' and 'photosGenerated' directly
=======
    // Real-time listener for the 'events' table in the main Supabase client
>>>>>>> abraham
    const eventsChannel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
<<<<<<< HEAD
          event: 'UPDATE', // Listen for UPDATE events on events table
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}` // Only listen to changes for the current user
=======
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}`
>>>>>>> abraham
        },
        (payload) => {
          console.log('Change received in main supabase events table:', payload);
          const updatedEvent = payload.new;
          if (updatedEvent) {
            setEvents(prevEvents => {
              const newEvents = prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
              );
<<<<<<< HEAD
              // Recalculate total aggregated credits based on the updated events list
              const newTotalAggregated = newEvents.reduce((sum, event) => sum + (event.creditsUsed || 0), 0);
              setTotalAggregatedCreditsUsed(newTotalAggregated);
=======
              
              // Recalculate total aggregated credits
              const newTotalAggregated = newEvents.reduce((sum, event) => sum + (event.metadata?.creditsUsed || 0), 0);
              setTotalAggregatedCreditsUsed(newTotalAggregated);
              
              // NEW: Recalculate total images generated
              const newTotalImages = newEvents.reduce((sum, event) => {
                const imagesGenerated = event.images_generated || event.metadata?.photosGenerated || 0;
                return sum + imagesGenerated;
              }, 0);
              setTotalImagesGenerated(newTotalImages);
              
>>>>>>> abraham
              return newEvents;
            });
          }
        }
      )
      .subscribe();

<<<<<<< HEAD

    // Cleanup function for the supabase listener
    return () => {
      // supabase2.removeChannel(supabase2Channel); // REMOVED
      supabase.removeChannel(eventsChannel); // Clean up the new events channel
    };

  }, [user]); // Depend on user to re-run when user changes
=======
    // Cleanup function
    return () => {
      supabase.removeChannel(eventsChannel);
    };

  }, [user]);
>>>>>>> abraham

  // Derived values from subscription state
  const hasActiveSubscription = subscription && subscription.status === 'active';
  const planName = subscription?.metadata?.planName || 'No Plan';
<<<<<<< HEAD
  // Use totalAggregatedCreditsUsed for the display
  const transformsUsedDisplay = totalAggregatedCreditsUsed; // Now directly from aggregated events creditsUsed
  const transformsIncluded = subscription?.metadata?.transformsIncluded ?? 0;
  const transformsRemaining = transformsIncluded - transformsUsedDisplay; // Calculate remaining based on aggregated credits
=======
  const transformsUsedDisplay = totalAggregatedCreditsUsed;
  const transformsIncluded = subscription?.metadata?.transformsIncluded ?? 0;
  const transformsRemaining = transformsIncluded - transformsUsedDisplay;
>>>>>>> abraham
  const subscriptionCount = subscription?.metadata?.subscriptionCount || 0;

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

<<<<<<< HEAD
  // Handlers (rest of handlers remain the same)
=======
  // Handlers (keeping existing handlers)
>>>>>>> abraham
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
<<<<<<< HEAD
      alert('Failed to save event. Please try again.');
    }
  };
  const saveEventToDatabase = async (eventData) => {
    console.log('Saving event to database:', eventData);
    try {
      const eventToSave = {
        user_id: user.id,
        event_name: eventData.eventName,
        start_date: eventData.startDate,
        start_time: eventData.startTime,
        end_date: eventData.endDate,
=======
      
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
>>>>>>> abraham
        end_time: eventData.endTime,
        location: eventData.location || '',
        description: eventData.description || '',
        selected_styles: eventData.selectedStyles || [],
        subscription_plan: eventData.subscriptionPlan || 'No Plan',
        subscription_id: subscription?.id || null,
        status: 'active',
<<<<<<< HEAD
        creditsUsed: 0, // Initialize creditsUsed to 0 when creating a new event
        photosGenerated: 0, // Initialize photosGenerated to 0 when creating a new event
=======
        images_generated: 0, // NEW: Initialize images_generated field
>>>>>>> abraham
        metadata: {
          transformsUsedAtCreation: transformsUsedDisplay,
          transformsIncludedAtCreation: transformsIncluded,
          email: user.email,
<<<<<<< HEAD
          userName: userProfile?.username || userProfile?.full_name || 'Unknown'
        }
      };

=======
          userName: userProfile?.username || userProfile?.full_name || 'Unknown',
          creditsUsed: 0,
          photosGenerated: 0
        }
      };

      console.log('Event to save:', eventToSave);
      
>>>>>>> abraham
      const { data, error } = await supabase
        .from('events')
        .insert([eventToSave])
        .select('*')
        .single();

      if (error) {
        console.error('Error saving event:', error);
<<<<<<< HEAD
=======
        console.error('Event data that failed:', eventToSave);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INTERNET_DISCONNECTED')) {
          throw new Error('Network connection error. Please check your internet connection and try again.');
        }
>>>>>>> abraham
        throw error;
      }

      console.log('Event saved successfully:', data);

      // Update events list immediately with the new event
      setEvents(prev => [data, ...prev]);

<<<<<<< HEAD
      // Update total aggregated credits with the newly initialized creditsUsed
      setTotalAggregatedCreditsUsed(prev => prev + (data.creditsUsed || 0));
=======
      // Update totals
      setTotalAggregatedCreditsUsed(prev => prev + (data.metadata?.creditsUsed || 0));
      setTotalImagesGenerated(prev => prev + (data.images_generated || 0));
>>>>>>> abraham

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

<<<<<<< HEAD
  const saveSubscriptionManagementData = async (eventId, userId, eventName) => {
    try {
      const { data: existingEntry, error: fetchError } = await supabase
        .from('subscriptionmanagement')
        .select('*')
        .eq('userId', userId)
        .single();

      let updatedListOfEvents = [];
      if (existingEntry) {
        updatedListOfEvents = existingEntry.list_of_events || [];
        if (!updatedListOfEvents.some(event => event.id === eventId)) {
          updatedListOfEvents.push({ id: eventId, name: eventName });
        }
      } else {
        updatedListOfEvents.push({ id: eventId, name: eventName });
      }

      const { data, error } = await supabase
        .from('subscriptionmanagement')
        .upsert(
          {
            userId: userId,
            eventId: eventId,
            list_of_events: updatedListOfEvents,
            credits_left: existingEntry ? existingEntry.credits_left : transformsIncluded
          },
          {
            onConflict: 'userId',
            ignoreDuplicates: false
          }
        )
        .select()
        .single();

      if (error) throw error;
      console.log('Subscription management data saved/updated:', data);
    } catch (err) {
      console.error('Error saving subscription management data:', err);
    }
  };

=======
>>>>>>> abraham
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
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <div>
<<<<<<< HEAD
                <h1 className="text-xl font-bold text-white"> Photobooth AI</h1>
=======
                <h1 className="text-xl font-bold text-white">Photobooth AI</h1>
>>>>>>> abraham
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
<<<<<<< HEAD
=======
          {/* Existing Images Generated card */}
>>>>>>> abraham
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Sparkles" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
<<<<<<< HEAD
              {/* Use transformsUsedDisplay here */}
              <span className="text-2xl font-bold text-white">{transformsUsedDisplay}</span>
              <span className="text-slate-400 text-sm ml-2">/ {transformsIncluded}</span>
            </div>
            <p className="text-slate-400 text-sm">Transformations Used</p>
=======
              <span className="text-2xl font-bold text-white">{totalImagesGenerated}</span>
              <span className="text-slate-400 text-sm ml-2">total</span>
            </div>
            <p className="text-slate-400 text-sm">Images Generated</p>
>>>>>>> abraham
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
<<<<<<< HEAD
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Users" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              {/* This should probably be derived from `photosGenerated` across all events */}
              <span className="text-2xl font-bold text-white">
                {events.reduce((sum, event) => sum + (event.photosGenerated || 0), 0)}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Photos Generated</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-500/20 rounded-lg p-3">
                <Icon name="Download" size={24} className="text-violet-400" />
              </div>
            </div>
            <div className="mb-2">
              {/* This likely needs a dedicated field in 'events' or a separate table for downloads */}
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <p className="text-slate-400 text-sm">Photos Downloaded</p>
          </div>
=======
>>>>>>> abraham
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
<<<<<<< HEAD
                          {event.creditsUsed > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-violet-300">{event.creditsUsed} credits used</span>
                            </>
                          )}
                          {event.photosGenerated > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-violet-300">{event.photosGenerated} photos generated</span>
=======
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
>>>>>>> abraham
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
<<<<<<< HEAD

=======
>>>>>>> abraham
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

<<<<<<< HEAD
                  // Save subscription management data
                  await saveSubscriptionManagementData(savedEventId, user.id, finalData.eventName);
=======
                  // Subscription management data is no longer needed
                  // The subscriptions table already tracks all necessary data
                  console.log('Event created successfully with ID:', savedEventId);
>>>>>>> abraham
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