import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, generateDemoTransactions } from '@/utils/demoData';
import { generateLargeDataset } from '@/utils/largeDatasetGenerator';

interface DatasetContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  resetToDefault: () => void;
  loadLargeDataset: () => void;
  lastUploadedFile: string | null;
  setLastUploadedFile: (fileName: string | null) => void;
  filterTransactionsByDate: (period: 'week' | 'month' | 'year' | 'all') => Transaction[];
  flagTransaction: (transactionId: string) => void;
  dismissAlert: (transactionId: string) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateDemoTransactions(100));
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);

  const resetToDefault = () => {
    setTransactions(generateDemoTransactions(100));
    setLastUploadedFile(null);
  };

  const loadLargeDataset = () => {
    setTransactions(generateLargeDataset(250));
    setLastUploadedFile("large-dataset.json");
  };

  const filterTransactionsByDate = (period: 'week' | 'month' | 'year' | 'all'): Transaction[] => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  };

  const flagTransaction = (transactionId: string) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === transactionId 
          ? { ...t, status: 'flagged', flagged: true } 
          : t
      )
    );
  };

  const dismissAlert = (transactionId: string) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === transactionId 
          ? { ...t, flagged: false } 
          : t
      )
    );
  };

  return (
    <DatasetContext.Provider value={{
      transactions,
      setTransactions,
      resetToDefault,
      loadLargeDataset,
      lastUploadedFile,
      setLastUploadedFile,
      filterTransactionsByDate,
      flagTransaction,
      dismissAlert
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
