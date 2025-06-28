import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Event Manager',
      company: 'Microsoft',
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: `Magic Photobooth AI transformed our corporate retreat completely. We saved $2,400 compared to traditional photobooths and our employees loved the creative AI styles. The setup was instant and the results were stunning.`,
      event: 'Corporate Retreat 2024',
      eventImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      metrics: {
        savings: '$2,400',
        engagement: '95%',
        shares: '1,200+'
      },
      verified: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Wedding Planner',
      company: 'Elite Weddings',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: `Our couples absolutely love the AI transformations! The watercolor and vintage styles are perfect for weddings. We've increased our package value by 40% while reducing costs. It's a game-changer for our business.`,
      event: 'Johnson-Smith Wedding',
      eventImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      metrics: {
        savings: '$1,800',
        engagement: '98%',
        shares: '800+'
      },
      verified: true
    },
    {
      id: 3,
      name: 'Jennifer Park',
      title: 'Marketing Director',
      company: 'TechFlow Inc',
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: `The brand activation potential is incredible. We customized the AI styles with our brand colors and logo. The social media buzz was amazing - 300% more shares than our previous events. ROI was outstanding.`,
      event: 'Product Launch Event',
      eventImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      metrics: {
        savings: '$3,200',
        engagement: '92%',
        shares: '2,100+'
      },
      verified: true
    },
    {
      id: 4,
      name: 'David Thompson',
      title: 'Event Coordinator',
      company: 'City Events',
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: `Managing 50+ events annually, the cost savings are massive. No more delivery coordination, setup stress, or equipment failures. Our clients are thrilled with the creative possibilities and instant results.`,
      event: 'Annual Gala 2024',
      eventImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      metrics: {
        savings: '$15,000',
        engagement: '89%',
        shares: '3,500+'
      },
      verified: true
    }
  ];

  const stats = [
    { label: 'Events Powered', value: '25,000+', icon: 'Calendar' },
    { label: 'Photos Transformed', value: '500,000+', icon: 'Image' },
    { label: 'Happy Clients', value: '10,000+', icon: 'Users' },
    { label: 'Average Savings', value: '80%', icon: 'TrendingDown' }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const handleTestimonialChange = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentTest = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by 10,000+ Event Professionals
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See why event planners, wedding coordinators, and marketing professionals 
            choose AI Magic Photobooth for their most important events
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center"
            >
              <Icon name={stat.icon} size={32} className="text-violet-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 mb-12">
          <div className="grid lg:grid-cols-2">
            {/* Testimonial Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src={currentTest.avatar}
                    alt={currentTest.name}
                    className="w-16 h-16 rounded-full border-2 border-violet-500"
                  />
                  {currentTest.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{currentTest.name}</h3>
                  <p className="text-violet-400">{currentTest.title}</p>
                  <p className="text-sm text-slate-400">{currentTest.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(currentTest.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={20} className="text-amber-400 fill-current" />
                ))}
                <span className="ml-2 text-slate-400">Verified Review</span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-slate-300 mb-6 leading-relaxed">
                "{currentTest.quote}"
              </blockquote>

              {/* Event Info */}
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Icon name="Calendar" size={16} className="text-violet-400 mr-2" />
                  <span className="text-sm text-violet-400 font-medium">{currentTest.event}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-400">{currentTest.metrics.savings}</div>
                    <div className="text-xs text-slate-400">Saved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">{currentTest.metrics.engagement}</div>
                    <div className="text-xs text-slate-400">Engagement</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">{currentTest.metrics.shares}</div>
                    <div className="text-xs text-slate-400">Social Shares</div>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialChange(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-violet-500' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Event Image */}
            <div className="relative">
              <Image
                src={currentTest.eventImage}
                alt={currentTest.event}
                className="w-full h-full object-cover min-h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{currentTest.event}</h4>
                  <p className="text-slate-300 text-sm">Powered by AI Magic Photobooth</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-semibold text-white mb-8">
            Trusted by Leading Companies & Event Professionals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              { name: 'Microsoft', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Microsoft' },
              { name: 'Google', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Google' },
              { name: 'Apple', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Apple' },
              { name: 'Amazon', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Amazon' },
              { name: 'Meta', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Meta' },
              { name: 'Tesla', logo: 'https://via.placeholder.com/120x60/6366f1/ffffff?text=Tesla' }
            ].map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-violet-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Join 10,000+ Happy Event Professionals
          </h3>
          <p className="text-slate-300 mb-6">
            Start your free trial today and see why event planners are switching to AI Magic Photobooth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-violet-400 font-semibold">✓ 50 free transforms</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-violet-400 font-semibold">✓ No setup required</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-violet-400 font-semibold">✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;