import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, CreditCard, Tag, Map, ArrowRight, AlertTriangle, Flag, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/analytics';
import { Transaction } from '@/utils/demoData';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from '@/contexts/UserContext';
import { sendFraudReportEmail } from '@/utils/emailService';
import { useToast } from "@/hooks/use-toast";
import { useDataset } from '@/contexts/DatasetContext';
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { flagTransaction, dismissAlert } = useDataset();
  const [isReporting, setIsReporting] = React.useState(false);
  
  const getRiskColor = (score: number): string => {
    if (score >= 90) return 'bg-red-600';
    if (score >= 80) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-yellow-500';
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getRiskFactors = () => {
    const factors = [];
    
    if (transaction.amount > 5000) {
      factors.push({ factor: "Large Transaction Amount", description: "Transaction exceeds $5,000" });
    }
    
    if (transaction.riskScore > 80) {
      factors.push({ factor: "High Risk Score", description: "Risk score exceeds 80%" });
    }
    
    if (transaction.category === "Electronics" && transaction.amount > 2000) {
      factors.push({ factor: "High-Value Electronics Purchase", description: "Electronics purchase exceeding $2,000" });
    }
    
    if (transaction.riskScore > 70) {
      factors.push({ factor: "High-Risk Transaction", description: "Transaction with elevated risk score" });
    }
    
    if (factors.length === 0) {
      factors.push({ factor: "Unusual Transaction Pattern", description: "Transaction deviates from normal patterns" });
    }
    
    return factors;
  };
  
  const handleFlagTransaction = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to flag a transaction.",
        variant: "destructive",
      });
      return;
    }
    
    setIsReporting(true);
    try {
      // Only send email for manual flags when needed
      if (transaction.status !== 'flagged') {
        flagTransaction(transaction.id);
      }
      
      toast({
        title: "Transaction Flagged",
        description: `Transaction ${transaction.id} has been marked as fraudulent.`,
        variant: "default",
      });
      
      // Close the modal after successful flagging
      onClose();
    } catch (error) {
      toast({
        title: "Error Flagging Transaction",
        description: "There was an error flagging the transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };
  
  const handleDismissAlert = () => {
    dismissAlert(transaction.id);
    
    toast({
      title: "Alert Dismissed",
      description: `Alert for transaction ${transaction.id} has been dismissed.`,
      variant: "default",
    });
    
    // Close the modal after dismissing
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <Card className="w-full max-w-2xl bg-white relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              Transaction Details
              {transaction.flagged && (
                <AlertTriangle className="ml-2 h-5 w-5 text-amber-500" />
              )}
            </h2>
            <p className="text-slate-500 text-sm">Transaction ID: {transaction.id}</p>
          </div>
        </div>
        
        <ScrollArea className="flex-grow overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Merchant</p>
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-full mr-3">
                      <CreditCard className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-slate-500">{transaction.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date & Time</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                    <p>{transaction.date} • 14:32 EST</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Category</p>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-slate-500 mr-2" />
                    <p>{transaction.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <Badge className={getStatusBadgeColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Transaction Type</p>
                  <p>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Location</p>
                  <div className="flex items-center">
                    <Map className="h-4 w-4 text-slate-500 mr-2" />
                    <p>San Francisco, CA, USA</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Risk Assessment</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Risk Score</span>
                      <span className="font-medium">{transaction.riskScore}%</span>
                    </div>
                    <Progress value={transaction.riskScore} className="h-1.5" indicatorClassName={getRiskColor(transaction.riskScore)} />
                  </div>
                  <p className="text-sm">
                    {transaction.riskScore > 70 
                      ? "This transaction shows signs of potential fraud." 
                      : transaction.riskScore > 40 
                        ? "This transaction has some unusual patterns." 
                        : "This transaction appears to be legitimate."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Risk Factors Section */}
            <div className="mb-6 border-t border-slate-200 pt-4">
              <h3 className="font-medium mb-3">Risk Factors</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {getRiskFactors().map((factor, index) => (
                  <div key={index} className={index > 0 ? "mt-3 pt-3 border-t border-slate-200" : ""}>
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium text-slate-900">{factor.factor}</p>
                        <p className="text-sm text-slate-600">{factor.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom Parameters Section - Updated Title */}
            <div className="mb-6 border-t border-slate-200 pt-4">
              <h3 className="font-medium mb-3">Matching Custom/AI Parameters</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {transaction.riskScore > 70 ? (
                  <div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-1 mr-3">
                        <ArrowRight className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">High Value Transaction</p>
                        <p className="text-sm text-slate-600">Transaction amount exceeds normal patterns</p>
                      </div>
                    </div>
                    
                    {transaction.riskScore > 65 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-1 mr-3">
                            <ArrowRight className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Transaction Risk</p>
                            <p className="text-sm text-slate-600">Transaction has higher fraud potential</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">No matching custom parameters</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium mb-3">Transaction Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Transaction Initiated</p>
                    <p className="text-xs text-slate-500">{transaction.date} • 14:32:05 EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Processing</p>
                    <p className="text-xs text-slate-500">{transaction.date} • 14:32:10 EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'} rounded-full p-1 mr-3`}>
                    <ArrowRight className={`h-3 w-3 ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.status === 'completed' 
                        ? 'Transaction Completed' 
                        : transaction.status === 'pending' 
                          ? 'Awaiting Confirmation' 
                          : 'Transaction Flagged'}
                    </p>
                    <p className="text-xs text-slate-500">{transaction.date} • 14:32:15 EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-between p-4 border-t border-slate-200 mt-auto">
          {transaction.status !== 'flagged' && (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                disabled={isReporting}
                onClick={handleFlagTransaction}
              >
                <Flag className="h-4 w-4 mr-1" />
                {isReporting ? 'Processing...' : 'Flag Transaction'}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={handleDismissAlert}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Dismiss Alert
              </Button>
            </div>
          )}
          
          {transaction.status === 'flagged' && (
            <div>
              <Badge variant="destructive" className="mr-2">
                This transaction has been flagged as fraudulent
              </Badge>
            </div>
          )}
          
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TransactionDetails;
