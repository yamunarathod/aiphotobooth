import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EventTable = ({ events, onViewDetails, onDownloadLicense, onEditEvent, isLoading }) => {
  const [sortField, setSortField] = useState('eventDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'completed':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'cancelled':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-text-secondary/20 text-text-secondary border-text-secondary/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'eventDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-text-secondary/50'}`} 
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-text-secondary/50'} -mt-1`} 
          />
        </div>
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="glass rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Styles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-skeleton">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-white/10 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-white/10 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-white/10 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="h-8 bg-white/10 rounded w-8"></div>
                      <div className="h-8 bg-white/10 rounded w-8"></div>
                      <div className="h-8 bg-white/10 rounded w-8"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="glass rounded-lg border border-white/20 p-12 text-center">
        <Icon name="Calendar" size={48} className="mx-auto text-text-secondary mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Events Found</h3>
        <p className="text-text-secondary mb-6">
          No events match your current filters. Try adjusting your search criteria.
        </p>
        <Button variant="primary" iconName="Plus" iconPosition="left">
          Create New Event
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg border border-white/20 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <SortableHeader field="eventName">Event</SortableHeader>
              <SortableHeader field="eventDate">Date & Time</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Styles
              </th>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedEvents.map((event) => (
              <tr key={event.id} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{event.eventName}</div>
                    <div className="text-sm text-text-secondary">{event.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-text-primary">{formatDate(event.eventDate)}</div>
                    <div className="text-sm text-text-secondary">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {event.selectedStyles.slice(0, 3).map((style, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={style.thumbnail}
                          alt={style.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                      </div>
                    ))}
                    {event.selectedStyles.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-text-secondary">+{event.selectedStyles.length - 3}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetails(event)}
                      iconName="Eye"
                      className="p-2"
                      title="View Details"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => onDownloadLicense(event)}
                      iconName="Download"
                      className="p-2"
                      title="Download License"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => onEditEvent(event)}
                      iconName="Edit"
                      className="p-2"
                      title="Edit Event"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="glass-interactive rounded-lg p-4 border border-white/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-primary">{event.eventName}</h3>
                <p className="text-xs text-text-secondary">{event.location}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-text-secondary">Date:</span>
                <div className="text-text-primary">{formatDate(event.eventDate)}</div>
              </div>
              <div>
                <span className="text-text-secondary">Time:</span>
                <div className="text-text-primary">{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {event.selectedStyles.slice(0, 3).map((style, index) => (
                  <Image
                    key={index}
                    src={style.thumbnail}
                    alt={style.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                ))}
                {event.selectedStyles.length > 3 && (
                  <span className="text-xs text-text-secondary">+{event.selectedStyles.length - 3}</span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  onClick={() => onViewDetails(event)}
                  iconName="Eye"
                  className="p-2"
                />
                <Button
                  variant="ghost"
                  onClick={() => onDownloadLicense(event)}
                  iconName="Download"
                  className="p-2"
                />
                <Button
                  variant="ghost"
                  onClick={() => onEditEvent(event)}
                  iconName="Edit"
                  className="p-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTable;