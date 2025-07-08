import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LiveDemo = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('ghibli');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uuid, setUuid] = useState('');
  const [trialsLeft, setTrialsLeft] = useState(null); // null while loading, number when loaded
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const fileInputRef = useRef(null);
  const { user: currentUser, loading: authLoading } = useAuth();

  const styles = [
    { id: 'ghibli', name: 'Ghibli', color: 'emerald' },
    { id: 'pixar', name: 'Pixar', color: 'blue' },
    { id: 'snoopy', name: 'Snoopy', color: 'yellow' },
    { id: 'package', name: 'Package', color: 'rose' }
  ];

  const sampleImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  ];

  const processedSamples = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop"
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed (JPG, PNG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File size exceeds 10MB limit');
      return;
    }

    const newUuid = uuidv4();
    setUuid(newUuid);
    const reader = new FileReader();

    reader.onload = async (e) => {
      // Validate image dimensions
      const img = new window.Image();
      img.src = e.target.result.toString();

      await new Promise((resolve) => {
        img.onload = () => {
          if (img.naturalWidth > 4096 || img.naturalHeight > 4096) {
            setUploadError('Maximum image dimensions are 4096x4096 pixels');
            resolve();
            return;
          }
          resolve();
        };
      });

      if (uploadError) return;

      console.log('Attempting Supabase upload:');
      console.log('File type:', file.type);
      console.log('File size:', file.size, 'bytes');

      try {
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('inputimages')
          .upload(`${newUuid}`, file, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('inputimages')
          .getPublicUrl(`${newUuid}`);

        // Insert record to inputimagetable
        const { error: dbError } = await supabase
          .from('inputimagetable')
          .insert([{
            unique_id: newUuid,
            image_url: urlData.publicUrl
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
          return;
        }

        setUploadedImage(e.target.result);
        setProcessedImage(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload image. Please try again.');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSampleSelect = async (imageUrl) => {
    const newUuid = uuidv4();
    setUuid(newUuid);

    try {
      // Insert record to inputimagetable with the sample image URL
      const { error: dbError } = await supabase
        .from('inputimagetable')
        .insert([{
          unique_id: newUuid,
          image_url: imageUrl
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        return;
      }

      setUploadedImage(imageUrl);
      setProcessedImage(null);
    } catch (error) {
      console.error('Error processing sample image:', error);
    }
  };
  useEffect(() => {
    const fetchTrialCount = async () => {
      if (!authLoading && currentUser?.id) {
        try {
          const { data, error } = await supabase
            .from('user_trials')
            .select('trials_left')
            .eq('user_id', currentUser.id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') { // This specific code means 'no rows found'
              console.log('No user_trials record found for this user (PGRST116). Initializing trials.');
              // This is the point where you would *create* the initial trials
              // if your database trigger for new users is NOT set up or failed.
              // However, the best practice is a DB trigger.
              setTrialsLeft(3); // Assuming 3 is your default initial trials
              // This is crucial if the DB trigger isn't consistently working.
            } else {
              console.error('Error checking trial usage:', error);
              setTrialsLeft(0); // Assume no trials on other errors
            }
            return;
          }

          if (data) {
            setTrialsLeft(data.trials_left);
          } else {
            // This 'else' block should ideally not be reached if error handling is robust,
            // as 'data' would be null only if an error occurred.
            // But as a fallback, ensure trials are set to 0.
            setTrialsLeft(0);
          }
        } catch (error) {
          // Catch any unexpected client-side errors during the fetch
          console.error('Unexpected error fetching trial status:', error);
          setTrialsLeft(0);
        }
      } else if (!authLoading && !currentUser?.id) {
        // User is not logged in.
        // Set trialsLeft to 0 for unauthenticated users, or to a default if you allow guest trials.
        setTrialsLeft(0); // Unauthenticated users typically have 0 trials by default
      }
    };

    fetchTrialCount();
  }, [currentUser, authLoading]); // Ensure dependencies are correct


  const decrementTrialCount = async () => {
    console.log('Decrementing trial count...');
    console.log('--- Inside decrementTrialCount ---');
    console.log('currentUser object:', currentUser);
    console.log('currentUser?.id:', currentUser?.id);

    if (!currentUser || !currentUser.id) {
      console.error('No current user found or ID missing, cannot decrement trial count');
      return false;
    }

    try {
      console.log('Decrementing trial count for user:', currentUser.id);
      console.log('Current trials left before decrement:', trialsLeft);

      // Call the correct RPC function
       const { data: newCount, error: rpcError } = await supabase.rpc('generate_image_and_deduct_trial', {
        p_user_id: currentUser.id // <--- Change to the correct parameter name
    });

      console.log('RPC call completed:');
      console.log('- New count:', newCount);
      console.log('- RPC Error:', rpcError);

      if (rpcError) {
        console.error('Error decrementing trial count:', rpcError);
        return false;
      }

      if (newCount !== null && newCount !== undefined) {
        setTrialsLeft(newCount);
        console.log('Trial count updated locally to:', newCount);
        return true;
      } else {
        console.log('Trial count decrement returned null - user may be out of trials');
        setTrialsLeft(0);
        return true;
      }

    } catch (error) {
      console.error('Error in decrementTrialCount:', error);
      return false;
    }
  };
  const processImage = async () => {

    if (!uploadedImage) return;

    if (authLoading) { // <--- New check
      console.warn("Process Image: Authentication still loading. Please wait.");
      setIsProcessing(false);
      return;
    }
    // Crucial checks:
    if (!currentUser?.id) {
      console.error("Process Image: No active user. Please sign in.");
      setShowSubscribePrompt(true); // Or some other notification
      setIsProcessing(false); // Ensure processing state is reset
      return;
    }

    if (trialsLeft === null) { // Still loading trials
      console.warn("Process Image: Trial count still loading. Please wait.");
      setIsProcessing(false);
      return;
    }

    if (trialsLeft <= 0) {
      setShowSubscribePrompt(true); //
      return;
    }

    setIsProcessing(true); //
    setProgress(0); //
    setProcessedImage(null); //
    try {
      // Load workflow JSON
      const workflowResponse = await fetch(`/wfonline/${selectedStyle}online.json`);
      if (!workflowResponse.ok) {
        throw new Error(`Workflow JSON not found: ${workflowResponse.statusText}`);
      }
      const workflow = await workflowResponse.json();
      

      // Update node 283 with UUID
      workflow['283'].inputs.unique_id = uuid;
      console.log('Workflow prepared with UUID:', uuid);

      // Send to Runpod
      const runpodResponse = await fetch('https://api.runpod.ai/v2/tdme3jq4u7zg1s/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_RUNPOD_API_KEY}`
        },
        body: JSON.stringify({ input: { workflow } })
      });

      const result = await runpodResponse.json();
      const jobId = result.id;

      console.log('RunPod job started with ID:', jobId);

      // Poll for job completion
      const checkStatus = async () => {
        try {
          const statusResponse = await fetch(`https://api.runpod.ai/v2/tdme3jq4u7zg1s/status/${jobId}`, {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_RUNPOD_API_KEY}`
            }
          });
          const statusData = await statusResponse.json();

          console.log('Job status:', statusData.status);

          if (statusData.status === 'COMPLETED') {
            console.log('Job completed, fetching result from Supabase...');

            // Fetch output from Supabase
            const { data, error } = await supabase
              .from('inputimagetable')
              .select('output')
              .eq('unique_id', uuid)
              .single();

            if (!error && data && data.output) {
              console.log('Successfully fetched processed image from Supabase');
              setProcessedImage(data.output);

              // Decrement trial count ONLY after successful processing
              // Removed 'userid' argument here
              const decrementSuccess = await decrementTrialCount(); // <--- CHANGE HERE
              console.log('Decrement trial count result:', decrementSuccess);
              if (decrementSuccess) {
                console.log('Trial count successfully decremented');
              } else {
                console.warn('Failed to decrement trial count, but image was processed');
              }
            } else {
              console.error('Error fetching processed image:', error);
            }

            setIsProcessing(false);
            clearInterval(statusInterval);

          } else if (statusData.status === 'FAILED') {
            console.error('Processing failed:', statusData);
            setIsProcessing(false);
            clearInterval(statusInterval);
          } else {
            // Update progress based on status
            if (statusData.status === 'IN_PROGRESS') {
              setProgress(prev => Math.min(prev + 10, 90));
            } else if (statusData.status === 'IN_QUEUE') {
              setProgress(10);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
        }
      };

      const statusInterval = setInterval(checkStatus, 2000);

      // Initial check
      checkStatus();

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
    }
  };

  const downloadImage = async () => {
    if (processedImage) {
      try {
        const response = await fetch(processedImage, { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-transformed-${selectedStyle}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download error:', err);
        alert('Failed to download image.');
      }
    }
  };

  // Subscription Prompt Component
  const SubscriptionPrompt = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-violet-500/30 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Sparkles" size={32} color="white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {currentUser ? 'Trial Limit Reached' : 'Sign In to Continue'}
          </h3>
          <p className="text-slate-300">
            {currentUser
              ? 'You used your free trial transformation. Subscribe to unlock unlimited transformations!'
              : 'Create an account or sign in to get your free trial transformation.'}
          </p>
        </div>

        <div className="space-y-4">
          {currentUser ? (
            <Link to="/subscription">
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
                iconName="CreditCard"
                iconPosition="left"
              >
                View Subscription Plans
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-slate-600"
                  iconName="LogIn"
                  iconPosition="left"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}

          <button
            onClick={() => setShowSubscribePrompt(false)}
            className="w-full text-slate-400 hover:text-slate-300 text-sm mt-4"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );

  const hasNoTrials = trialsLeft !== null && trialsLeft <= 0;
  const isLoadingTrials = authLoading || (trialsLeft === null && !!currentUser);
  return (
    <>
      {showSubscribePrompt && <SubscriptionPrompt />}

      <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try It Live - Upload & Transform
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the magic firsthand. Upload your photo or choose from our samples
              and watch AI transform it in real-time.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-semibold text-white mb-6">Step 1: Choose Your Photo</h3>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-0 text-center mb-6 transition-colors cursor-pointer ${uploadError ?
                    'border-red-500 bg-red-900/20' :
                    'border-slate-600 hover:border-violet-500'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    minWidth: 220,
                    width: 220,
                    minHeight: 140,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {uploadedImage ? (
                    <div className="relative flex justify-center items-center w-full h-full">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded photo"
                        className="rounded-lg object-cover"
                        style={{
                          width: '120px',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                          setProcessedImage(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Icon name="X" size={16} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <Icon name="Upload" size={40} className="text-slate-400 mx-auto mb-2" />
                      <p className="text-base text-white mb-1">Click to upload your photo</p>
                      <p className="text-xs text-slate-400">JPG, PNG up to 10MB</p>
                      {uploadError && (
                        <div className="mt-2 p-2 bg-red-900/50 rounded-lg text-red-300 text-xs flex items-center">
                          <Icon name="AlertCircle" size={14} className="mr-2" />
                          {uploadError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Sample Images */}
                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-3">Or try with our sample photos:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {sampleImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleSelect(image)}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors"
                      >
                        <Image
                          src={image}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Step 2: Choose Style</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-lg border transition-all duration-300 ${selectedStyle === style.id
                          ? `border-${style.color}-500 bg-${style.color}-500/20 text-${style.color}-300`
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                          }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform Button */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={processImage}
                  disabled={!uploadedImage || isProcessing || isLoadingTrials || hasNoTrials}
                  iconName={isProcessing ? "Loader" : hasNoTrials ? "Lock" : "Sparkles"}
                  iconPosition="left"
                  className={`w-full ${hasNoTrials
                    ? "bg-gradient-to-r from-slate-600 to-slate-700"
                    : "bg-gradient-to-r from-violet-500 to-purple-600"
                    }`}
                >
                  {isProcessing ? 'Transforming...' :
                    authLoading ? 'Loading User Data...' : // <--- Updated text for auth loading
                      isLoadingTrials ? 'Loading Trials...' : // <--- Specific text for trials loading
                        hasNoTrials ? 'Subscribe to Transform More' :
                          currentUser ? `Transform with AI (${trialsLeft} trial${trialsLeft === 1 ? '' : 's'} left)` :
                            'Transform with AI (Sign in to get trials)'}
                </Button>
              </div>

              {/* Result Section */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-semibold text-white mb-6">Step 3: Your AI Masterpiece</h3>

                <div
                  className="bg-slate-700/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden mx-auto"
                  style={{
                    width: 320,
                    height: 480,
                    aspectRatio: '2 / 3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isProcessing ? (
                    <div className="text-center w-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white mb-2">AI is working its magic...</p>
                      <div className="w-48 bg-slate-600 rounded-full h-2 mb-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400">{Math.round(progress)}% complete</p>
                    </div>
                  ) : processedImage ? (
                    <Image
                      src={processedImage}
                      alt="AI transformed photo"
                      className="rounded-xl object-cover"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        aspectRatio: '2 / 3'
                      }}
                    />
                  ) : (
                    <div className="text-center w-full">
                      <Icon name="Image" size={48} className="text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">Your photo will appear here</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {processedImage && !isProcessing && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="primary"
                        onClick={downloadImage}
                        iconName="Download"
                        iconPosition="left"
                        className="bg-gradient-to-r from-green-500 to-emerald-600"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={processImage}
                        iconName="RefreshCw"
                        iconPosition="left"
                        className="border-violet-400 text-violet-400"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-violet-400">20s</div>
                    <div className="text-xs text-slate-400">Avg Time</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">4K</div>
                    <div className="text-xs text-slate-400">Quality</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-amber-400">99.9%</div>
                    <div className="text-xs text-slate-400">Success</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-violet-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">
                Love What You See?
              </h3>
              <p className="text-slate-300 mb-6">
                Start your free trial and transform unlimited photos for your next event
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  iconName="Sparkles"
                  iconPosition="left"
                  className="bg-gradient-to-r from-violet-500 to-purple-600"
                >
                  Start Free Trial - 50 Transforms
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  className="border-violet-400 text-violet-400"
                >
                  Book Live Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LiveDemo;