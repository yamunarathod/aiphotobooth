import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../utils/supabase';

const LiveDemo = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('ghibli');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uuid, setUuid] = useState('');
  const fileInputRef = useRef(null);

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

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedImage(null);

    try {
      // Load workflow JSON
      const workflowResponse = await fetch(`/wfonline/${selectedStyle}online.json`);
      let workflow = await workflowResponse.json();

      // Update node 283 with UUID
      workflow['283'].inputs.unique_id = uuid; // Corrected line
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

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `ai-transformed-${selectedStyle}.jpg`;
      link.click();
    }
  };

  const shareImage = (platform) => {
    if (!processedImage) return;
    
    const text = `Check out my AI-transformed photo using Magic Photobooth AI! #AIPhotobooth #MagicPhotobooth`;
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

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
                className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
                  uploadError ?
                  'border-red-500 bg-red-900/20' :
                  'border-slate-600 hover:border-violet-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded photo"
                      className="w-full max-w-xs mx-auto rounded-lg"
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
                  <div>
                    <Icon name="Upload" size={48} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-lg text-white mb-2">Click to upload your photo</p>
                    <p className="text-sm text-slate-400">JPG, PNG up to 10MB</p>
                    {uploadError && (
                      <div className="mt-4 p-3 bg-red-900/50 rounded-lg text-red-300 text-sm flex items-center">
                        <Icon name="AlertCircle" size={16} className="mr-2" />
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
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        selectedStyle === style.id
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
                iconName={isProcessing ? "Loader" : "Sparkles"}
                iconPosition="left"
                className={`w-full bg-gradient-to-r from-violet-500 to-purple-600 ${
                  isProcessing ? 'animate-pulse' : ''
                }`}
              >
                {isProcessing ? 'Transforming...' : 'Transform with AI'}
              </Button>
            </div>

            {/* Result Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-white mb-6">Step 3: Your AI Masterpiece</h3>
              
              <div className="aspect-square bg-slate-700/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                {isProcessing ? (
                  <div className="text-center">
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
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <Icon name="Image" size={48} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Your transformed photo will appear here</p>
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

                  {/* Share Buttons */}
                  <div>
                    <p className="text-sm text-slate-400 mb-3">Share your creation:</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => shareImage('twitter')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Icon name="Twitter" size={16} className="mr-2" />
                        Twitter
                      </button>
                      <button
                        onClick={() => shareImage('facebook')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Icon name="Facebook" size={16} className="mr-2" />
                        Facebook
                      </button>
                      <button
                        onClick={() => shareImage('linkedin')}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Icon name="Linkedin" size={16} className="mr-2" />
                        LinkedIn
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-violet-400">2.3s</div>
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