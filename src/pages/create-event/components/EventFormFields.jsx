import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EventFormFields = ({ formData, handleInputChange, errors, onSubmit }) => {
  // Helper function to handle date picker changes
  const handleDateChange = (date, fieldName) => {
    const event = {
      target: {
        name: fieldName,
        value: date
      }
    };
    handleInputChange(event);
  };

  // Format functions remain the same
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
            <div className={`relative ${errors.startDate ? 'border-error' : ''}`}>
              <DatePicker
                selected={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date) => handleDateChange(date, 'startDate')}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                placeholderText="Select start date"
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Icon name="Calendar" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
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
            <div className={`relative ${errors.startTime ? 'border-error' : ''}`}>
              <DatePicker
                selected={formData.startTime ? new Date(`2000-01-01T${formData.startTime}`) : null}
                onChange={(date) => {
                  if (date) {
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    handleDateChange(`${hours}:${minutes}`, 'startTime');
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select start time"
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Icon name="Clock" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
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
            <div className={`relative ${errors.endDate ? 'border-error' : ''}`}>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => handleDateChange(date, 'endDate')}
                dateFormat="yyyy-MM-dd"
                minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                placeholderText="Select end date"
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Icon name="Calendar" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
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
            <div className={`relative ${errors.endTime ? 'border-error' : ''}`}>
              <DatePicker
                selected={formData.endTime ? new Date(`2000-01-01T${formData.endTime}`) : null}
                onChange={(date) => {
                  if (date) {
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    handleDateChange(`${hours}:${minutes}`, 'endTime');
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select end time"
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Icon name="Clock" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
            {errors.endTime && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {errors.endTime}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the form remains unchanged */}
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
    // Handle Date objects or strings for dates
    const startDateStr = startDate instanceof Date
      ? startDate.toISOString().split('T')[0]
      : startDate;
    const endDateStr = endDate instanceof Date
      ? endDate.toISOString().split('T')[0]
      : endDate;

    // If any field is missing, return
    if (!startDateStr || !startTime || !endDateStr || !endTime) return 'Invalid duration';

    const start = new Date(`${startDateStr}T${startTime}`);
    const end = new Date(`${endDateStr}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Invalid duration';

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