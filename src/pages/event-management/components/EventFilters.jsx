import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EventFilters = ({ onFilterChange, onSearch, totalEvents, filteredEvents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const styleOptions = [
    { value: 'all', label: 'All Styles' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'modern', label: 'Modern' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'classic', label: 'Classic' },
    { value: 'fantasy', label: 'Fantasy' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const filters = { dateRange, statusFilter, styleFilter };
    
    switch (filterType) {
      case 'date':
        setDateRange(value);
        filters.dateRange = value;
        break;
      case 'status':
        setStatusFilter(value);
        filters.statusFilter = value;
        break;
      case 'style':
        setStyleFilter(value);
        filters.styleFilter = value;
        break;
    }
    
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateRange('all');
    setStatusFilter('all');
    setStyleFilter('all');
    onSearch('');
    onFilterChange({ dateRange: 'all', statusFilter: 'all', styleFilter: 'all' });
  };

  const hasActiveFilters = searchTerm || dateRange !== 'all' || statusFilter !== 'all' || styleFilter !== 'all';

  return (
    <div className="glass rounded-lg border border-white/20 p-4 mb-6">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <Input
              type="search"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Results Count */}
          <div className="text-sm text-text-secondary">
            {filteredEvents} of {totalEvents} events
          </div>

          {/* Expand/Collapse Filters */}
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="text-sm"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Art Style
              </label>
              <select
                value={styleFilter}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {styleOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="Filter" size={16} />
                <span>Active filters applied</span>
              </div>
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                className="text-sm"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventFilters;