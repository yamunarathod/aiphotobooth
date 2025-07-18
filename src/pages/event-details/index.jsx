import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import Button from '../../components/ui/Button';
import { CalendarIcon, InfoIcon, PaletteIcon, KeyIcon, AlertCircleIcon, CheckCircleIcon, DownloadIcon, ArrowLeftIcon, BarChart3Icon, ImageIcon, Archive, EyeIcon, Grid3X3 } from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // State to hold statistics from the events table
  const [eventStats, setEventStats] = useState({
    photosGenerated: 0,
    creditsUsed: 0
  });
  const [overallCredits, setOverallCredits] = useState({ remaining: 0 });

  useEffect(() => {
    if (!user?.id || !eventId) {
      setError('Invalid access');
      setLoading(false);
      return;
    }

    fetchEventDetails();
    fetchEventImages();
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

      // Fetch images generated from the database field
      const photosGeneratedForEvent = eventData.images_generated || 0;

      // Get credits used from metadata (fallback to 0 if not available)
      const creditsUsedForEvent = eventData.metadata?.creditsUsed || 0;

      setEventStats({
        photosGenerated: photosGeneratedForEvent,
        creditsUsed: creditsUsedForEvent
      });

      // Calculate overall credits remaining
      const totalCreditsInPlan = eventData?.metadata?.transformsIncludedAtCreation || 0;
      const creditsRemaining = totalCreditsInPlan - creditsUsedForEvent;

      setOverallCredits({
        remaining: creditsRemaining < 0 ? 0 : creditsRemaining
      });

    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventImages = async () => {
    try {
      setImagesLoading(true);

      // Fetch from event_output_images table using eventId field
      const { data: imagesData, error: imagesError } = await supabase
        .from('event_output_images')
        .select('*')
        .eq('eventId', eventId)
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;

      console.log('Fetched images data:', imagesData);

      // Parse the output field to extract image URLs
      const imageUrls = [];
      imagesData.forEach(record => {
        if (record.output) {
          // Check if output is already a URL string (not JSON)
          if (typeof record.output === 'string' && (record.output.startsWith('http') || record.output.startsWith('https'))) {
            imageUrls.push({
              id: record.id,
              recordId: record.id,
              url: record.output,
              created_at: record.created_at,
              name: record.name,
              email: record.email,
              gender: record.gender
            });
          } else {
            // Try to parse as JSON only if it looks like JSON
            try {
              const outputData = typeof record.output === 'string' ? JSON.parse(record.output) : record.output;

              // Handle different possible structures of the output field
              if (Array.isArray(outputData)) {
                outputData.forEach((url, index) => {
                  if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
                    imageUrls.push({
                      id: `${record.id}-${index}`,
                      recordId: record.id,
                      url: url,
                      created_at: record.created_at,
                      name: record.name,
                      email: record.email,
                      gender: record.gender
                    });
                  }
                });
              } else if (typeof outputData === 'object' && outputData !== null) {
                Object.entries(outputData).forEach(([key, value]) => {
                  if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('https'))) {
                    imageUrls.push({
                      id: `${record.id}-${key}`,
                      recordId: record.id,
                      url: value,
                      created_at: record.created_at,
                      name: record.name,
                      email: record.email,
                      gender: record.gender,
                      key: key
                    });
                  } else if (Array.isArray(value)) {
                    value.forEach((url, urlIndex) => {
                      if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
                        imageUrls.push({
                          id: `${record.id}-${key}-${urlIndex}`,
                          recordId: record.id,
                          url: url,
                          created_at: record.created_at,
                          name: record.name,
                          email: record.email,
                          gender: record.gender,
                          key: key
                        });
                      }
                    });
                  }
                });
              } else if (typeof outputData === 'string' && (outputData.startsWith('http') || outputData.startsWith('https'))) {
                imageUrls.push({
                  id: record.id,
                  recordId: record.id,
                  url: outputData,
                  created_at: record.created_at,
                  name: record.name,
                  email: record.email,
                  gender: record.gender
                });
              }
            } catch (parseError) {
              console.error('Error parsing output field:', parseError);
              // Skip this record if we can't parse it
            }
          }
        }
      });

      console.log('Processed image URLs:', imageUrls);
      setEventImages(imageUrls);

    } catch (err) {
      console.error('Error fetching event images:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleDownloadAllImages = async () => {
    if (eventImages.length === 0) {
      alert('No images available to download');
      return;
    }

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      let successCount = 0;

      for (let i = 0; i < eventImages.length; i++) {
        const image = eventImages[i];
        try {
          const response = await fetch(image.url);
          if (response.ok) {
            const blob = await response.blob();
            const fileExtension = image.url.split('.').pop()?.split('?')[0] || 'jpg';
            const filename = `image_${i + 1}_${image.recordId}.${fileExtension}`;
            zip.file(filename, blob);
            successCount++;
          }
        } catch (error) {
          console.error(`Failed to download image ${i + 1}:`, error);
        }
      }

      if (successCount === 0) {
        alert('Failed to download any images. Please check the image URLs.');
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventDetails.event_name.replace(/[^a-zA-Z0-9]/g, '_')}_images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`Successfully downloaded ${successCount} out of ${eventImages.length} images.`);

    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to download images. Please try again.');
    }
  };

  const handleViewGallery = () => {
    navigate(`/event/${eventId}/gallery`);
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

                <div>
                  <label className="text-sm text-slate-400">License Status</label>
                  <p className="text-white font-medium">
                    {eventDetails.is_license_activated ? 'Activated' : 'Not Activated'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Created</label>
                  <p className="text-white font-medium">
                    {eventDetails.created_at
                      ? new Date(eventDetails.created_at).toLocaleString('en-IN')
                      : 'N/A'}
                  </p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Generated At</label>
                      <p className="text-white font-medium">
                        {eventDetails.license_generated_at
                          ? new Date(eventDetails.license_generated_at).toLocaleString('en-IN')
                          : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-400">Activation Status</label>
                      <p className={`font-medium ${eventDetails.is_license_activated ? 'text-green-400' : 'text-yellow-400'}`}>
                        {eventDetails.is_license_activated ? 'Activated' : 'Not Activated'}
                      </p>
                    </div>
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
                  <p className="text-2xl font-bold text-white">
                    {eventImages.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Images Preview */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ImageIcon size={20} className="mr-2 text-violet-400" />
                Generated Images
              </h3>

              {imagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-500"></div>
                  <span className="ml-3 text-slate-400 text-sm">Loading...</span>
                </div>
              ) : eventImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Preview Grid - Show first 4 images */}
                  <div className="grid grid-cols-2 gap-2">
                    {eventImages.slice(0, 4).map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-slate-600"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0OTZBOCIgZm9udC1zaXplPSIxMiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                          }}
                        />
                        {eventImages.length > 4 && index === 3 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              +{eventImages.length - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleViewGallery}
                      variant="outline"
                      size="sm"
                      className="w-full border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
                    >
                      <Grid3X3 className="mr-2 h-4 w-4" />
                      View Gallery ({eventImages.length})
                    </Button>
                    
                    <Button
                      onClick={handleDownloadAllImages}
                      variant="outline"
                      size="sm"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Download All as ZIP
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <ImageIcon size={32} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No images generated yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;