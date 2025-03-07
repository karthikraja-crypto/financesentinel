
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { generateDemoTransactions } from '@/utils/demoData';

const Transactions = () => {
  const transactions = generateDemoTransactions(50);
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Transaction History</h1>
        <TransactionTable transactions={transactions} />
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
