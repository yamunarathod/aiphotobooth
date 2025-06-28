import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsComparison = () => {
  const comparisonData = [
    {
      feature: 'Setup Time',
      traditional: {
        value: '4+ Hours',
        description: 'Delivery, setup, testing, troubleshooting',
        icon: 'Clock',
        negative: true
      },
      ai: {
        value: '0 Minutes',
        description: 'Instant activation, no physical setup required',
        icon: 'Zap',
        positive: true
      }
    },
    {
      feature: 'Cost Per Event',
      traditional: {
        value: '$500-2000',
        description: 'Rental fees, delivery, operator costs',
        icon: 'DollarSign',
        negative: true
      },
      ai: {
        value: '$100-400',
        description: '80% savings with unlimited transformations',
        icon: 'TrendingDown',
        positive: true
      }
    },
    {
      feature: 'Style Options',
      traditional: {
        value: '3-5 Basic',
        description: 'Limited templates, basic props only',
        icon: 'Palette',
        negative: true
      },
      ai: {
        value: '24+ Styles',
        description: 'Unlimited customization, brand integration',
        icon: 'Sparkles',
        positive: true
      }
    },
    {
      feature: 'Guest Capacity',
      traditional: {
        value: '50-100/hour',
        description: 'Queue bottlenecks, equipment limitations',
        icon: 'Users',
        negative: true
      },
      ai: {
        value: 'Unlimited',
        description: 'Simultaneous processing, no waiting',
        icon: 'Infinity',
        positive: true
      }
    },
    {
      feature: 'Quality Control',
      traditional: {
        value: 'Variable',
        description: 'Lighting issues, equipment failures',
        icon: 'AlertTriangle',
        negative: true
      },
      ai: {
        value: '4K Consistent',
        description: 'Perfect results every time, guaranteed',
        icon: 'Award',
        positive: true
      }
    },
    {
      feature: 'Customization',
      traditional: {
        value: 'Limited',
        description: 'Basic branding, fixed templates',
        icon: 'Lock',
        negative: true
      },
      ai: {
        value: 'Full Control',
        description: 'Brand colors, logos, custom styles',
        icon: 'Settings',
        positive: true
      }
    },
    {
      feature: 'Sharing Options',
      traditional: {
        value: 'Print Only',
        description: 'Physical prints, manual distribution',
        icon: 'Printer',
        negative: true
      },
      ai: {
        value: 'Instant Digital',
        description: 'Social media, email, cloud storage',
        icon: 'Share2',
        positive: true
      }
    },
    {
      feature: 'Event Coverage',
      traditional: {
        value: '40-60%',
        description: 'Many guests miss the photobooth',
        icon: 'UserX',
        negative: true
      },
      ai: {
        value: '95%+',
        description: 'Everyone can participate simultaneously',
        icon: 'UserCheck',
        positive: true
      }
    }
  ];

  const benefits = [
    {
      icon: 'TrendingUp',
      title: 'Increase Guest Engagement',
      description: 'AI photobooths create buzz and excitement, with guests sharing their transformations on social media',
      stat: '300% more social shares'
    },
    {
      icon: 'DollarSign',
      title: 'Massive Cost Savings',
      description: 'Eliminate rental fees, delivery costs, and operator expenses while getting better results',
      stat: '80% cost reduction'
    },
    {
      icon: 'Clock',
      title: 'Zero Setup Stress',
      description: 'No more coordinating deliveries, setup times, or technical troubleshooting on event day',
      stat: '4+ hours saved'
    },
    {
      icon: 'Palette',
      title: 'Unlimited Creativity',
      description: 'Choose from 24+ art styles or create custom looks that perfectly match your event theme',
      stat: '24+ art styles'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Traditional Photobooths vs
            <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AI Magic Photobooth
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See why 10,000+ event planners have made the switch to AI-powered photo transformations
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 mb-16">
          <div className="grid grid-cols-3 bg-slate-700/50">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-300">Feature</h3>
            </div>
            <div className="p-6 text-center border-l border-slate-600">
              <h3 className="text-lg font-semibold text-red-400">Traditional Photobooth</h3>
            </div>
            <div className="p-6 text-center border-l border-slate-600">
              <h3 className="text-lg font-semibold text-violet-400">AI Magic Photobooth</h3>
            </div>
          </div>

          {comparisonData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-slate-700/50">
              {/* Feature */}
              <div className="p-6 flex items-center">
                <h4 className="font-medium text-white">{item.feature}</h4>
              </div>

              {/* Traditional */}
              <div className="p-6 border-l border-slate-600 bg-red-500/5">
                <div className="flex items-center mb-2">
                  <Icon 
                    name={item.traditional.icon} 
                    size={20} 
                    className="text-red-400 mr-3" 
                  />
                  <span className="font-semibold text-red-400">{item.traditional.value}</span>
                </div>
                <p className="text-sm text-slate-400">{item.traditional.description}</p>
              </div>

              {/* AI Solution */}
              <div className="p-6 border-l border-slate-600 bg-violet-500/5">
                <div className="flex items-center mb-2">
                  <Icon 
                    name={item.ai.icon} 
                    size={20} 
                    className="text-violet-400 mr-3" 
                  />
                  <span className="font-semibold text-violet-400">{item.ai.value}</span>
                </div>
                <p className="text-sm text-slate-400">{item.ai.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 group text-center"
            >
              <div className="bg-violet-500/20 rounded-lg p-3 w-fit mx-auto mb-4 group-hover:bg-violet-500/30 transition-colors">
                <Icon name={benefit.icon} size={24} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{benefit.description}</p>
              <div className="bg-violet-500/10 rounded-lg px-3 py-2 border border-violet-500/20">
                <span className="text-violet-400 font-semibold text-sm">{benefit.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Calculate Your Annual Savings
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-red-400 mb-2">$18,000</div>
              <div className="text-slate-300 mb-2">Traditional Cost</div>
              <div className="text-sm text-slate-400">12 events × $1,500 avg</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-violet-400 mb-2">$3,600</div>
              <div className="text-slate-300 mb-2">AI Photobooth Cost</div>
              <div className="text-sm text-slate-400">12 events × $300 avg</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border-2 border-green-500/50">
              <div className="text-3xl font-bold text-green-400 mb-2">$14,400</div>
              <div className="text-slate-300 mb-2">Annual Savings</div>
              <div className="text-sm text-green-400 font-semibold">80% cost reduction</div>
            </div>
          </div>

          <p className="text-slate-300 mb-6">
            Based on average event planner organizing 12 events per year
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-green-400 font-semibold">✓ No hidden fees</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-green-400 font-semibold">✓ Unlimited usage</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
              <span className="text-green-400 font-semibold">✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsComparison;