
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import CurrencySelector from '@/components/dashboard/CurrencySelector';
import DatasetUploader from '@/components/dashboard/DatasetUploader';
import { generateDemoTransactions, generateTransactionsByType, generateRiskDistribution } from '@/utils/demoData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/utils/demoData';
import { useCurrency } from '@/contexts/CurrencyContext';

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateDemoTransactions(100));
  const transactionsByType = generateTransactionsByType(transactions);
  const riskDistribution = generateRiskDistribution(transactions);
  const { formatAmount } = useCurrency();
  
  const COLORS = ['#2D7FF9', '#F45B69', '#10B981', '#6366F1'];
  const RISK_COLORS = ['#10B981', '#84CC16', '#FACC15', '#F59E0B', '#F45B69'];
  
  const handleDatasetUploaded = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2 sm:mb-0">Transaction Analytics</h1>
          <div className="flex items-center space-x-2">
            <CurrencySelector />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <DatasetUploader onDatasetUploaded={handleDatasetUploaded} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsCard 
                title="Transactions by Type" 
                subtitle="Distribution of transaction types"
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transactionsByType}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: '#94A3B8', strokeWidth: 1 }}
                      >
                        {transactionsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (props && props.payload) {
                            return [value, name];
                          }
                          return [value, name];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </AnalyticsCard>
              
              <AnalyticsCard 
                title="Risk Distribution" 
                subtitle="Distribution of transaction risk scores"
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={riskDistribution}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (props && props.payload) {
                            return [value, 'Count'];
                          }
                          return [value, 'Count'];
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </AnalyticsCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
