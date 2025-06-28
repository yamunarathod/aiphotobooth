import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const beforeAfterImages = [
    {
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      style: "Digital Portrait"
    },
    {
      before: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
      style: "Watercolor Dream"
    },
    {
      before: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      style: "Pop Art"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % beforeAfterImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Events Transformed' },
    { value: '95%', label: 'Cost Savings' },
    { value: '2.3s', label: 'Transform Speed' },
    { value: '24+', label: 'Art Styles' }
  ];

  const handleBuyNow = () => {
    navigate('/subscription');
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-violet-500/20 rounded-full border border-violet-500/30 mb-6">
              <Icon name="Sparkles" size={16} className="text-violet-400 mr-2" />
              <span className="text-violet-300 text-sm font-medium">AI-Powered Photo Magic</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform
              <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Every Photo
              </span>
              Into Art
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Replace expensive photobooth rentals with AI-powered transformations. 
              Create stunning, shareable moments that guests will love—instantly and affordably.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={handleBuyNow}
                variant="primary"
                size="xl"
                iconName="Sparkles"
                iconPosition="left"
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-2xl shadow-violet-500/25"
              >
                Buy Now - Start Creating
              </Button>
              <Button
                variant="outline"
                size="xl"
                iconName="Play"
                iconPosition="left"
                className="border-violet-400 text-violet-400 hover:bg-violet-500/10"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Before/After Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">See the Magic in Action</h3>
                <p className="text-slate-400">Real transformations in 2.3 seconds</p>
              </div>

              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-300 mb-3">Before</div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-slate-600">
                    <Image
                      src={beforeAfterImages[currentImageIndex].before}
                      alt="Before transformation"
                      className="w-full h-48 object-cover transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-medium text-violet-300 mb-3">After</div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-violet-500">
                    <Image
                      src={beforeAfterImages[currentImageIndex].after}
                      alt="After transformation"
                      className="w-full h-48 object-cover transition-all duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-violet-500/90 px-2 py-1 rounded text-xs text-white font-medium">
                        {beforeAfterImages[currentImageIndex].style}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Arrow */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-400"></div>
                  <div className="bg-violet-500 rounded-full p-2 mx-3">
                    <Icon name="Sparkles" size={16} className="text-white" />
                  </div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-400"></div>
                </div>
              </div>

              {/* Style Indicators */}
              <div className="flex justify-center space-x-2 mb-6">
                {beforeAfterImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-violet-500' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Icon name="Zap" size={20} className="text-violet-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300">Instant</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Icon name="Award" size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300">4K Quality</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Icon name="Palette" size={20} className="text-amber-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300">Custom</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full text-white text-sm font-semibold animate-bounce">
              95% Savings!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 rounded-full text-white text-sm font-semibold animate-pulse">
              2.3s Transform
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 mb-6">Trusted by event professionals worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center">
              <Icon name="Users" size={20} className="text-violet-400 mr-2" />
              <span className="text-slate-400">10,000+ Events</span>
            </div>
            <div className="flex items-center">
              <Icon name="Star" size={20} className="text-amber-400 mr-2" />
              <span className="text-slate-400">4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <Icon name="Shield" size={20} className="text-green-400 mr-2" />
              <span className="text-slate-400">Enterprise Secure</span>
            </div>
            <div className="flex items-center">
              <Icon name="Clock" size={20} className="text-blue-400 mr-2" />
              <span className="text-slate-400">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;