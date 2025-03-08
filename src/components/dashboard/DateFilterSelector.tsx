
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useDataset } from '@/contexts/DatasetContext';
import { Transaction } from '@/utils/demoData';

interface DateFilterSelectorProps {
  onFilterChange: (transactions: Transaction[]) => void;
}

const DateFilterSelector: React.FC<DateFilterSelectorProps> = ({ onFilterChange }) => {
  const { filterTransactionsByDate } = useDataset();
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'week' | 'month' | 'year'>('all');

  const handleFilterChange = (period: 'all' | 'week' | 'month' | 'year') => {
    setActiveFilter(period);
    const filteredTransactions = filterTransactionsByDate(period);
    onFilterChange(filteredTransactions);
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-md border border-gray-200 p-1">
      <Calendar className="h-4 w-4 text-slate-500 ml-2" />
      <div className="flex">
        <Button 
          variant={activeFilter === 'all' ? "default" : "ghost"} 
          size="sm"
          onClick={() => handleFilterChange('all')}
          className="text-xs h-8"
        >
          All Time
        </Button>
        <Button 
          variant={activeFilter === 'week' ? "default" : "ghost"} 
          size="sm"
          onClick={() => handleFilterChange('week')}
          className="text-xs h-8"
        >
          Last Week
        </Button>
        <Button 
          variant={activeFilter === 'month' ? "default" : "ghost"} 
          size="sm"
          onClick={() => handleFilterChange('month')}
          className="text-xs h-8"
        >
          Last Month
        </Button>
        <Button 
          variant={activeFilter === 'year' ? "default" : "ghost"} 
          size="sm"
          onClick={() => handleFilterChange('year')}
          className="text-xs h-8"
        >
          Last Year
        </Button>
      </div>
    </div>
  );
};

export default DateFilterSelector;
