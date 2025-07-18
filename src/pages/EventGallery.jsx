import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, DownloadIcon, Archive, ImageIcon, EyeIcon, XIcon } from 'lucide-react';

const EventGallery = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

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
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('event_name')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single();

      if (eventError) throw eventError;
      setEventDetails(eventData);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details');
    }
  };

  const fetchEventImages = async () => {
    try {
      setLoading(true);

      const { data: imagesData, error: imagesError } = await supabase
        .from('event_output_images')
        .select('*')
        .eq('eventId', eventId)
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;

      const imageUrls = [];
      imagesData.forEach(record => {
        if (record.output) {
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
            try {
              const outputData = typeof record.output === 'string' ? JSON.parse(record.output) : record.output;

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
                  }
                });
              }
            } catch (parseError) {
              console.error('Error parsing output field:', parseError);
            }
          }
        }
      });

      setEventImages(imageUrls);
    } catch (err) {
      console.error('Error fetching event images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
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
      a.download = `${eventDetails?.event_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'event'}_images.zip`;
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

  const handleDownloadSingleImage = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileExtension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
        a.download = `${imageName || 'image'}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSelectedImage(null);
    }
    if (selectedImage) {
      const currentIndex = eventImages.findIndex(img => img.id === selectedImage.id);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedImage(eventImages[currentIndex - 1]);
      }
      if (e.key === 'ArrowRight' && currentIndex < eventImages.length - 1) {
        setSelectedImage(eventImages[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, eventImages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <ImageIcon size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Gallery</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => navigate(`/event/${eventId}`)}>
            Back to Event Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-[#0f0f23]/90 backdrop-blur-sm z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(`/event/${eventId}`)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Event Details
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Image Gallery</h1>
                <p className="text-sm text-slate-400">
                  {eventDetails?.event_name} • {eventImages.length} images
                </p>
              </div>
            </div>
            
            {eventImages.length > 0 && (
              <Button
                onClick={handleDownloadAllImages}
                variant="outline"
                size="sm"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
              >
                <Archive className="mr-2 h-4 w-4" />
                Download All ({eventImages.length})
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {eventImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {eventImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-slate-600 group-hover:border-violet-400 transition-colors"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ5NkE4IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all">
                  <EyeIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
                {image.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg">
                    {image.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ImageIcon size={64} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Images Found</h2>
            <p className="text-slate-400">No images have been generated for this event yet.</p>
          </div>
        )}
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
            >
              <XIcon size={24} />
            </button>
            
            <img
              src={selectedImage.url}
              alt="Selected image"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ5NkE4IiBmb250LXNpemU9IjE4Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
              }}
            />
            
            {/* Image Info and Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  {selectedImage.name && (
                    <h3 className="font-semibold text-lg">{selectedImage.name}</h3>
                  )}
                  {selectedImage.email && (
                    <p className="text-sm text-slate-300">{selectedImage.email}</p>
                  )}
                  {selectedImage.gender && (
                    <p className="text-sm text-slate-400">Gender: {selectedImage.gender}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Created: {new Date(selectedImage.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleDownloadSingleImage(selectedImage.url, selectedImage.name || `image_${selectedImage.recordId}`)}
                    variant="outline"
                    size="sm"
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <Button
                  onClick={() => {
                    const currentIndex = eventImages.findIndex(img => img.id === selectedImage.id);
                    if (currentIndex > 0) {
                      setSelectedImage(eventImages[currentIndex - 1]);
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={eventImages.findIndex(img => img.id === selectedImage.id) === 0}
                  className="text-white hover:text-violet-400"
                >
                  ← Previous
                </Button>
                
                <span className="text-sm text-slate-400">
                  {eventImages.findIndex(img => img.id === selectedImage.id) + 1} of {eventImages.length}
                </span>
                
                <Button
                  onClick={() => {
                    const currentIndex = eventImages.findIndex(img => img.id === selectedImage.id);
                    if (currentIndex < eventImages.length - 1) {
                      setSelectedImage(eventImages[currentIndex + 1]);
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={eventImages.findIndex(img => img.id === selectedImage.id) === eventImages.length - 1}
                  className="text-white hover:text-violet-400"
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGallery;