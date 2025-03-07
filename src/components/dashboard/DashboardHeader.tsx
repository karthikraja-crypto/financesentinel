import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CreditCard, 
  Calendar 
} from "lucide-react";
import { AccountSummary } from '@/utils/demoData';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DashboardHeaderProps {
  summary: AccountSummary;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ summary }) => {
  const { formatAmount } = useCurrency();
  
  const cards = [
    {
      title: 'Total Balance',
      value: formatAmount(summary.totalBalance),
      icon: <CreditCard className="h-5 w-5 text-finance-blue" />,
      change: summary.totalBalance > 0 ? (
        <span className="text-green-600 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          +3.2%
        </span>
      ) : (
        <span className="text-red-600 flex items-center">
          <TrendingDown className="h-3 w-3 mr-1" />
          -1.8%
        </span>
      ),
    },
    {
      title: 'Total Inflow',
      value: formatAmount(summary.totalInflow),
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      change: (
        <span className="text-green-600 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          +2.4%
        </span>
      ),
    },
    {
      title: 'Total Outflow',
      value: formatAmount(summary.totalOutflow),
      icon: <TrendingDown className="h-5 w-5 text-finance-blue" />,
      change: (
        <span className="text-finance-blue flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          +1.7%
        </span>
      ),
    },
    {
      title: 'Flagged Transactions',
      value: summary.flaggedTransactions.toString(),
      icon: <AlertTriangle className="h-5 w-5 text-finance-red" />,
      change: (
        <span className="text-slate-600 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Last 30 days
        </span>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 md:mb-0">
          Financial Dashboard
        </h1>
        <div className="text-sm text-slate-500">
          <span>Last updated: </span>
          <span className="font-medium text-slate-700">{new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={card.title} className="p-5 shadow-card card-hover-effect overflow-hidden relative animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1">{card.value}</h2>
                <div className="text-xs">{card.change}</div>
              </div>
              <div className="p-2 rounded-full bg-slate-100 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-slate-50 rounded-full opacity-30" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
