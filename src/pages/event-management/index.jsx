import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import EventFilters from './components/EventFilters';
import EventTable from './components/EventTable';
import EventSummaryStats from './components/EventSummaryStats';
import EventDetailsModal from './components/EventDetailsModal';

import Button from '../../components/ui/Button';
import { supabase } from '../../utils/supabase';

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    statusFilter: 'all',
    styleFilter: 'all'
  });

  // Mock subscription info
  const subscriptionInfo = {
    plan: 'Professional',
    transformationsUsed: 245,
    transformationsLimit: 1000,
    availableStyles: 3,
    nextBilling: '2024-02-15',
    monthlyAmount: 149
  };


  

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('eventDetails')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) throw error;

        setEvents(data || []);
        setFilteredEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDate);
        
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return eventDate >= weekStart && eventDate <= weekEnd;
          case 'month':
            return eventDate.getMonth() === today.getMonth() && 
                   eventDate.getFullYear() === today.getFullYear();
          case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            const eventQuarter = Math.floor(eventDate.getMonth() / 3);
            return eventQuarter === quarter && 
                   eventDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }

    // Apply status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === filters.statusFilter);
    }

    // Apply style filter
    if (filters.styleFilter !== 'all') {
      filtered = filtered.filter(event =>
        event.selectedStyles.some(style =>
          style.name.toLowerCase().includes(filters.styleFilter.toLowerCase()) ||
          style.category.toLowerCase().includes(filters.styleFilter.toLowerCase())
        )
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleDownloadLicense = async (event) => {
    try {
      // Simulate license generation and download
      const licenseData = {
        eventId: event.id,
        eventName: event.eventName,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        selectedStyles: event.selectedStyles.map(style => style.name),
        licenseId: event.licenseId,
        generatedAt: new Date().toISOString(),
        validUntil: event.licenseExpiry
      };

      // Create JWT token (mock implementation)
      const token = btoa(JSON.stringify(licenseData));
      
      // Create downloadable file
      const blob = new Blob([token], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event.licenseId}.lic`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('License downloaded:', event.licenseId);
    } catch (error) {
      console.error('Error downloading license:', error);
    }
  };

  const handleEditEvent = (event) => {
    console.log('Edit event:', event.id);
    // Navigate to edit event page or open edit modal
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Event Management</h1>
              <p className="text-text-secondary">
                Manage your photobooth events, download licenses, and track performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="primary"
                onClick={handleCreateEvent}
                iconName="Plus"
                iconPosition="left"
                className="gradient-border"
              >
                Create New Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <EventFilters
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                totalEvents={events.length}
                filteredEvents={filteredEvents.length}
              />

              <EventTable
                events={filteredEvents}
                onViewDetails={handleViewDetails}
                onDownloadLicense={handleDownloadLicense}
                onEditEvent={handleEditEvent}
                isLoading={isLoading}
              />
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <EventSummaryStats
                stats={stats}
                subscriptionInfo={subscriptionInfo}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
        onDownloadLicense={handleDownloadLicense}
        onEditEvent={handleEditEvent}
      />
    </div>
  );
};

export default EventManagement;