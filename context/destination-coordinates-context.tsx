'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DestinationCoordinatesContextType {
  destinationCoordinates: Coordinates | null;
  setDestinationCoordinates: (coordinates: Coordinates | null) => void;
}

export const DestinationCoordinatesContext = createContext<DestinationCoordinatesContextType>({
  destinationCoordinates: null,
  setDestinationCoordinates: () => {},
});

export const DestinationCoordinatesProvider = ({ children }: { children: ReactNode }) => {
  const [destinationCoordinates, setDestinationCoordinates] = useState<Coordinates | null>(null);

  return (
    <DestinationCoordinatesContext.Provider value={{ destinationCoordinates, setDestinationCoordinates }}>
      {children}
    </DestinationCoordinatesContext.Provider>
  );
};

export const useDestinationCoordinates = () => useContext(DestinationCoordinatesContext); 