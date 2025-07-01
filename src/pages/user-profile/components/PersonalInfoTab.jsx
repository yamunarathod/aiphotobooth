import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PersonalInfoTab = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    company: user.company || '',
    website: user.website || '',
    bio: user.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      setHasChanges(JSON.stringify(newData) !== JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        website: user.website || '',
        bio: user.bio || ''
      }));
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdateProfile(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      website: user.website || '',
      bio: user.bio || ''
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Icon name="User" size={20} />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Company
              </label>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="glass rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Icon name="Globe" size={20} />
            Additional Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Website
              </label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="glass rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Account ID
              </label>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-surface rounded-lg text-text-primary font-mono text-sm">
                  {user.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Copy"
                  onClick={() => navigator.clipboard.writeText(user.id)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Member Since
              </label>
              <div className="px-3 py-2 bg-surface rounded-lg text-text-primary">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Last Updated
              </label>
              <div className="px-3 py-2 bg-surface rounded-lg text-text-primary">
                {new Date(user.updatedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Account Status
              </label>
              <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                user.status === 'active' ?'bg-success/20 text-success border border-success/30' :'bg-warning/20 text-warning border border-warning/30'
              }`}>
                <Icon 
                  name={user.status === 'active' ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                  className="mr-2" 
                />
                {user.status === 'active' ? 'Active' : 'Pending Verification'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoTab;