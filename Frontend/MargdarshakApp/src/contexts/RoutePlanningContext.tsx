import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedPlace {
  name: string;
  fullName: string;
  lat: number;
  lng: number;
}

interface RoutePlanningContextType {
  fromPlace: SelectedPlace | null;
  toPlace: SelectedPlace | null;
  setFromPlace: (place: SelectedPlace | null) => void;
  setToPlace: (place: SelectedPlace | null) => void;
  clearRoute: () => void;
}

const RoutePlanningContext = createContext<RoutePlanningContextType | undefined>(undefined);

export const RoutePlanningProvider = ({ children }: { children: ReactNode }) => {
  const [fromPlace, setFromPlace] = useState<SelectedPlace | null>(null);
  const [toPlace, setToPlace] = useState<SelectedPlace | null>(null);

  const clearRoute = () => {
    setFromPlace(null);
    setToPlace(null);
  };

  return (
    <RoutePlanningContext.Provider
      value={{
        fromPlace,
        toPlace,
        setFromPlace,
        setToPlace,
        clearRoute,
      }}
    >
      {children}
    </RoutePlanningContext.Provider>
  );
};

export const useRoutePlanning = () => {
  const context = useContext(RoutePlanningContext);
  if (!context) {
    throw new Error('useRoutePlanning must be used within RoutePlanningProvider');
  }
  return context;
};
