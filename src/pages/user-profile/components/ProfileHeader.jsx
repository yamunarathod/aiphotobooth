import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileHeader = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="glass rounded-xl p-6 border border-white/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Image
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-surface ${
              user.subscriptionStatus === 'active' ? 'bg-success' : 'bg-warning'
            }`} />
            <button className="absolute inset-0 w-20 h-20 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Icon name="Camera" size={20} color="white" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="text-lg font-semibold"
                />
                <Input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                />
                <Input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
                <p className="text-text-secondary">{user.email}</p>
                {user.phone && (
                  <p className="text-text-secondary flex items-center gap-2">
                    <Icon name="Phone" size={16} />
                    {user.phone}
                  </p>
                )}
                <p className="text-sm text-text-muted flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  Member since {formatDate(user.createdAt)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                onClick={handleEditToggle}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleEditToggle}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.eventsCreated}</div>
          <div className="text-sm text-text-secondary">Events Created</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{user.stats.licensesGenerated}</div>
          <div className="text-sm text-text-secondary">Licenses Generated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{user.stats.totalTransformations}</div>
          <div className="text-sm text-text-secondary">Total Transformations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">₹{user.stats.totalSpent.toLocaleString('en-IN')}</div>
          <div className="text-sm text-text-secondary">Total Spent</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;