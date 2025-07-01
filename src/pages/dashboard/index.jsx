import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import EventFormFields from '../create-event/components/EventFormFields';
import StyleSelector from '../create-event/components/StyleSelector';
import EventSummary from '../create-event/components/EventSummary';
import LicenseDownload from '../create-event/components/LicenseDownload';

const Dashboard = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  // Step: 'form' | 'styles' | 'summary' | 'license'
  const [step, setStep] = useState(null);

  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [subscriptionPlan] = useState('Professional');
  const [maxStyles] = useState(6);

  // Store all created events
  const [events, setEvents] = useState([]);

  // For summary/license
  const [createdEvent, setCreatedEvent] = useState(null);

  // Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEventFormSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setStep('styles');
  };

  const handleStyleToggle = (styleId, isSelected) => {
    setSelectedStyles((prev) =>
      isSelected
        ? [...prev, styleId]
        : prev.filter((id) => id !== styleId)
    );
  };

  const handleStylesSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (selectedStyles.length === 0) newErrors.styles = "Please select at least one AI style.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setCreatedEvent({ ...formData, selectedStyles, subscriptionPlan });
    setStep('summary');
  };

  const handleNextFromSummary = () => {
    setStep('license');
  };

  const handleLicenseDone = () => {
    // Add event to dashboard
    setEvents([
      ...events,
      { ...createdEvent, id: Date.now(), date: new Date().toLocaleString() }
    ]);
    // Reset all
    setFormData({
      eventName: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      description: ''
    });
    setSelectedStyles([]);
    setCreatedEvent(null);
    setStep(null);
    setErrors({});
  };

  const handleBackToEdit = () => setStep('form');
  const handleBackToStyles = () => setStep('styles');

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) navigate('/');
  };

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
          {[
            { icon: 'Sparkles', label: 'Transformations Used', value: '127', limit: '1,000' },
            { icon: 'Calendar', label: 'Events This Month', value: '3', trend: '+1' },
            { icon: 'Users', label: 'Total Guests Served', value: '452', trend: '+89' },
            { icon: 'Download', label: 'Photos Downloaded', value: '1,247', trend: '+203' }
          ].map((stat, index) => (
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
          <div className="lg:col-span-2">
            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Events</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-400 text-violet-400"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setStep('form')}
                >
                  New Event
                </Button>
              </div>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-slate-400 text-center">No events yet. Click "New Event" to create one.</div>
                ) : (
                  events.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-violet-500/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{activity.eventName}</h4>
                        <p className="text-slate-400 text-sm mb-2">{activity.date}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>
                            {activity.selectedStyles?.length || 0} styles
                          </span>
                          <span>•</span>
                          <span>{activity.location}</span>
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
                  ))
                )}
              </div>
            </div>

            {/* Modals for each step */}
            {step === 'form' && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
                  <button
                    className="absolute top-4 right-4 text-white"
                    onClick={() => setStep(null)}
                  >
                    <Icon name="X" size={20} />
                  </button>
                  <EventFormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    onSubmit={handleEventFormSubmit}
                  />
                </div>
              </div>
            )}

            {step === 'styles' && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
                  <button
                    className="absolute top-4 right-4 text-white"
                    onClick={() => setStep(null)}
                  >
                    <Icon name="X" size={20} />
                  </button>
                  <form onSubmit={handleStylesSubmit}>
                    <StyleSelector
                      selectedStyles={selectedStyles}
                      onStyleToggle={handleStyleToggle}
                      subscriptionPlan={subscriptionPlan}
                      maxStyles={maxStyles}
                      errors={errors}
                    />
                    {errors.styles && (
                      <p className="mt-2 text-sm text-error flex items-center">
                        <Icon name="AlertCircle" size={16} className="mr-1" />
                        {errors.styles}
                      </p>
                    )}
                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        className="bg-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-600 transition"
                        onClick={handleBackToEdit}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {step === 'summary' && createdEvent && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
                  <button
                    className="absolute top-4 right-4 text-white"
                    onClick={() => setStep(null)}
                  >
                    <Icon name="X" size={20} />
                  </button>
                  <EventSummary
                    formData={createdEvent}
                    selectedStyles={createdEvent.selectedStyles}
                    subscriptionPlan={createdEvent.subscriptionPlan}
                  />
                  <div className="mt-6 flex justify-between">
                    <button
                      className="bg-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-600 transition"
                      onClick={handleBackToStyles}
                    >
                      Back
                    </button>
                    <button
                      className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                      onClick={handleNextFromSummary}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'license' && createdEvent && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg relative">
                  <button
                    className="absolute top-4 right-4 text-white"
                    onClick={handleLicenseDone}
                  >
                    <Icon name="X" size={20} />
                  </button>
                  <LicenseDownload
                    eventData={createdEvent}
                    selectedStyles={createdEvent.selectedStyles}
                    onClose={handleLicenseDone}
                    onNewEvent={() => setStep('form')}
                  />
                </div>
              </div>
            )}
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