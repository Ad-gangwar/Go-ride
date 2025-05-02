"use client";

import Booking from '@/components/Booking/booking';
import Map from '@/components/Map/google-map';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <Booking />
        </div>
      <div className="col-span-2">
        <Map />
      </div>
    </div>
  );
}
