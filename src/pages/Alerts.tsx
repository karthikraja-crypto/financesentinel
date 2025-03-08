
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AlertTriangle, ShieldAlert, Flag, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/analytics';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useDataset } from '@/contexts/DatasetContext';

const Alerts = () => {
  const { transactions, flagTransaction, dismissAlert } = useDataset();
  const alertTransactions = transactions
    .filter(t => t.flagged && t.status !== 'flagged') // Show only potential frauds, not already flagged
    .sort((a, b) => b.riskScore - a.riskScore);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleFlagTransaction = (transactionId: string) => {
    flagTransaction(transactionId);
    
    toast({
      title: "Transaction Flagged",
      description: `Transaction ${transactionId} has been marked as fraudulent.`,
    });
  };
  
  const handleDismissAlert = (transactionId: string) => {
    dismissAlert(transactionId);
    
    toast({
      title: "Alert Dismissed",
      description: `Alert for transaction ${transactionId} has been dismissed.`,
    });
  };
  
  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions?id=${transactionId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Fraud Alerts</h1>
        <p className="text-slate-500 mb-6">Review potential fraudulent transactions and take appropriate action</p>
        
        {alertTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertTransactions.map(transaction => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium">{transaction.merchant}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{transaction.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Potential Fraud
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                  <div>
                    <span className="text-slate-500">Amount: </span>
                    <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Date: </span>
                    <span className="font-medium">{transaction.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Category: </span>
                    <span className="font-medium">{transaction.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Type: </span>
                    <span className="font-medium">{transaction.type}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Risk Level</span>
                    <span className="font-medium">{transaction.riskScore}%</span>
                  </div>
                  {/* Added progress bar for consistency */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        transaction.riskScore > 75 ? "bg-red-500" : 
                        transaction.riskScore > 50 ? "bg-orange-500" : 
                        transaction.riskScore > 25 ? "bg-yellow-500" : 
                        "bg-green-500"
                      }`}
                      style={{ width: `${transaction.riskScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleFlagTransaction(transaction.id)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Flag Transaction
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleDismissAlert(transaction.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Dismiss Alert
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No new alerts</h3>
            <p className="text-slate-500">All potential fraudulent transactions have been reviewed</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
