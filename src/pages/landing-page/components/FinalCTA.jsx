import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FinalCTA = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 23,
    seconds: 45
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      icon: 'Sparkles',
      text: '50 Free AI Transformations',
      highlight: true
    },
    {
      icon: 'Palette',
      text: 'Access to All 24+ Art Styles',
      highlight: false
    },
    {
      icon: 'Smartphone',
      text: 'Mobile-Optimized Platform',
      highlight: false
    },
    {
      icon: 'Share2',
      text: 'Instant Social Media Sharing',
      highlight: false
    },
    {
      icon: 'Award',
      text: '4K Quality Exports',
      highlight: false
    },
    {
      icon: 'Clock',
      text: 'Zero Setup Time',
      highlight: false
    }
  ];

  const testimonialQuotes = [
    {
      text: "Saved us $2,400 and our guests loved it!",
      author: "Sarah Chen, Microsoft"
    },
    {
      text: "300% more social shares than traditional photobooths",
      author: "Jennifer Park, TechFlow"
    },
    {
      text: "Game-changer for our wedding business",
      author: "Marcus Rodriguez, Elite Weddings"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % testimonialQuotes.length);
    }, 3000);

    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Urgency Banner */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="Clock" size={24} className="text-amber-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Limited Time Beta Access</h3>
            </div>
            
            <p className="text-slate-300 mb-4">
              Join the exclusive beta program with 50 free transformations and priority support
            </p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 min-w-[80px]">
                <div className="text-2xl font-bold text-amber-400">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-slate-400">Hours</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 min-w-[80px]">
                <div className="text-2xl font-bold text-amber-400">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-slate-400">Minutes</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 min-w-[80px]">
                <div className="text-2xl font-bold text-amber-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-slate-400">Seconds</div>
              </div>
            </div>
            
            <div className="text-sm text-amber-300">
              Only <span className="font-bold">47 spots</span> remaining in beta program
            </div>
          </div>
        </div>

        {/* Main CTA Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform
            <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Your Events Forever?
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Join 10,000+ event professionals who've eliminated expensive photobooth rentals 
            and created unforgettable experiences with AI Magic Photobooth.
          </p>

          {/* Rotating Testimonials */}
          <div className="bg-slate-800/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <Icon name="Quote" size={20} className="text-violet-400 mr-3" />
              <div className="text-slate-300 italic">
                "{testimonialQuotes[currentQuote].text}"
              </div>
            </div>
            <div className="text-sm text-slate-400 mt-2">
              — {testimonialQuotes[currentQuote].author}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
                benefit.highlight
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-slate-800/30 border-slate-600 text-slate-300'
              }`}
            >
              <Icon 
                name={benefit.icon} 
                size={20} 
                className={benefit.highlight ? 'text-violet-400' : 'text-slate-400'} 
              />
              <span className="ml-3 font-medium">{benefit.text}</span>
              {benefit.highlight && (
                <Icon name="Star" size={16} className="text-amber-400 ml-auto" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Button
            variant="primary"
            size="xl"
            iconName="Sparkles"
            iconPosition="left"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-2xl shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Start Free Trial - 50 Transforms
          </Button>
          <Button
            variant="outline"
            size="xl"
            iconName="Play"
            iconPosition="left"
            className="border-violet-400 text-violet-400 hover:bg-violet-500/10 transform hover:scale-105 transition-all duration-300"
          >
            Watch 2-Min Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <p className="text-sm text-slate-400 mb-6">
            Trusted by event professionals worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center">
              <Icon name="Shield" size={16} className="text-green-400 mr-2" />
              <span className="text-slate-400 text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Icon name="Award" size={16} className="text-amber-400 mr-2" />
              <span className="text-slate-400 text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center">
              <Icon name="Users" size={16} className="text-violet-400 mr-2" />
              <span className="text-slate-400 text-sm">10,000+ Customers</span>
            </div>
            <div className="flex items-center">
              <Icon name="CreditCard" size={16} className="text-blue-400 mr-2" />
              <span className="text-slate-400 text-sm">No Credit Card Required</span>
            </div>
          </div>
        </div>

        {/* Risk-Free Guarantee */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30 text-center max-w-3xl mx-auto">
          <Icon name="Shield" size={48} className="text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            100% Risk-Free Guarantee
          </h3>
          <p className="text-slate-300 mb-6">
            Try AI Magic Photobooth for 30 days. If you're not completely satisfied with the results, 
            we'll refund every penny. No questions asked.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center">
              <Icon name="Check" size={16} className="text-green-400 mr-2" />
              <span className="text-green-300 text-sm">30-Day Money Back</span>
            </div>
            <div className="flex items-center justify-center">
              <Icon name="Check" size={16} className="text-green-400 mr-2" />
              <span className="text-green-300 text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center justify-center">
              <Icon name="Check" size={16} className="text-green-400 mr-2" />
              <span className="text-green-300 text-sm">Keep All Transforms</span>
            </div>
          </div>
        </div>

        {/* Final Push */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-300 mb-4">
            Don't let another event drain your budget with expensive photobooths.
          </p>
          <p className="text-2xl font-bold text-white">
            Start saving 80% today with AI Magic Photobooth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;