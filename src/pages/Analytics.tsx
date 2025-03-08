
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import CurrencySelector from '@/components/dashboard/CurrencySelector';
import DatasetUploader from '@/components/dashboard/DatasetUploader';
import DateFilterSelector from '@/components/dashboard/DateFilterSelector';
import { generateTransactionsByType, generateRiskDistribution, Transaction } from '@/utils/demoData';
import { formatCurrency } from '@/utils/analytics';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useDataset } from '@/contexts/DatasetContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Map, DollarSign, BarChart3 } from 'lucide-react';

// Helper function to get transactions by category
const generateTransactionsByCategory = (transactions: Transaction[]) => {
  const categories: Record<string, { count: number, total: number }> = {};
  
  transactions.forEach(transaction => {
    if (!categories[transaction.category]) {
      categories[transaction.category] = { count: 0, total: 0 };
    }
    categories[transaction.category].count += 1;
    categories[transaction.category].total += transaction.amount;
  });
  
  return Object.keys(categories).map(category => ({
    category,
    count: categories[category].count,
    total: categories[category].total,
  }));
};

// Helper function to get high-risk locations
const generateHighRiskLocations = (transactions: Transaction[]) => {
  // This would normally use real location data
  // For demo purposes, we'll generate sample data
  const locations = [
    { city: "New York", riskScore: 78, count: 12 },
    { city: "Miami", riskScore: 65, count: 8 },
    { city: "Las Vegas", riskScore: 82, count: 15 },
    { city: "San Francisco", riskScore: 45, count: 6 },
    { city: "Chicago", riskScore: 58, count: 9 },
  ];
  
  return locations;
};

// Helper function to generate pattern anomalies
const generatePatternAnomalies = (transactions: Transaction[]) => {
  // For demo purposes, we'll create sample data points
  return [
    { hour: "00:00", normal: 5, anomaly: 1 },
    { hour: "03:00", normal: 2, anomaly: 0 },
    { hour: "06:00", normal: 8, anomaly: 0 },
    { hour: "09:00", normal: 15, anomaly: 1 },
    { hour: "12:00", normal: 25, anomaly: 2 },
    { hour: "15:00", normal: 22, anomaly: 3 },
    { hour: "18:00", normal: 18, anomaly: 5 },
    { hour: "21:00", normal: 10, anomaly: 2 },
  ];
};

const Analytics = () => {
  const { transactions, filterTransactionsByDate } = useDataset();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [transactionsByType, setTransactionsByType] = useState<any[]>([]);
  const [transactionsByCategory, setTransactionsByCategory] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const [highRiskLocations, setHighRiskLocations] = useState<any[]>([]);
  const [patternAnomalies, setPatternAnomalies] = useState<any[]>([]);
  const { formatAmount } = useCurrency();
  
  useEffect(() => {
    updateAnalytics(filteredTransactions);
  }, [filteredTransactions]);
  
  const updateAnalytics = (data: Transaction[]) => {
    setTransactionsByType(generateTransactionsByType(data));
    setRiskDistribution(generateRiskDistribution(data));
    setTransactionsByCategory(generateTransactionsByCategory(data));
    setHighRiskLocations(generateHighRiskLocations(data));
    setPatternAnomalies(generatePatternAnomalies(data));
  };
  
  const handleFilterChange = (filtered: Transaction[]) => {
    setFilteredTransactions(filtered);
  };
  
  const COLORS = ['#2D7FF9', '#F45B69', '#10B981', '#6366F1', '#8B5CF6', '#EC4899'];
  const RISK_COLORS = ['#10B981', '#84CC16', '#FACC15', '#F59E0B', '#F45B69'];
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2 sm:mb-0">Transaction Analytics</h1>
          <div className="flex items-center space-x-2">
            <CurrencySelector />
          </div>
        </div>
        
        <div className="mb-4">
          <DateFilterSelector onFilterChange={handleFilterChange} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <DatasetUploader />
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-6 mt-6">
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
                                return [`${value} transactions`, name];
                              }
                              return [value, name];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>
                  
                  <AnalyticsCard 
                    title="Transactions by Category" 
                    subtitle="Distribution of transaction categories"
                  >
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={transactionsByCategory}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 11, fill: '#64748B' }}
                            angle={-45}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                          <Tooltip 
                            formatter={(value, name) => {
                              return name === 'count' ? 
                                [`${value} transactions`, 'Count'] : 
                                [formatCurrency(value as number), 'Total Amount'];
                            }}
                          />
                          <Bar name="Count" dataKey="count" fill="#6366F1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>
                </div>
                
                <AnalyticsCard 
                  title="Transaction Volume Over Time" 
                  subtitle="Transaction patterns by amount and count"
                >
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={patternAnomalies}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="normal" stroke="#6366F1" fillOpacity={1} fill="url(#colorNormal)" name="Normal Transactions" />
                        <Line type="monotone" dataKey="anomaly" stroke="#F45B69" strokeWidth={2} name="Anomalies" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </AnalyticsCard>
              </TabsContent>
              
              <TabsContent value="risk" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            formatter={(value, name) => {
                              return [`${value} transactions`, 'Count'];
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
                  
                  <AnalyticsCard 
                    title="High-Risk Locations" 
                    subtitle="Geographical risk distribution"
                  >
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis 
                            type="category" 
                            dataKey="city" 
                            name="City" 
                            tick={{ fontSize: 12, fill: '#64748B' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="riskScore" 
                            name="Risk Score" 
                            unit="%" 
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: '#64748B' }}
                          />
                          <ZAxis 
                            type="number" 
                            dataKey="count" 
                            name="Transactions" 
                            range={[50, 500]} 
                          />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            formatter={(value, name, props) => {
                              if (name === 'Risk Score') return [`${value}%`, name];
                              return [value, name];
                            }}
                          />
                          <Scatter 
                            name="Locations" 
                            data={highRiskLocations} 
                            fill="#F45B69"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-700">High Risk Transactions</h3>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">
                      {filteredTransactions.filter(t => t.riskScore > 70).length}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((filteredTransactions.filter(t => t.riskScore > 70).length / filteredTransactions.length) * 100).toFixed(1)}% of total
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-700">Potential Loss</h3>
                      <DollarSign className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">
                      {formatCurrency(
                        filteredTransactions
                          .filter(t => t.riskScore > 70)
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </p>
                    <p className="text-xs text-slate-500">From high-risk transactions</p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-700">Fraud Detection Rate</h3>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">
                      84.5%
                    </p>
                    <p className="text-xs text-slate-500">System detection accuracy</p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-700">Risk Patterns</h3>
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">
                      12
                    </p>
                    <p className="text-xs text-slate-500">Detected abnormal patterns</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
