
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  // Conversion rate (1 USD = 83 INR approximately)
  const conversionRate = 83;

  const convertAmount = (amount: number): number => {
    return currency === 'USD' ? amount : amount * conversionRate;
  };

  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(convertedAmount);
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(convertedAmount);
    }
  };

  const value = {
    currency,
    setCurrency,
    formatAmount,
    convertAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
