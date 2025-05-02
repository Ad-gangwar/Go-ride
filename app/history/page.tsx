'use client';

import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Calendar } from 'lucide-react';

interface Booking {
  id: string;
  amount: string;
  source: string;
  destination: string;
  carType: string;
  date: string;
}

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use localStorage to simulate stored bookings
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  if (bookings.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking History</h1>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">No bookings found</p>
            <p className="text-sm text-gray-500 mt-2">Your booking history will appear here</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking History</h1>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">{new Date(booking.date).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${booking.amount}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{booking.source}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{booking.destination}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">{booking.carType}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 