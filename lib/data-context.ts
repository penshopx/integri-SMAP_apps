// lib/data-context.ts
import { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of your context data
interface DataContextType {
  data: any;
  setData: (data: any) => void;
}

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Export the provider component separately in a .tsx file
// This file should only contain the non-JSX logic and types