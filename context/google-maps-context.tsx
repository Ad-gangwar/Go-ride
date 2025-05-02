'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

export const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
});

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries,
    version: 'weekly'
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError: loadError || null }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext); 