import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProblemSection = () => {
  const [selectedCity, setSelectedCity] = useState('new-york');
  const [animatedCost, setAnimatedCost] = useState(0);

  const cityData = {
    'new-york': { name: 'New York', cost: 1800, setup: 4 },
    'los-angeles': { name: 'Los Angeles', cost: 1600, setup: 3.5 },
    'chicago': { name: 'Chicago', cost: 1200, setup: 3 },
    'miami': { name: 'Miami', cost: 1400, setup: 3.5 },
    'san-francisco': { name: 'San Francisco', cost: 2000, setup: 4.5 }
  };

  const problems = [
    {
      icon: 'DollarSign',
      title: 'Expensive Rental Costs',
      description: 'Traditional photobooths cost $500-$2000 per event, eating into your budget',
      impact: '$1,500 avg cost'
    },
    {
      icon: 'Clock',
      title: 'Complex Setup Process',
      description: 'Hours of setup time, delivery coordination, and technical troubleshooting',
      impact: '4+ hours setup'
    },
    {
      icon: 'Palette',
      title: 'Limited Customization',
      description: 'Stuck with basic templates and props, no brand customization options',
      impact: '3-5 basic styles'
    },
    {
      icon: 'Users',
      title: 'Capacity Constraints',
      description: 'Long guest queues, equipment failures, and limited simultaneous usage',
      impact: '50% guest coverage'
    }
  ];

  useEffect(() => {
    const targetCost = cityData[selectedCity].cost;
    const duration = 1000;
    const steps = 50;
    const increment = targetCost / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCost) {
        setAnimatedCost(targetCost);
        clearInterval(timer);
      } else {
        setAnimatedCost(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [selectedCity]);

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Traditional Photobooths Are
            <span className="block text-red-400">Bleeding Your Budget</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Event planners waste thousands on outdated photobooth rentals with limited options and endless headaches
          </p>
        </div>

        {/* Interactive Cost Calculator */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4">Real Photobooth Rental Costs</h3>
            <p className="text-slate-400">Select your city to see actual market rates</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">Select Your City:</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(cityData).map(([key, city]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCity(key)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      selectedCity === key
                        ? 'border-violet-500 bg-violet-500/20 text-white'
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{city.name}</span>
                      <span className="text-sm opacity-75">${city.cost.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Display */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-8 border border-red-500/30">
                <Icon name="AlertTriangle" size={48} className="text-red-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-red-400 mb-2">
                  ${animatedCost.toLocaleString()}
                </div>
                <div className="text-slate-300 mb-4">Per Event Cost</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Setup Time</div>
                    <div className="text-white font-semibold">{cityData[selectedCity].setup} hours</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Annual Cost</div>
                    <div className="text-white font-semibold">${(cityData[selectedCity].cost * 12).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* AI Alternative */}
              <div className="mt-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
                <Icon name="TrendingDown" size={32} className="text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  ${Math.floor(cityData[selectedCity].cost * 0.2).toLocaleString()}
                </div>
                <div className="text-green-300 text-sm">With AI Photobooth</div>
                <div className="text-xs text-slate-400 mt-1">80% savings guaranteed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 group"
            >
              <div className="bg-red-500/20 rounded-lg p-3 w-fit mb-4 group-hover:bg-red-500/30 transition-colors">
                <Icon name={problem.icon} size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{problem.description}</p>
              <div className="bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
                <span className="text-red-400 font-semibold text-sm">{problem.impact}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-violet-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Eliminate These Problems Forever?
            </h3>
            <p className="text-slate-300 mb-6">
              Join 10,000+ event planners who've switched to AI-powered photo transformations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
                <span className="text-violet-400 font-semibold">✓ No rental fees</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
                <span className="text-violet-400 font-semibold">✓ Instant setup</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-600">
                <span className="text-violet-400 font-semibold">✓ Unlimited styles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;