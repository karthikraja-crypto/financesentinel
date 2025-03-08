import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TransactionTable from '@/components/dashboard/TransactionTable';
import TransactionChart from '@/components/dashboard/TransactionChart';
import FraudDetectionPanel from '@/components/dashboard/FraudDetectionPanel';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import CurrencySelector from '@/components/dashboard/CurrencySelector';
import DatasetUploader from '@/components/dashboard/DatasetUploader';
import { 
  calculateAccountSummary, 
  generateDailyTotals, 
  generateTransactionsByType,
  generateRiskDistribution,
  Transaction
} from '@/utils/demoData';
import { formatCurrency } from '@/utils/analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useDataset } from '@/contexts/DatasetContext';
import { ArrowUpRight, TrendingUp, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';

// Define types for the tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      total: number;
      [key: string]: any;
    };
  }>;
}

interface RiskTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      range: string;
      [key: string]: any;
    };
  }>;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [dailyTotals, setDailyTotals] = useState<any[]>([]);
  const [transactionsByType, setTransactionsByType] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const { formatAmount } = useCurrency();
  const { transactions } = useDataset();
  
  // Load data based on current transactions
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay if first load
      if (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const accountSummary = calculateAccountSummary(transactions);
      const dailyTransactionTotals = generateDailyTotals(transactions);
      const transactionTypeCounts = generateTransactionsByType(transactions);
      const riskScoreDistribution = generateRiskDistribution(transactions);
      
      setSummary(accountSummary);
      setDailyTotals(dailyTransactionTotals);
      setTransactionsByType(transactionTypeCounts);
      setRiskDistribution(riskScoreDistribution);
      setIsLoading(false);
    };
    
    loadData();
  }, [transactions, isLoading]);
  
  // Chart configs
  const COLORS = ['#2D7FF9', '#F45B69', '#10B981', '#6366F1'];
  const RISK_COLORS = ['#10B981', '#84CC16', '#FACC15', '#F59E0B', '#F45B69'];
  
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-xs text-slate-500">
            Count: <span className="font-medium text-slate-700">{payload[0].value}</span>
          </p>
          <p className="text-xs text-slate-500">
            Total: <span className="font-medium text-slate-700">
              {formatCurrency(payload[0].payload.total)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  const RiskTooltip = ({ active, payload }: RiskTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <p className="font-medium text-sm">Risk Score: {payload[0].payload.range}</p>
          <p className="text-xs text-slate-500">
            Transactions: <span className="font-medium text-slate-700">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-finance-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading financial data...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      {/* Currency Selector */}
      <div className="flex justify-end mb-4">
        <CurrencySelector />
      </div>
      
      {/* Dashboard Header with KPI Cards */}
      <DashboardHeader summary={summary} />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Transaction Chart */}
        <div className="lg:col-span-2">
          <TransactionChart data={dailyTotals} />
        </div>
        
        {/* Fraud Detection Panel */}
        <div className="lg:col-span-1">
          <FraudDetectionPanel transactions={transactions} />
        </div>
        
        {/* Dataset Uploader */}
        <div className="lg:col-span-1">
          <DatasetUploader />
        </div>
      </div>
      
      {/* Transaction Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Transactions by Type */}
        <AnalyticsCard 
          title="Transactions by Type" 
          subtitle="Distribution of transaction types"
          className="animate-slide-in animation-delay-400"
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
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {transactionsByType.map((type, index) => (
              <div key={type.type} className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="text-xs">
                  <span className="font-medium capitalize">{type.type}</span>
                  <span className="text-slate-500 ml-1">({type.count})</span>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
        
        {/* Risk Score Distribution */}
        <AnalyticsCard 
          title="Risk Distribution" 
          subtitle="Distribution of transaction risk scores"
          className="animate-slide-in animation-delay-500"
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
                <Tooltip content={<RiskTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Low Risk
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
              Medium Risk
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
              High Risk
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              Critical
            </div>
          </div>
        </AnalyticsCard>
        
        {/* AI Detection Summary */}
        <AnalyticsCard 
          title="AI Detection Summary" 
          subtitle="AI-powered fraud detection metrics"
          className="animate-slide-in animation-delay-600"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Transactions Analyzed</div>
                  <div className="text-xl font-semibold text-slate-900">{transactions.length}</div>
                </div>
                <div className="p-2 bg-slate-100 rounded-full">
                  <BarChart3 className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Flagged Transactions</div>
                  <div className="text-xl font-semibold text-slate-900">{summary.flaggedTransactions}</div>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500">Detection Rate</span>
                  <span className="font-medium text-slate-700">
                    {((summary.flaggedTransactions / transactions.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-finance-blue rounded-full" 
                    style={{ width: `${(summary.flaggedTransactions / transactions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Average Risk Score</div>
                  <div className="text-xl font-semibold text-slate-900">
                    {(transactions.reduce((acc, t) => acc + t.riskScore, 0) / transactions.length).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <PieChartIcon className="h-5 w-5 text-finance-blue" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Fraud Prevention</div>
                  <div className="text-xl font-semibold text-slate-900">
                    {formatCurrency(
                      transactions
                        .filter(t => t.flagged && t.riskScore > 80)
                        .reduce((acc, t) => acc + t.amount, 0)
                    )}
                  </div>
                </div>
                <div className="p-2 bg-emerald-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>Potential savings from fraud detection</span>
              </div>
            </div>
          </div>
        </AnalyticsCard>
      </div>
      
      {/* Recent Transactions Table */}
      <TransactionTable transactions={transactions} />
    </DashboardLayout>
  );
};

export default Index;
