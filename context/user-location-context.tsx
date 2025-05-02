'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface UserLocationContextType {
  userLocation: Coordinates | null;
  setUserLocation: (location: Coordinates | null) => void;
}

export const UserLocationContext = createContext<UserLocationContextType>({
  userLocation: null,
  setUserLocation: () => {},
});

export const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          // Set default location (e.g., New York)
          setUserLocation({
            lat: 40.7128,
            lng: -74.0060,
          });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      // Set default location
      setUserLocation({
        lat: 40.7128,
        lng: -74.0060,
      });
    }
  }, []);

  return (
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => useContext(UserLocationContext); 