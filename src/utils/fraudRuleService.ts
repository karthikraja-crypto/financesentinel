
import { useToast } from "@/hooks/use-toast";

export interface FraudRule {
  id: string;
  name: string;
  type: 'amount' | 'location' | 'merchant' | 'frequency';
  threshold: number;
  condition: 'greater' | 'equal' | 'less' | 'contains';
  value: string | number;
  enabled: boolean;
}

// Default rules that will be provided to all users
export const defaultRules: FraudRule[] = [
  {
    id: '1',
    name: 'High-Value Transaction',
    type: 'amount',
    threshold: 90,
    condition: 'greater',
    value: 1000,
    enabled: true
  },
  {
    id: '2',
    name: 'Foreign Transaction',
    type: 'location',
    threshold: 85,
    condition: 'contains',
    value: 'International',
    enabled: true
  },
  {
    id: '3',
    name: 'Unusual Merchant',
    type: 'merchant',
    threshold: 80,
    condition: 'contains',
    value: 'Gambling',
    enabled: true
  },
  {
    id: '4',
    name: 'Rapid Transaction Frequency',
    type: 'frequency',
    threshold: 75,
    condition: 'greater',
    value: 5,
    enabled: true
  }
];

// Save fraud rules to localStorage
export const saveFraudRules = (rules: FraudRule[]) => {
  localStorage.setItem('fraudRules', JSON.stringify(rules));
  return rules;
};

// Load fraud rules from localStorage
export const loadFraudRules = (): FraudRule[] => {
  const savedRules = localStorage.getItem('fraudRules');
  return savedRules ? JSON.parse(savedRules) : defaultRules;
};

// Get AI recommendations for fraud rules based on current settings
export const getAIRecommendations = (rules: FraudRule[]): { 
  message: string; 
  suggestedChanges: Partial<FraudRule>[];
} => {
  // In a real app, this would call an AI service
  // For demo purposes, we'll provide static recommendations
  
  const recommendations = [
    {
      message: "Consider lowering your large transaction threshold",
      suggestedChanges: [
        { id: '1', value: 800, threshold: 85 }
      ]
    },
    {
      message: "Your merchant category parameters could be expanded for better coverage",
      suggestedChanges: [
        { id: '3', value: 'Gambling,Adult,Crypto', threshold: 75 }
      ]
    },
    {
      message: "Add more location-based parameters for comprehensive risk detection",
      suggestedChanges: []
    },
    {
      message: "Increase threshold sensitivity for frequency-based transaction monitoring",
      suggestedChanges: [
        { id: '4', value: 3, threshold: 80 }
      ]
    }
  ];
  
  // Return a random recommendation
  const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
  return recommendation;
};

// Apply an AI recommendation to existing rules
export const applyRecommendation = (
  rules: FraudRule[], 
  recommendation: Partial<FraudRule>[]
): FraudRule[] => {
  return rules.map(rule => {
    const suggestedChange = recommendation.find(r => r.id === rule.id);
    if (suggestedChange) {
      return { ...rule, ...suggestedChange };
    }
    return rule;
  });
};
