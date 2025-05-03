"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Booking from '@/components/Booking/booking';
import Map from '@/components/Map/google-map';

export default function BookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row  mb-12">
      <div className="w-full md:w-1/2 p-4">
        <Booking />
      </div>
      <div className="w-full md:w-1/2">
        <Map />
      </div>
    </div>
  );
} 