import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecurityTab = ({ user, onUpdateSecurity }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: '2024-01-15T10:30:00Z',
      current: true,
      ip: '192.168.1.1'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Mumbai, India',
      lastActive: '2024-01-14T18:45:00Z',
      current: false,
      ip: '192.168.1.2'
    },
    {
      id: 3,
      device: 'Chrome on Android',
      location: 'Delhi, India',
      lastActive: '2024-01-13T14:20:00Z',
      current: false,
      ip: '192.168.1.3'
    }
  ];

  const securitySettings = [
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: user.security?.twoFactorEnabled || false,
      icon: 'Shield'
    },
    {
      id: 'emailNotifications',
      title: 'Email Security Notifications',
      description: 'Get notified about security events via email',
      enabled: user.security?.emailNotifications || true,
      icon: 'Mail'
    },
    {
      id: 'loginAlerts',
      title: 'Login Alerts',
      description: 'Get alerts for new device logins',
      enabled: user.security?.loginAlerts || true,
      icon: 'AlertTriangle'
    }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateSecurity({
        type: 'password',
        data: passwordData
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSecurityToggle = async (settingId, enabled) => {
    try {
      await onUpdateSecurity({
        type: 'setting',
        data: { [settingId]: enabled }
      });
    } catch (error) {
      console.error('Error updating security setting:', error);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await onUpdateSecurity({
        type: 'terminateSession',
        data: { sessionId }
      });
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('Safari')) return 'Smartphone';
    if (device.includes('Android')) return 'Smartphone';
    if (device.includes('Chrome') || device.includes('Firefox')) return 'Monitor';
    return 'Globe';
  };

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Lock" size={20} />
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showPasswords.current ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showPasswords.new ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showPasswords.confirm ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon name={setting.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">{setting.title}</div>
                  <div className="text-sm text-text-secondary">{setting.description}</div>
                </div>
              </div>
              <button
                onClick={() => handleSecurityToggle(setting.id, !setting.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.enabled ? 'bg-primary' : 'bg-surface-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Monitor" size={20} />
            Active Sessions
          </h3>
          <Button
            variant="outline"
            size="sm"
            iconName="LogOut"
            iconPosition="left"
            onClick={() => handleTerminateSession('all')}
          >
            Sign Out All
          </Button>
        </div>
        
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Icon name={getDeviceIcon(session.device)} size={20} className="text-accent" />
                </div>
                <div>
                  <div className="font-medium text-text-primary flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {session.location} • {formatLastActive(session.lastActive)}
                  </div>
                  <div className="text-xs text-text-muted">IP: {session.ip}</div>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => handleTerminateSession(session.id)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="glass rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-error/30 rounded-lg bg-error/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Delete Account</div>
                <div className="text-sm text-text-secondary">
                  Permanently delete your account and all associated data
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => console.log('Delete account clicked')}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;