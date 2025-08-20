import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Manager',
  description: 'Create and manage your events',
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 font-bold text-4xl text-gray-900">
          Welcome to Event Manager
        </h1>
        <p className="mb-8 text-gray-600 text-lg">
          Create and manage your events with ease
        </p>
        <a
          href="/events"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Go to Events
        </a>
      </div>
    </div>
  );
};

export default Home;
