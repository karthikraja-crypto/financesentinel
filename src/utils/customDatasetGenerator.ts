
import { Transaction } from './demoData';
import { CustomDatasetOptions } from '@/contexts/DatasetContext';

/**
 * Generate a customized dataset based on provided options
 * @param options Customization options for the dataset
 * @returns Array of Transaction objects
 */
export const generateCustomDataset = (options: CustomDatasetOptions): Transaction[] => {
  const {
    count = 200,
    riskLevels = { low: 50, medium: 20, high: 20, critical: 10 },
    timeRange,
    includeFlags = true
  } = options;
  
  const transactions: Transaction[] = [];
  
  // Set date range
  const endDate = timeRange?.endDate || new Date();
  const startDate = timeRange?.startDate || new Date();
  if (!timeRange?.startDate) {
    // Default to one year ago if not specified
    startDate.setFullYear(endDate.getFullYear() - 1);
  }
  
  // List of merchants
  const merchants = [
    'Amazon', 'Netflix', 'Uber', 'Starbucks', 'Apple Store', 'Walmart', 
    'Target', 'Best Buy', 'Home Depot', 'Costco', 'Whole Foods', 
    'Spotify', 'DoorDash', 'Airbnb', 'Shell', 'AT&T', 'Verizon',
    'CVS Pharmacy', 'PayPal', 'eBay', 'Southwest Airlines', 'Delta Airlines',
    'Marriott Hotels', 'GitHub', 'Microsoft', 'Google', 'Steam', 'Hulu',
    'Tesla Charging', 'Unknown Merchant', 'Foreign Vendor', 'Crypto Exchange',
    'Unverified Service', 'International Transfer', 'Cash Withdrawal', 'ATM'
  ];

  // List of categories
  const categories = [
    'Shopping', 'Entertainment', 'Transportation', 'Food & Dining', 'Technology', 
    'Retail', 'Groceries', 'Home Improvement', 'Subscription', 'Delivery', 
    'Travel', 'Utility', 'Telecommunications', 'Healthcare', 'Financial', 'Gaming',
    'Cryptocurrency', 'International', 'Cash Services', 'Unknown', 'Suspicious'
  ];
  
  // Transaction types
  const types: Array<'deposit' | 'withdrawal' | 'transfer' | 'payment'> = [
    'deposit', 'withdrawal', 'transfer', 'payment'
  ];
  
  // Status options 
  const statuses: Array<'completed' | 'pending' | 'failed' | 'flagged'> = [
    'completed', 'pending', 'failed', 'flagged'
  ];
  
  // Calculate how many transactions for each risk level
  const lowCount = Math.round(count * (riskLevels.low || 50) / 100);
  const mediumCount = Math.round(count * (riskLevels.medium || 20) / 100);
  const highCount = Math.round(count * (riskLevels.high || 20) / 100);
  const criticalCount = count - lowCount - mediumCount - highCount;
  
  // Generate transactions for each risk level
  let currentId = 0;
  
  // Low risk transactions (0-25)
  for (let i = 0; i < lowCount; i++) {
    transactions.push(generateTransactionWithRisk(currentId++, 0, 25, startDate, endDate));
  }
  
  // Medium risk transactions (26-50)
  for (let i = 0; i < mediumCount; i++) {
    transactions.push(generateTransactionWithRisk(currentId++, 26, 50, startDate, endDate));
  }
  
  // High risk transactions (51-75)
  for (let i = 0; i < highCount; i++) {
    transactions.push(generateTransactionWithRisk(currentId++, 51, 75, startDate, endDate));
  }
  
  // Critical risk transactions (76-100)
  for (let i = 0; i < criticalCount; i++) {
    transactions.push(generateTransactionWithRisk(currentId++, 76, 100, startDate, endDate));
  }
  
  // Helper function to generate a transaction with a risk score in a given range
  function generateTransactionWithRisk(id: number, minRisk: number, maxRisk: number, startDate: Date, endDate: Date): Transaction {
    // Generate random date within range
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    
    // Generate risk score within provided range
    const riskScore = minRisk + Math.floor(Math.random() * (maxRisk - minRisk + 1));
    
    // Higher risk may have suspicious merchant and unusual amount
    const isForeignMerchant = riskScore > 60 && Math.random() > 0.7;
    const isUnusualAmount = riskScore > 70 && Math.random() > 0.6;
    
    // Generate amount
    let amount: number;
    if (isUnusualAmount) {
      amount = Math.round(Math.random() * 10000 * 100) / 100; // Unusual high amount
    } else {
      amount = Math.round(Math.random() * 1000 * 100) / 100; // Normal amount
    }
    
    // Select merchant
    const merchantIndex = isForeignMerchant 
      ? Math.floor(Math.random() * 6) + 30 // Select from suspicious merchants
      : Math.floor(Math.random() * 30);    // Select from normal merchants
    
    const merchant = merchants[merchantIndex];
    
    // Select category
    const categoryIndex = riskScore > 70
      ? Math.floor(Math.random() * 6) + 15 // Select from suspicious categories
      : Math.floor(Math.random() * 15);    // Select from normal categories
    
    const category = categories[categoryIndex];
    
    // Transaction type
    const typeIndex = riskScore > 75
      ? Math.floor(Math.random() * 2) + 1 // Higher chance of withdrawal or transfer for high risk
      : Math.floor(Math.random() * 4);
    
    const type = types[typeIndex];
    
    // Status
    let status: 'completed' | 'pending' | 'failed' | 'flagged';
    if (includeFlags && riskScore > 70 && Math.random() > 0.5) {
      status = 'flagged';
    } else if (riskScore > 50 && Math.random() > 0.7) {
      status = 'pending';
    } else if (riskScore > 40 && Math.random() > 0.8) {
      status = 'failed';
    } else {
      status = 'completed';
    }
    
    // Create transaction
    return {
      id: `TX-${id.toString().padStart(6, '0')}`,
      date: randomDate.toISOString().split('T')[0],
      amount,
      type,
      status,
      merchant,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${merchant}`,
      category,
      riskScore,
      flagged: includeFlags && (riskScore > 70 || status === 'flagged')
    };
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
