
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import { generateDemoTransactions, generateTransactionsByType, generateRiskDistribution } from '@/utils/demoData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics = () => {
  const transactions = generateDemoTransactions(100);
  const transactionsByType = generateTransactionsByType(transactions);
  const riskDistribution = generateRiskDistribution(transactions);
  
  const COLORS = ['#2D7FF9', '#F45B69', '#10B981', '#6366F1'];
  const RISK_COLORS = ['#10B981', '#84CC16', '#FACC15', '#F59E0B', '#F45B69'];
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Transaction Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                  <Tooltip />
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
                  <Tooltip />
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
    </DashboardLayout>
  );
};

export default Analytics;
