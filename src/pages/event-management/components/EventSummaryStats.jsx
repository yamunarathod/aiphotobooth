import React from 'react';
import Icon from '../../../components/AppIcon';

const EventSummaryStats = ({ stats, subscriptionInfo }) => {
  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: 'Play',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Licenses Generated',
      value: stats.licensesGenerated,
      icon: 'FileText',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`glass rounded-lg p-4 border ${stat.borderColor} hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {formatNumber(stat.value)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon name={stat.icon} size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Usage */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Subscription Usage</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            subscriptionInfo.plan === 'Professional' ?'bg-primary/20 text-primary border-primary/30' :'bg-accent/20 text-accent border-accent/30'
          }`}>
            <Icon name="Crown" size={16} className="mr-2" />
            {subscriptionInfo.plan} Plan
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transformations Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Transformations</span>
              <span className="text-sm font-medium text-text-primary">
                {formatNumber(subscriptionInfo.transformationsUsed)} / {formatNumber(subscriptionInfo.transformationsLimit)}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((subscriptionInfo.transformationsUsed / subscriptionInfo.transformationsLimit) * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {formatNumber(subscriptionInfo.transformationsLimit - subscriptionInfo.transformationsUsed)} remaining
            </p>
          </div>

          {/* Style Selections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Available Styles</span>
              <span className="text-sm font-medium text-text-primary">
                {subscriptionInfo.availableStyles}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(subscriptionInfo.availableStyles)].map((_, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
              ))}
              {subscriptionInfo.plan === 'Starter' && (
                <div className="text-xs text-text-secondary">
                  Upgrade for more styles
                </div>
              )}
            </div>
          </div>

          {/* Next Billing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Next Billing</span>
              <span className="text-sm font-medium text-text-primary">
                {new Date(subscriptionInfo.nextBilling).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                ₹{formatNumber(subscriptionInfo.monthlyAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-3 rounded-lg glass-interactive border border-white/20 hover:border-primary/50 transition-all duration-200">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="Plus" size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">Create Event</div>
              <div className="text-xs text-text-secondary">New photobooth event</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-3 rounded-lg glass-interactive border border-white/20 hover:border-accent/50 transition-all duration-200">
            <div className="p-2 rounded-lg bg-accent/10">
              <Icon name="Download" size={20} className="text-accent" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">Bulk Download</div>
              <div className="text-xs text-text-secondary">All licenses</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-3 rounded-lg glass-interactive border border-white/20 hover:border-success/50 transition-all duration-200">
            <div className="p-2 rounded-lg bg-success/10">
              <Icon name="BarChart3" size={20} className="text-success" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">Analytics</div>
              <div className="text-xs text-text-secondary">Event performance</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-3 rounded-lg glass-interactive border border-white/20 hover:border-secondary/50 transition-all duration-200">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Icon name="Settings" size={20} className="text-secondary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">Settings</div>
              <div className="text-xs text-text-secondary">Event preferences</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSummaryStats;