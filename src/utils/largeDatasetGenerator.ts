
import { Transaction } from './demoData';

/**
 * Generate a large dataset of transactions with diverse risk levels and dates within the past year
 * @param count Number of transactions to generate (default: 250)
 * @returns Array of Transaction objects
 */
export const generateLargeDataset = (count: number = 250): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
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
  
  // Generate transactions with varied risk levels
  for (let i = 0; i < count; i++) {
    // Generate random date within the past year
    const randomDate = new Date(
      oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())
    );
    
    // Generate risk score based on distribution
    // We'll ensure there are enough transactions in each risk category
    let riskScore: number;
    
    if (i < count * 0.5) {
      // 50% Low risk (0-25)
      riskScore = Math.floor(Math.random() * 26);
    } else if (i < count * 0.7) {
      // 20% Medium risk (26-50)
      riskScore = 26 + Math.floor(Math.random() * 25);
    } else if (i < count * 0.9) {
      // 20% High risk (51-75)
      riskScore = 51 + Math.floor(Math.random() * 25);
    } else {
      // 10% Critical risk (76-100)
      riskScore = 76 + Math.floor(Math.random() * 25);
    }
    
    // Calculate suspicious factors for high-risk transactions
    const isForeignMerchant = riskScore > 60 && Math.random() > 0.7;
    const isUnusualAmount = riskScore > 70 && Math.random() > 0.6;
    
    // Generate amount (higher risk may have unusual amounts)
    let amount: number;
    if (isUnusualAmount) {
      amount = Math.round(Math.random() * 10000 * 100) / 100; // Unusual high amount
    } else {
      amount = Math.round(Math.random() * 1000 * 100) / 100; // Normal amount
    }
    
    // Select merchant (higher risk may have suspicious merchants)
    const merchantIndex = isForeignMerchant 
      ? Math.floor(Math.random() * 6) + 30 // Select from suspicious merchants
      : Math.floor(Math.random() * 30);    // Select from normal merchants
    
    const merchant = merchants[merchantIndex];
    
    // Select category (higher risk may have suspicious categories)
    const categoryIndex = riskScore > 70
      ? Math.floor(Math.random() * 6) + 15 // Select from suspicious categories
      : Math.floor(Math.random() * 15);    // Select from normal categories
    
    const category = categories[categoryIndex];
    
    // Transaction type (weighted by risk)
    const typeIndex = riskScore > 75
      ? Math.floor(Math.random() * 2) + 1 // Higher chance of withdrawal or transfer for high risk
      : Math.floor(Math.random() * 4);
    
    const type = types[typeIndex];
    
    // Status (higher risk may be flagged)
    let status: 'completed' | 'pending' | 'failed' | 'flagged';
    if (riskScore > 70 && Math.random() > 0.5) {
      status = 'flagged';
    } else if (riskScore > 50 && Math.random() > 0.7) {
      status = 'pending';
    } else if (riskScore > 40 && Math.random() > 0.8) {
      status = 'failed';
    } else {
      status = 'completed';
    }
    
    // Create transaction
    const transaction: Transaction = {
      id: `TX-${i.toString().padStart(6, '0')}`,
      date: randomDate.toISOString().split('T')[0],
      amount,
      type,
      status,
      merchant,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${merchant}`,
      category,
      riskScore,
      flagged: riskScore > 70 || status === 'flagged'
    };
    
    transactions.push(transaction);
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
