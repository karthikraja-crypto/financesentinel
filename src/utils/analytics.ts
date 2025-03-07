import { Transaction } from './demoData';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-slate-100 text-slate-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-100 text-green-800';
    case 'withdrawal':
      return 'bg-red-100 text-red-800';
    case 'payment':
      return 'bg-blue-100 text-blue-800';
    case 'transfer':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export const getRiskLevel = (riskScore: number) => {
  if (riskScore > 75) {
    return 'Critical';
  } else if (riskScore > 50) {
    return 'High';
  } else if (riskScore > 25) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

export const getRiskColor = (riskScore: number) => {
  if (riskScore > 75) {
    return 'text-red-600';
  } else if (riskScore > 50) {
    return 'text-orange-600';
  } else if (riskScore > 25) {
    return 'text-yellow-600';
  } else {
    return 'text-green-600';
  }
};
