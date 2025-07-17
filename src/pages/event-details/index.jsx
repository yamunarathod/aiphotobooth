import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
// import { supabase2 } from '../../utils/supabase2'; // Remove this import
import Button from '../../components/ui/Button';
import { CalendarIcon, InfoIcon, PaletteIcon, KeyIcon, AlertCircleIcon, CheckCircleIcon, DownloadIcon, ArrowLeftIcon, BarChart3Icon, SettingsIcon, FileTextIcon } from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [subscriptionManagement, setSubscriptionManagement] = useState(null);
  const [error, setError] = useState(null);
  
  // State to hold statistics, now sourced from 'events' table
  const [eventStats, setEventStats] = useState({ photosGenerated: 0, creditsUsed: 0 });
  const [overallCredits, setOverallCredits] = useState({ remaining: 0 });


  useEffect(() => {
    if (!user?.id || !eventId) {
      setError('Invalid access');
      setLoading(false);
      return;
    }

    fetchEventDetails();
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single();

      if (eventError) throw eventError;
      setEventDetails(eventData);

      // --- Per-Event Stat Calculation (now from metadata) ---
      const photosGeneratedForEvent = eventData.metadata?.photosGenerated || 0;
      const creditsUsedForEvent = eventData.metadata?.creditsUsed || 0; 
      setEventStats({ photosGenerated: photosGeneratedForEvent, creditsUsed: creditsUsedForEvent });

      // --- Overall Credits Remaining Calculation ---
      const totalCreditsInPlan = eventData?.metadata?.transformsIncludedAtCreation || 0;

      // Assuming 'totalCreditsUsedByUser' might also be a field on the user or event,
      // or needs to be calculated differently if it's overall across events.
      // For now, if it's per-event, you can use creditsUsedForEvent.
      // If it's truly *overall* for the user, you'd need a separate mechanism
      // to aggregate that or have it stored on the user's profile in Supabase.
      // For this refactor, let's assume 'creditsUsedForEvent' is what you meant for "overall credits used by user in this context"
      // If totalUserImageCount was previously aggregating across all events, this will need re-thinking how 'overallCredits.remaining' is calculated.
      // For simplicity, I'm adjusting it to use event-specific credits used for the remaining calculation.
      // If you need overall user credits across *all* events, that data needs to be accessible in 'events' table or 'user' profile in supabase.
      const creditsRemaining = totalCreditsInPlan - creditsUsedForEvent;
      
      setOverallCredits({ remaining: creditsRemaining < 0 ? 0 : creditsRemaining });
      
    } catch (err) {
      console.error('Err fetching event details:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadLicense = async () => {
    if (!eventDetails?.license_key) {
      alert("This event doesn't have a license key yet.");
      return;
    }

    try {
      const content = `
 Photobooth License File

Event: ${eventDetails.event_name}
Date: ${eventDetails.start_date} to ${eventDetails.end_date}
Styles: ${(eventDetails.selected_styles || []).join(', ')}

--- LICENSE KEY BEGIN ---
${eventDetails.license_key}
--- LICENSE KEY END ---

Generated on: ${new Date(eventDetails.license_generated_at).toLocaleString()}
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

    } catch (error) {
      console.error('Error downloading license:', error);
      alert('Failed to download license. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400 mb-4">{error || 'The requested event could not be found.'}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'Not specified';
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CalendarIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Event Details</h1>
                <p className="text-sm text-slate-400">{eventDetails.event_name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <InfoIcon size={20} className="mr-2 text-violet-400" />
                Event Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-400">Event Name</label>
                  <p className="text-white font-medium">{eventDetails.event_name}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Subscription Plan</label>
                  <p className="text-white font-medium">{eventDetails.subscription_plan || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Start Date & Time</label>
                  <p className="text-white font-medium">
                    {formatDateTime(eventDetails.start_date, eventDetails.start_time)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">End Date & Time</label>
                  <p className="text-white font-medium">
                    {formatDateTime(eventDetails.end_date, eventDetails.end_time)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Location</label>
                  <p className="text-white font-medium">{eventDetails.location || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <p className="text-white font-medium capitalize">{eventDetails.status || 'Active'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-400">Description</label>
                  <p className="text-white font-medium">{eventDetails.description || 'No description provided'}</p>
                </div>
              </div>
            </div>

            {/* Selected Styles */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <PaletteIcon size={20} className="mr-2 text-violet-400" />
                Selected AI Styles
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(eventDetails.selected_styles || []).map((style, index) => (
                  <div
                    key={index}
                    className="bg-violet-500/20 border border-violet-500/30 rounded-lg p-3 text-center"
                  >
                    <span className="text-violet-300 font-medium">{style}</span>
                  </div>
                ))}
              </div>
              
              {(!eventDetails.selected_styles || eventDetails.selected_styles.length === 0) && (
                <p className="text-slate-400 text-center py-4">No styles selected</p>
              )}
            </div>

            {/* License Information */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <KeyIcon size={20} className="mr-2 text-violet-400" />
                License Information
              </h3>
              
              {eventDetails.license_key ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold flex items-center">
                      <CheckCircleIcon size={16} className="mr-2" />
                      License Generated
                    </span>
                    <Button
                      onClick={handleDownloadLicense}
                      variant="outline"
                      size="sm"
                      className="border-violet-400 text-violet-400"
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download License
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400">Generated At</label>
                    <p className="text-white font-medium">
                      {eventDetails.license_generated_at 
                        ? new Date(eventDetails.license_generated_at).toLocaleString() 
                        : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400">License Key (Preview)</label>
                    <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-400 break-all">
                      {eventDetails.license_key.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircleIcon size={24} className="text-yellow-500 mx-auto mb-2" />
                  <p className="text-slate-400">No license key generated for this event</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Statistics */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3Icon size={20} className="mr-2 text-violet-400" />
                Event Statistics
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Images Generated</label>
                  {/* Displaying photos generated from eventStats state (now from events table) */}
                  <p className="text-2xl font-bold text-white">
                    {eventStats.photosGenerated}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Credits Used</label>
                  {/* Displaying credits used from eventStats state (now from events table) */}
                  <p className="text-2xl font-bold text-white">
                    {eventStats.creditsUsed}
                  </p>
                </div>
                
                {/* <div>
                  <label className="text-sm text-slate-400">Credits Remaining</label>
                
                  <p className="text-2xl font-bold text-white">
                    {overallCredits.remaining}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Subscription Management Details (Retain if still needed, but likely dependent on previous supabase2 logic) */}
            {subscriptionManagement && (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <SettingsIcon size={20} className="mr-2 text-violet-400" />
                  Management Details
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-slate-400">User ID</label>
                    <p className="text-white font-mono">{subscriptionManagement.userId}</p>
                  </div>
                  
                  <div>
                    <label className="text-slate-400">Last Updated</label>
                    <p className="text-white">
                      {subscriptionManagement.updated_at 
                        ? new Date(subscriptionManagement.updated_at).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Event Metadata */}
            {eventDetails.metadata && (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileTextIcon size={20} className="mr-2 text-violet-400" />
                  Event Metadata
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-slate-400">Created By</label>
                    <p className="text-white">{eventDetails.metadata.userName || 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <label className="text-slate-400">Email</label>
                    <p className="text-white">{eventDetails.metadata.userEmail || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-slate-400">Transforms at Creation</label>
                    <p className="text-white">
                      {eventDetails.metadata.transformsUsedAtCreation} / {eventDetails.metadata.transformsIncludedAtCreation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;