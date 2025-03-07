
// Demo transaction data for the financial analytics dashboard

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  status: 'completed' | 'pending' | 'failed';
  merchant: string;
  description: string;
  category: string;
  riskScore: number;
  flagged: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  totalInflow: number;
  totalOutflow: number;
  transactionsCount: number;
  flaggedTransactions: number;
  averageTransactionAmount: number;
}

// Generate random date within the last 30 days
const randomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

// Generate random amount between min and max
const randomAmount = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Generate random transaction type
const transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment'] as const;
const randomType = (): 'deposit' | 'withdrawal' | 'transfer' | 'payment' => {
  return transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
};

// Generate random status
const statuses = ['completed', 'pending', 'failed'] as const;
const randomStatus = (): 'completed' | 'pending' | 'failed' => {
  const weights = [0.85, 0.1, 0.05]; // 85% completed, 10% pending, 5% failed
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  return 'completed';
};

// Generate random risk score between 0 and 100
const randomRiskScore = (): number => {
  // Most transactions should be low risk
  const random = Math.random();
  if (random < 0.8) {
    return Math.floor(Math.random() * 20); // 0-19
  } else if (random < 0.95) {
    return 20 + Math.floor(Math.random() * 50); // 20-69
  } else {
    return 70 + Math.floor(Math.random() * 31); // 70-100
  }
};

// List of merchants
const merchants = [
  'Amazon', 'Netflix', 'Uber', 'Starbucks', 'Apple Store', 'Walmart', 
  'Target', 'Best Buy', 'Home Depot', 'Costco', 'Whole Foods', 
  'Spotify', 'DoorDash', 'Airbnb', 'Shell', 'AT&T', 'Verizon',
  'CVS Pharmacy', 'PayPal', 'eBay', 'Southwest Airlines', 'Delta Airlines',
  'Marriott Hotels', 'GitHub', 'Microsoft', 'Google', 'Steam', 'Hulu'
];

// List of categories
const categories = [
  'Shopping', 'Entertainment', 'Transportation', 'Food & Dining', 'Technology', 
  'Retail', 'Groceries', 'Home Improvement', 'Subscription', 'Delivery', 
  'Travel', 'Utility', 'Telecommunications', 'Healthcare', 'Financial', 'Gaming'
];

// Generate a random merchant
const randomMerchant = (): string => {
  return merchants[Math.floor(Math.random() * merchants.length)];
};

// Generate a random category
const randomCategory = (): string => {
  return categories[Math.floor(Math.random() * categories.length)];
};

// Generate a random transaction
const generateTransaction = (id: number): Transaction => {
  const type = randomType();
  const merchant = randomMerchant();
  const category = randomCategory();
  const riskScore = randomRiskScore();
  const flagged = riskScore > 70;
  
  return {
    id: `TRANS-${id.toString().padStart(5, '0')}`,
    date: randomDate(),
    amount: randomAmount(5, 1000),
    type,
    status: randomStatus(),
    merchant,
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${merchant}`,
    category,
    riskScore,
    flagged
  };
};

// Generate 100 random transactions
export const generateDemoTransactions = (count: number = 100): Transaction[] => {
  return Array.from({ length: count }, (_, i) => generateTransaction(i + 1));
};

// Calculate account summary
export const calculateAccountSummary = (transactions: Transaction[]): AccountSummary => {
  const totalInflow = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutflow = transactions
    .filter(t => ['withdrawal', 'payment'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const flaggedTransactions = transactions.filter(t => t.flagged).length;
  
  return {
    totalBalance: parseFloat((totalInflow - totalOutflow).toFixed(2)),
    totalInflow: parseFloat(totalInflow.toFixed(2)),
    totalOutflow: parseFloat(totalOutflow.toFixed(2)),
    transactionsCount: transactions.length,
    flaggedTransactions,
    averageTransactionAmount: parseFloat((transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2))
  };
};

// Generate daily transaction totals for the last 30 days
export const generateDailyTotals = (transactions: Transaction[]) => {
  const now = new Date();
  const result = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dailyTransactions = transactions.filter(t => t.date === dateString);
    const inflow = dailyTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const outflow = dailyTransactions
      .filter(t => ['withdrawal', 'payment'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    
    result.push({
      date: dateString,
      inflow: parseFloat(inflow.toFixed(2)),
      outflow: parseFloat(outflow.toFixed(2)),
      net: parseFloat((inflow - outflow).toFixed(2)),
      count: dailyTransactions.length
    });
  }
  
  return result;
};

// Generate transaction counts by type
export const generateTransactionsByType = (transactions: Transaction[]) => {
  const types = ['deposit', 'withdrawal', 'transfer', 'payment'];
  return types.map(type => ({
    type,
    count: transactions.filter(t => t.type === type).length,
    total: parseFloat(transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2))
  }));
};

// Generate risk score distribution
export const generateRiskDistribution = (transactions: Transaction[]) => {
  return [
    { range: '0-20', count: transactions.filter(t => t.riskScore >= 0 && t.riskScore < 20).length },
    { range: '20-40', count: transactions.filter(t => t.riskScore >= 20 && t.riskScore < 40).length },
    { range: '40-60', count: transactions.filter(t => t.riskScore >= 40 && t.riskScore < 60).length },
    { range: '60-80', count: transactions.filter(t => t.riskScore >= 60 && t.riskScore < 80).length },
    { range: '80-100', count: transactions.filter(t => t.riskScore >= 80 && t.riskScore <= 100).length }
  ];
};
