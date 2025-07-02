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
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

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
    // Check if user has already used their trial
    const checkTrialUsage = async () => {
      if (currentUser?.uid) {
        try {
          // Query the database to check if user has used their trial
          const { data, error } = await supabase
            .from('user_trials')
            .select('has_used_trial')
            .eq('user_id', currentUser.uid)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error checking trial usage:', error);
            return;
          }
          
          // If user exists in the table and has used their trial
          if (data?.has_used_trial) {
            setHasUsedTrial(true);
          }
        } catch (error) {
          console.error('Error checking trial status:', error);
        }
      }
    };
    
    checkTrialUsage();
  }, [currentUser]);

  const processImage = async () => {
    if (!uploadedImage) return;

    // Check if user is logged in
    if (!currentUser) {
      // Redirect to login or show login prompt
      setShowSubscribePrompt(true);
      return;
    }
    
    // Check if user has already used their trial
    if (hasUsedTrial) {
      setShowSubscribePrompt(true);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedImage(null);

    try {
      // Load workflow JSON
      const workflowResponse = await fetch(`/wfonline/${selectedStyle}online.json`);
      let workflow = await workflowResponse.json();

      // Update node 283 with UUID
      workflow['283'].inputs.unique_id = uuid;
      console.log(workflow);
      
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

      // Poll for job completion
      const checkStatus = async () => {
        const statusResponse = await fetch(`https://api.runpod.ai/v2/tdme3jq4u7zg1s/status/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_RUNPOD_API_KEY}`
          }
        });
        const statusData = await statusResponse.json();

        if (statusData.status === 'COMPLETED') {
          // Fetch output from Supabase
          const { data, error } = await supabase
            .from('inputimagetable')
            .select('output')
            .eq('unique_id', uuid)
            .single();

          if (!error && data) {
            setProcessedImage(data.output);
            
            // Record that user has used their trial
            if (currentUser?.uid) {
              const { error: trialError } = await supabase
                .from('user_trials')
                .upsert({
                  user_id: currentUser.uid,
                  has_used_trial: true,
                  trial_date: new Date().toISOString()
                });
                
              if (trialError) {
                console.error('Error recording trial usage:', trialError);
              } else {
                setHasUsedTrial(true);
              }
            }
          }
          setIsProcessing(false);
          clearInterval(statusInterval);
        } else if (statusData.status === 'FAILED') {
          console.error('Processing failed:', statusData);
          setIsProcessing(false);
          clearInterval(statusInterval);
        }
      };

      const statusInterval = setInterval(checkStatus, 2000);
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
            <Link to="/pricing">
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

  return (
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
                  minWidth: 220,   // increased width
                  width: 220,
                  minHeight: 140,  // slightly increased height
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
                        width: '120px',   // increased image width
                        height: '100px',  // increased image height
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
                disabled={!uploadedImage || isProcessing}
                iconName={isProcessing ? "Loader" : hasUsedTrial ? "Lock" : "Sparkles"}
                iconPosition="left"
                className={`w-full ${
                  hasUsedTrial 
                    ? "bg-gradient-to-r from-slate-600 to-slate-700" 
                    : "bg-gradient-to-r from-violet-500 to-purple-600"
                }`}
              >
                {isProcessing 
                  ? 'Transforming...' 
                  : hasUsedTrial 
                    ? 'Subscribe to Transform More' 
                    : 'Transform with AI'}
              </Button>
            </div>

            {/* Result Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-white mb-6">Step 3: Your AI Masterpiece</h3>

              <div
                className="bg-slate-700/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden mx-auto"
                style={{
                  width: 320,      // increased width
                  height: 480,     // increased height (2:3 ratio)
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
  );
};

export default LiveDemo;