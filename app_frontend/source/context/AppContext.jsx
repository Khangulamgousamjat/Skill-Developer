import React, { createContext, useContext } from 'react';
import { useAppLogic } from '../hooks/useAppLogic';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const logic = useAppLogic();
  return (
    <AppContext.Provider value={logic}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

