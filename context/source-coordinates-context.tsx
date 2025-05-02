'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SourceCoordinatesContextType {
  sourceCoordinates: Coordinates | null;
  setSourceCoordinates: (coordinates: Coordinates | null) => void;
}

export const SourceCoordinatesContext = createContext<SourceCoordinatesContextType>({
  sourceCoordinates: null,
  setSourceCoordinates: () => {},
});

export const SourceCoordinatesProvider = ({ children }: { children: ReactNode }) => {
  const [sourceCoordinates, setSourceCoordinates] = useState<Coordinates | null>(null);

  return (
    <SourceCoordinatesContext.Provider value={{ sourceCoordinates, setSourceCoordinates }}>
      {children}
    </SourceCoordinatesContext.Provider>
  );
};

export const useSourceCoordinates = () => useContext(SourceCoordinatesContext); 