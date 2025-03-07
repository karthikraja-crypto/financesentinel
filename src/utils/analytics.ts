
import { Transaction } from './demoData';

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage values
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Calculate percentage change between two values
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

// Get risk level text based on risk score
export const getRiskLevel = (score: number): string => {
  if (score < 20) return 'Low';
  if (score < 50) return 'Medium';
  if (score < 80) return 'High';
  return 'Critical';
};

// Get color based on risk score
export const getRiskColor = (score: number): string => {
  if (score < 20) return 'bg-green-100 text-green-800';
  if (score < 50) return 'bg-yellow-100 text-yellow-800';
  if (score < 80) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get transaction type badge color
export const getTransactionTypeColor = (type: string): string => {
  switch (type) {
    case 'deposit':
      return 'bg-emerald-100 text-emerald-800';
    case 'withdrawal':
      return 'bg-blue-100 text-blue-800';
    case 'transfer':
      return 'bg-purple-100 text-purple-800';
    case 'payment':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Sort transactions by date (newest first)
export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] => {
  return transactions.filter((transaction) => {
    return transaction.date >= startDate && transaction.date <= endDate;
  });
};

// Filter transactions by amount range
export const filterTransactionsByAmountRange = (
  transactions: Transaction[],
  minAmount: number,
  maxAmount: number
): Transaction[] => {
  return transactions.filter((transaction) => {
    return transaction.amount >= minAmount && transaction.amount <= maxAmount;
  });
};

// Filter transactions by type
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: string
): Transaction[] => {
  if (!type || type === 'all') return transactions;
  return transactions.filter((transaction) => transaction.type === type);
};

// Filter transactions by risk score range
export const filterTransactionsByRiskScore = (
  transactions: Transaction[],
  minScore: number,
  maxScore: number
): Transaction[] => {
  return transactions.filter((transaction) => {
    return transaction.riskScore >= minScore && transaction.riskScore <= maxScore;
  });
};

// Get flagged transactions
export const getFlaggedTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter((transaction) => transaction.flagged);
};

// Get top merchants by transaction count
export const getTopMerchantsByCount = (
  transactions: Transaction[],
  limit: number = 5
): { merchant: string; count: number }[] => {
  const merchantCounts: Record<string, number> = {};
  
  transactions.forEach((transaction) => {
    const { merchant } = transaction;
    merchantCounts[merchant] = (merchantCounts[merchant] || 0) + 1;
  });
  
  return Object.entries(merchantCounts)
    .map(([merchant, count]) => ({ merchant, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Get top merchants by transaction amount
export const getTopMerchantsByAmount = (
  transactions: Transaction[],
  limit: number = 5
): { merchant: string; amount: number }[] => {
  const merchantAmounts: Record<string, number> = {};
  
  transactions.forEach((transaction) => {
    const { merchant, amount } = transaction;
    merchantAmounts[merchant] = (merchantAmounts[merchant] || 0) + amount;
  });
  
  return Object.entries(merchantAmounts)
    .map(([merchant, amount]) => ({ merchant, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

// Get transaction counts by category
export const getTransactionsByCategory = (
  transactions: Transaction[]
): { category: string; count: number; amount: number }[] => {
  const categoryData: Record<string, { count: number; amount: number }> = {};
  
  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (!categoryData[category]) {
      categoryData[category] = { count: 0, amount: 0 };
    }
    categoryData[category].count += 1;
    categoryData[category].amount += amount;
  });
  
  return Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      count: data.count,
      amount: data.amount
    }))
    .sort((a, b) => b.count - a.count);
};
