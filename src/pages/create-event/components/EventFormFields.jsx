import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EventFormFields = ({ formData, handleInputChange, errors, onSubmit }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Name *
        </label>
        <Input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
          placeholder="Enter event name (e.g., Wedding Reception, Birthday Party)"
          required
          className={errors.eventName ? 'border-error' : ''}
        />
        {errors.eventName && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-1" />
            {errors.eventName}
          </p>
        )}
      </div>

      {/* Date and Time Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date & Time */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Start Date *
            </label>
            <Input
              type="date"
              name="startDate"
              value={formatDateForInput(formData.startDate)}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={errors.startDate ? 'border-error' : ''}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {errors.startDate}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Start Time *
            </label>
            <Input
              type="time"
              name="startTime"
              value={formatTimeForInput(formData.startTime)}
              onChange={handleInputChange}
              required
              className={errors.startTime ? 'border-error' : ''}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {errors.startTime}
              </p>
            )}
          </div>
        </div>

        {/* End Date & Time */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              End Date *
            </label>
            <Input
              type="date"
              name="endDate"
              value={formatDateForInput(formData.endDate)}
              onChange={handleInputChange}
              required
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className={errors.endDate ? 'border-error' : ''}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {errors.endDate}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              End Time *
            </label>
            <Input
              type="time"
              name="endTime"
              value={formatTimeForInput(formData.endTime)}
              onChange={handleInputChange}
              required
              className={errors.endTime ? 'border-error' : ''}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {errors.endTime}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event Location */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Location
        </label>
        <Input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Enter venue address or location"
          className={errors.location ? 'border-error' : ''}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-1" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Event Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief description of the event (optional)"
          rows={3}
          className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {/* Duration Info */}
      <div className="glass rounded-lg p-4 border border-white/20">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Clock" size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">Event Duration</span>
        </div>
        <p className="text-sm text-text-secondary">
          {formData.startDate && formData.endDate && formData.startTime && formData.endTime ? (
            `Duration: ${calculateDuration(formData.startDate, formData.startTime, formData.endDate, formData.endTime)}`
          ) : (
            'Please fill in all date and time fields to see duration'
          )}
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

const calculateDuration = (startDate, startTime, endDate, endTime) => {
  try {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end - start;
    
    if (diffMs <= 0) return 'Invalid duration';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
      return `${diffMinutes} minutes`;
    } else if (diffMinutes === 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ${diffMinutes} minutes`;
    }
  } catch (error) {
    return 'Invalid duration';
  }
};

export default EventFormFields;