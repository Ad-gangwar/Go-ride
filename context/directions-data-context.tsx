'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Route {
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

interface DirectionsData {
  distance: number;
  duration: number;
  routes: Route[];
}

interface DirectionsDataContextType {
  directionsData: DirectionsData | null;
  setDirectionsData: (data: DirectionsData | null) => void;
}

export const DirectionsDataContext = createContext<DirectionsDataContextType>({
  directionsData: null,
  setDirectionsData: () => {},
});

export const DirectionsDataProvider = ({ children }: { children: ReactNode }) => {
  const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);

  return (
    <DirectionsDataContext.Provider value={{ directionsData, setDirectionsData }}>
      {children}
    </DirectionsDataContext.Provider>
  );
};

export const useDirectionsData = () => useContext(DirectionsDataContext); 