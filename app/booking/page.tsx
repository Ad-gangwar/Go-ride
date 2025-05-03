"use client";

import Booking from '@/components/Booking/booking';
import Map from '@/components/Map/google-map';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function RideBooking() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-lg">
        <p className="mb-4 text-2xl">Please log in to start booking</p>
        <Link href="/login" className="px-6 py-3 bg-yellow-500 rounded-md text-xl font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
      <div className="h-full">
        <Booking />
      </div>
      <div className="col-span-2 h-full">
        <Map />
      </div>
    </div>
  );
} 