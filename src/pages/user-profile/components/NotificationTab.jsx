import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationTab = ({ user, onUpdateNotifications }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      subscriptionRenewals: user.notifications?.email?.subscriptionRenewals ?? true,
      eventReminders: user.notifications?.email?.eventReminders ?? true,
      systemUpdates: user.notifications?.email?.systemUpdates ?? false,
      marketingEmails: user.notifications?.email?.marketingEmails ?? false,
      securityAlerts: user.notifications?.email?.securityAlerts ?? true,
      paymentNotifications: user.notifications?.email?.paymentNotifications ?? true
    },
    push: {
      eventReminders: user.notifications?.push?.eventReminders ?? true,
      licenseGenerated: user.notifications?.push?.licenseGenerated ?? true,
      subscriptionExpiry: user.notifications?.push?.subscriptionExpiry ?? true,
      systemMaintenance: user.notifications?.push?.systemMaintenance ?? false
    },
    sms: {
      eventReminders: user.notifications?.sms?.eventReminders ?? false,
      securityAlerts: user.notifications?.sms?.securityAlerts ?? false,
      paymentFailures: user.notifications?.sms?.paymentFailures ?? true
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const notificationCategories = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'Mail',
      settings: [
        {
          key: 'subscriptionRenewals',
          title: 'Subscription Renewals',
          description: 'Get notified before your subscription renews'
        },
        {
          key: 'eventReminders',
          title: 'Event Reminders',
          description: 'Reminders about upcoming events'
        },
        {
          key: 'systemUpdates',
          title: 'System Updates',
          description: 'Updates about new features and improvements'
        },
        {
          key: 'marketingEmails',
          title: 'Marketing Emails',
          description: 'Promotional offers and product updates'
        },
        {
          key: 'securityAlerts',
          title: 'Security Alerts',
          description: 'Important security notifications'
        },
        {
          key: 'paymentNotifications',
          title: 'Payment Notifications',
          description: 'Payment confirmations and receipts'
        }
      ]
    },
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Browser push notifications',
      icon: 'Bell',
      settings: [
        {
          key: 'eventReminders',
          title: 'Event Reminders',
          description: 'Get reminded about upcoming events'
        },
        {
          key: 'licenseGenerated',
          title: 'License Generated',
          description: 'When your event license is ready'
        },
        {
          key: 'subscriptionExpiry',
          title: 'Subscription Expiry',
          description: 'Before your subscription expires'
        },
        {
          key: 'systemMaintenance',
          title: 'System Maintenance',
          description: 'Scheduled maintenance notifications'
        }
      ]
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Text message notifications',
      icon: 'MessageSquare',
      settings: [
        {
          key: 'eventReminders',
          title: 'Event Reminders',
          description: 'SMS reminders for important events'
        },
        {
          key: 'securityAlerts',
          title: 'Security Alerts',
          description: 'Critical security notifications via SMS'
        },
        {
          key: 'paymentFailures',
          title: 'Payment Failures',
          description: 'Immediate alerts for failed payments'
        }
      ]
    }
  ];

  const handleToggle = (category, setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await onUpdateNotifications(notificationSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async (type) => {
    try {
      console.log(`Sending test ${type} notification...`);
      // Simulate test notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Test ${type} notification sent!`);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const getEnabledCount = (category) => {
    return Object.values(notificationSettings[category]).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      {/* Notification Overview */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Notification Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {notificationCategories.map((category) => (
            <div key={category.id} className="p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon name={category.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">{category.title}</div>
                  <div className="text-xs text-text-secondary">
                    {getEnabledCount(category.id)} enabled
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => handleTestNotification(category.id)}
                iconName="Send"
                iconPosition="left"
              >
                Test
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Detailed Settings */}
      {notificationCategories.map((category) => (
        <div key={category.id} className="glass rounded-lg p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Icon name={category.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{category.title}</h3>
              <p className="text-sm text-text-secondary">{category.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {category.settings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-text-primary">{setting.title}</div>
                  <div className="text-sm text-text-secondary">{setting.description}</div>
                </div>
                <button
                  onClick={() => handleToggle(category.id, setting.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings[category.id][setting.key] ? 'bg-primary' : 'bg-surface-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings[category.id][setting.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Notification Schedule */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Notification Schedule
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Quiet Hours Start
            </label>
            <select className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="22:00" className="bg-surface text-text-primary">10:00 PM</option>
              <option value="23:00" className="bg-surface text-text-primary">11:00 PM</option>
              <option value="00:00" className="bg-surface text-text-primary">12:00 AM</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Quiet Hours End
            </label>
            <select className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="07:00" className="bg-surface text-text-primary">7:00 AM</option>
              <option value="08:00" className="bg-surface text-text-primary">8:00 AM</option>
              <option value="09:00" className="bg-surface text-text-primary">9:00 AM</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-surface rounded-lg">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>During quiet hours, only critical notifications will be sent</span>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="History" size={20} />
          Recent Notifications
        </h3>
        
        <div className="space-y-3">
          {[
            {
              id: 1,
              type: 'subscription',
              title: 'Subscription Renewal Reminder',
              message: 'Your Professional plan will renew in 3 days',
              time: '2024-01-15T10:30:00Z',
              read: false,
              icon: 'CreditCard'
            },
            {
              id: 2,
              type: 'event',
              title: 'Event License Generated',
              message: 'License for "Wedding Photography" event is ready',
              time: '2024-01-14T18:45:00Z',
              read: true,
              icon: 'FileText'
            },
            {
              id: 3,
              type: 'security',
              title: 'New Device Login',
              message: 'Login detected from Chrome on Android',
              time: '2024-01-13T14:20:00Z',
              read: true,
              icon: 'Shield'
            }
          ].map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg border ${
              notification.read 
                ? 'bg-surface border-white/10' :'bg-primary/5 border-primary/20'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  notification.read 
                    ? 'bg-surface-600 text-text-secondary' :'bg-primary/20 text-primary'
                }`}>
                  <Icon name={notification.icon} size={16} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    notification.read ? 'text-text-secondary' : 'text-text-primary'
                  }`}>
                    {notification.title}
                  </div>
                  <div className="text-sm text-text-secondary">{notification.message}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {new Date(notification.time).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;