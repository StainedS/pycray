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

  const getMinDate = useCallback((): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

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
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const newEvent: Event = {
          id: Date.now(),
          name: eventName.trim(),
          date: eventDate,
        };

        setEvents((prev) => [newEvent, ...prev]);
        setEventName('');
        setEventDate('');
        setErrors({});
        setShowSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to add event:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [eventName, eventDate, validateForm]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  const deleteEvent = useCallback((id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

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

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return events;
    }
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

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
          <h2 className="mb-4 font-semibold text-gray-900 text-lg">
            Add New Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="eventName"
                className="block font-medium text-gray-700 text-sm"
              >
                Event Name
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
                className="block font-medium text-gray-700 text-sm"
              >
                Event Date
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
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search and Events List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-gray-200 border-b p-6">
            <h2 className="mb-4 font-semibold text-gray-900 text-lg">
              Your Events
            </h2>

            {/* Search Box */}
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
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

          {/* Events List */}
          <div className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  {searchTerm
                    ? 'No events found matching your search.'
                    : 'No events yet. Add your first event above!'}
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-6"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <p className="text-gray-500 text-sm">
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
                    <Trash2 className="h-4 w-4 group-hover:text-red-700" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
