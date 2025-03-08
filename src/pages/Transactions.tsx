
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionTable from '@/components/dashboard/TransactionTable';
import DatasetUploader from '@/components/dashboard/DatasetUploader';
import CurrencySelector from '@/components/dashboard/CurrencySelector';
import { useDataset } from '@/contexts/DatasetContext';

const Transactions = () => {
  const { transactions } = useDataset();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Transaction History</h1>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <CurrencySelector />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <DatasetUploader />
          </div>
          <div className="lg:col-span-3">
            <TransactionTable transactions={transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
