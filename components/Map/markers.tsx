'use client';

import { useContext } from 'react';
import { Marker } from '@react-google-maps/api';
import { DirectionsDataContext } from '@/context/directions-data-context';

export default function Markers() {
  const { directionsData } = useContext(DirectionsDataContext) ?? {};

  if (!directionsData?.routes?.[0]?.legs?.[0]) {
    return null;
  }

  const leg = directionsData.routes[0].legs[0];
  const source = { lat: parseFloat(leg.start_address.split(',')[0]), lng: parseFloat(leg.start_address.split(',')[1]) };
  const destination = { lat: parseFloat(leg.end_address.split(',')[0]), lng: parseFloat(leg.end_address.split(',')[1]) };

  return (
    <>
      <Marker position={source} />
      <Marker position={destination} />
    </>
  );
}
