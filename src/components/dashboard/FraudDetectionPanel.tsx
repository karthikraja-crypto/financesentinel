
import React from 'react';
import { Transaction } from '@/utils/demoData';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getRiskLevel, formatCurrency } from '@/utils/analytics';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import AnalyticsCard from './AnalyticsCard';

interface FraudDetectionPanelProps {
  transactions: Transaction[];
}

const FraudDetectionPanel: React.FC<FraudDetectionPanelProps> = ({ transactions }) => {
  // Get flagged transactions sorted by risk score (highest first)
  const flaggedTransactions = transactions
    .filter(t => t.flagged)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);
  
  const getRiskColor = (score: number): string => {
    if (score >= 90) return 'bg-red-600';
    if (score >= 80) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-yellow-500';
  };
  
  const getActionButtons = (transaction: Transaction) => (
    <div className="flex space-x-2">
      <Button 
        size="sm" 
        variant="outline"
        className="text-xs h-7 px-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Flag
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        className="text-xs h-7 px-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Approve
      </Button>
    </div>
  );
  
  return (
    <AnalyticsCard 
      title="Fraud Detection" 
      subtitle="High-risk transactions that require review"
      className="animate-slide-in animation-delay-300"
    >
      {flaggedTransactions.length > 0 ? (
        <div className="space-y-4">
          {flaggedTransactions.map(transaction => (
            <div 
              key={transaction.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 transition-all hover:border-slate-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-slate-900 text-sm">
                      {transaction.merchant}
                    </span>
                    <Badge variant="outline" className="text-xs font-normal px-1 h-5 bg-slate-100">
                      {transaction.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{transaction.description}</p>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-slate-500">Amount: </span>
                      <span className="font-medium text-slate-900">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date: </span>
                      <span className="font-medium text-slate-900">{transaction.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Category: </span>
                      <span className="font-medium text-slate-900">{transaction.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className="text-xs font-medium text-slate-500">Risk Score</span>
                    <div className="text-lg font-bold text-red-600">{transaction.riskScore}%</div>
                  </div>
                  <span className={cn(
                    "inline-block text-xs px-2 py-1 rounded-full",
                    transaction.riskScore >= 90 ? "bg-red-100 text-red-800" :
                    transaction.riskScore >= 80 ? "bg-orange-100 text-orange-800" :
                    "bg-yellow-100 text-yellow-800"
                  )}>
                    {getRiskLevel(transaction.riskScore)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Risk Level</span>
                  <span className="font-medium">{transaction.riskScore}%</span>
                </div>
                <Progress value={transaction.riskScore} className="h-1.5" indicatorClassName={getRiskColor(transaction.riskScore)} />
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Transaction ID: <span className="font-mono">{transaction.id}</span>
                </div>
                {getActionButtons(transaction)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No flagged transactions</h3>
          <p className="text-sm text-slate-500 mb-4">All of your recent transactions appear to be legitimate.</p>
          <Button size="sm" variant="outline" className="mx-auto">View all transactions</Button>
        </div>
      )}
    </AnalyticsCard>
  );
};

export default FraudDetectionPanel;
