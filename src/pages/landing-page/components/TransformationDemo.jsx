import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TransformationDemo = () => {
  const [selectedStyle, setSelectedStyle] = useState('digital-art');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const styles = [
    {
      id: 'digital-art',
      name: 'Digital Art',
      description: 'Modern digital painting style',
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      color: 'violet'
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      description: 'Soft watercolor painting effect',
      before: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
      color: 'blue'
    },
    {
      id: 'pop-art',
      name: 'Pop Art',
      description: 'Bold pop art transformation',
      before: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      color: 'pink'
    },
    {
      id: 'oil-painting',
      name: 'Oil Painting',
      description: 'Classic oil painting style',
      before: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
      color: 'amber'
    },
    {
      id: 'cartoon',
      name: 'Cartoon',
      description: 'Fun cartoon character style',
      before: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      color: 'green'
    },
    {
      id: 'vintage',
      name: 'Vintage',
      description: 'Retro vintage photo effect',
      before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
      color: 'orange'
    }
  ];

  const currentStyle = styles.find(style => style.id === selectedStyle);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See the Magic in Action
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Interactive before/after slider showing real AI transformations. 
            Drag the slider to reveal the stunning results.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Style Selector */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-6">Choose Your Style</h3>
            <div className="space-y-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full p-4 rounded-lg border transition-all duration-300 text-left group ${
                    selectedStyle === style.id
                      ? `border-${style.color}-500 bg-${style.color}-500/20`
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${
                        selectedStyle === style.id ? `text-${style.color}-300` : 'text-white'
                      }`}>
                        {style.name}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {style.description}
                      </div>
                    </div>
                    {selectedStyle === style.id && (
                      <Icon name="Check" size={20} className={`text-${style.color}-400`} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30">
              <div className="flex items-center mb-3">
                <Icon name="Zap" size={20} className="text-violet-400 mr-2" />
                <span className="text-violet-300 font-medium">Pro Tip</span>
              </div>
              <p className="text-sm text-slate-300">
                Each style can be customized further with brand colors, logos, and event themes.
              </p>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {currentStyle.name} Transformation
                </h3>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>Before</span>
                  <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-violet-500 rounded-full transition-transform duration-300"
                      style={{ transform: `translateX(${sliderPosition > 50 ? '24px' : '0px'})` }}
                    />
                  </div>
                  <span>After</span>
                </div>
              </div>

              {/* Before/After Slider */}
              <div 
                ref={sliderRef}
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-ew-resize select-none"
                onMouseDown={handleMouseDown}
              >
                {/* Before Image */}
                <div className="absolute inset-0">
                  <Image
                    src={currentStyle.before}
                    alt="Before transformation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded text-sm text-white">
                    Original
                  </div>
                </div>

                {/* After Image */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <Image
                    src={currentStyle.after}
                    alt="After transformation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-violet-600/90 px-3 py-1 rounded text-sm text-white">
                    {currentStyle.name}
                  </div>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Icon name="Move" size={16} className="text-slate-600" />
                  </div>
                </div>

                {/* Drag Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/80 px-4 py-2 rounded-full">
                  <span className="text-sm text-white flex items-center">
                    <Icon name="MousePointer" size={16} className="mr-2" />
                    Drag to compare
                  </span>
                </div>
              </div>

              {/* Transformation Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-violet-400">2.3s</div>
                  <div className="text-xs text-slate-400">Transform Time</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-green-400">4K</div>
                  <div className="text-xs text-slate-400">Output Quality</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-amber-400">99.9%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button 
                  variant="primary" 
                  size="lg"
                  iconName="Upload"
                  iconPosition="left"
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600"
                >
                  Try This Style Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  iconName="Download"
                  iconPosition="left"
                  className="border-violet-400 text-violet-400"
                >
                  Download Sample
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
            <Icon name="Palette" size={32} className="text-violet-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">24+ Art Styles</h4>
            <p className="text-slate-400 text-sm">From watercolor to digital art, find the perfect style for your event</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
            <Icon name="Smartphone" size={32} className="text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Mobile Optimized</h4>
            <p className="text-slate-400 text-sm">Guests can transform photos instantly using their smartphones</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
            <Icon name="Share2" size={32} className="text-blue-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Instant Sharing</h4>
            <p className="text-slate-400 text-sm">Share transformed photos directly to social media with custom hashtags</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationDemo;