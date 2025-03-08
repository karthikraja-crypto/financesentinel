
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, generateDemoTransactions } from '@/utils/demoData';

interface DatasetContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  resetToDefault: () => void;
  lastUploadedFile: string | null;
  setLastUploadedFile: (fileName: string | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateDemoTransactions(100));
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);

  const resetToDefault = () => {
    setTransactions(generateDemoTransactions(100));
    setLastUploadedFile(null);
  };

  return (
    <DatasetContext.Provider value={{
      transactions,
      setTransactions,
      resetToDefault,
      lastUploadedFile,
      setLastUploadedFile
    }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
