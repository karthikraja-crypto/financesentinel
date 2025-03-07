
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { generateDemoTransactions } from '@/utils/demoData';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/analytics';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  const transactions = generateDemoTransactions(100);
  const flaggedTransactions = transactions
    .filter(t => t.flagged)
    .sort((a, b) => b.riskScore - a.riskScore);
  
  const getRiskColor = (score: number): string => {
    if (score >= 90) return 'bg-red-600';
    if (score >= 80) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-yellow-500';
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Fraud Alerts</h1>
        <p className="text-slate-500 mb-6">Review and manage potentially fraudulent transactions</p>
        
        {flaggedTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedTransactions.map(transaction => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h3 className="font-medium">{transaction.merchant}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{transaction.description}</p>
                  </div>
                  <Badge variant={transaction.riskScore >= 90 ? "destructive" : "outline"} className="ml-2">
                    {transaction.riskScore}% Risk
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
                  <Progress value={transaction.riskScore} className="h-1.5" indicatorClassName={getRiskColor(transaction.riskScore)} />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Ignore</Button>
                  <Button variant="destructive" size="sm">Flag as Fraud</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No alerts found</h3>
            <p className="text-slate-500">All transactions appear to be legitimate</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
