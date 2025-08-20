'use client';

import { Calendar, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Event {
  id: number;
  name: string;
  date: string;
}

interface FormErrors {
  eventName?: string;
  eventDate?: string;
}

const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Failed to load events from localStorage:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (eventDate) {
      const selectedDate = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      }
    } else {
      newErrors.eventDate = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [eventName, eventDate]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newEvent: Event = {
        id: Date.now(),
        name: eventName.trim(),
        date: eventDate,
      };

      setEvents((prev) => [...prev, newEvent]);
      setEventName('');
      setEventDate('');
      setErrors({});
      setIsSubmitting(false);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    [eventName, eventDate, validateForm]
  );

  const deleteEvent = useCallback((id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mb-2 font-bold text-3xl text-gray-900">
            Event Manager
          </h1>
          <p className="text-gray-600">Create and manage your events</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-medium text-green-800 text-sm">
              Event added successfully!
            </p>
          </div>
        )}

        {/* Add Event Form */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center font-semibold text-gray-900 text-xl">
            <Plus className="mr-2 h-5 w-5 text-blue-600" />
            Add New Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="eventName"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.eventName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter event name"
                aria-describedby={
                  errors.eventName ? 'eventName-error' : undefined
                }
                disabled={isSubmitting}
              />
              {errors.eventName && (
                <p id="eventName-error" className="mt-1 text-red-600 text-sm">
                  {errors.eventName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                Event Date *
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={getMinDate()}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.eventDate ? 'border-red-300' : 'border-gray-300'
                }`}
                aria-describedby={
                  errors.eventDate ? 'eventDate-error' : undefined
                }
                disabled={isSubmitting}
              />
              {errors.eventDate && (
                <p id="eventDate-error" className="mt-1 text-red-600 text-sm">
                  {errors.eventDate}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Adding Event...' : 'Add Event'}
            </button>
          </form>
        </div>

        {/* Search Box */}
        {events.length > 0 && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                aria-label="Search events"
              />
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-gray-200 border-b p-6">
            <h2 className="font-semibold text-gray-900 text-xl">
              Events ({filteredEvents.length})
            </h2>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500 text-lg">
                {events.length === 0
                  ? 'No events yet'
                  : 'No events match your search'}
              </p>
              <p className="mt-2 text-gray-400 text-sm">
                {events.length === 0
                  ? 'Add your first event using the form above'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-gray-900">
                      {event.name}
                    </h3>
                    <p className="flex items-center text-gray-500 text-sm">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    className="group ml-4 rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete event: ${event.name}`}
                    title={`Delete event: ${event.name}`}
                  >
                    <Trash2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {events.length > 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Total events: {events.length} | Showing: {filteredEvents.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManager;
