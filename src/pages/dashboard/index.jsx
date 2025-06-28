import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/');
    }
  };

  const stats = [
    { icon: 'Sparkles', label: 'Transformations Used', value: '127', limit: '1,000' },
    { icon: 'Calendar', label: 'Events This Month', value: '3', trend: '+1' },
    { icon: 'Users', label: 'Total Guests Served', value: '452', trend: '+89' },
    { icon: 'Download', label: 'Photos Downloaded', value: '1,247', trend: '+203' }
  ];

  const recentActivity = [
    { id: 1, event: 'Corporate  Event - TechFlow', date: '2 hours ago', photos: 45, style: 'Digital Portrait' },
    { id: 2, event: 'Wedding - Sarah & John', date: '1 day ago', photos: 89, style: 'Watercolor Dream' },
    { id: 3, event: 'Birthday Party - Emma', date: '3 days ago', photos: 23, style: 'Pop Art Explosion' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Magic Photobooth AI</h1>
                <p className="text-sm text-slate-400">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{userProfile?.full_name || user?.email}</p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-slate-400">
            Here's what's happening with your AI photobooth magic today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-violet-500/20 rounded-lg p-3">
                  <Icon name={stat.icon} size={24} className="text-violet-400" />
                </div>
                {stat.trend && (
                  <span className="text-green-400 text-sm font-medium">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.limit && (
                  <span className="text-slate-400 text-sm ml-2">/ {stat.limit}</span>
                )}
              </div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Events</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-400 text-violet-400"
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Event
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-violet-500/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{activity.event}</h4>
                      <p className="text-slate-400 text-sm mb-2">{activity.date}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{activity.photos} photos</span>
                        <span>•</span>
                        <span>{activity.style}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-violet-400 text-violet-400"
                        iconName="Download"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  View All Events
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Plan Info */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
              <div className="bg-violet-500/20 rounded-lg p-4 border border-violet-500/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-violet-300 font-medium">Professional</span>
                  <Icon name="Crown" size={20} className="text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">873</div>
                <div className="text-sm text-slate-400">transformations remaining</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-violet-400 text-violet-400"
                onClick={() => navigate('/subscription')}
              >
                Upgrade Plan
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
                  iconName="Sparkles"
                  iconPosition="left"
                >
                  Start New Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300"
                  iconName="Palette"
                  iconPosition="left"
                >
                  Browse Styles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300"
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Get started with our comprehensive guides and tutorials.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300"
                  iconName="BookOpen"
                  iconPosition="left"
                >
                  View Tutorials
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300"
                  iconName="MessageCircle"
                  iconPosition="left"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;