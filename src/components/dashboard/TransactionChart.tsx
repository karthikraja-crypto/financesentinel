
import React from 'react';
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DailyTotal {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  count: number;
}

interface TransactionChartProps {
  data: DailyTotal[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ data }) => {
  const { formatAmount } = useCurrency();
  
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium text-sm text-slate-900 mb-1">{formatXAxis(label)}</p>
          <div className="text-xs space-y-1">
            <p className="text-emerald-600">
              Inflow: {formatAmount(payload[0].value)}
            </p>
            <p className="text-finance-blue">
              Outflow: {formatAmount(payload[1].value)}
            </p>
            <p className={payload[2].value >= 0 ? "text-emerald-600" : "text-red-600"}>
              Net: {formatAmount(payload[2].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-card p-5 animate-slide-in animation-delay-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Transaction Activity</h3>
        <p className="text-sm text-slate-500">30-day overview of your financial activity</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D7FF9" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2D7FF9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tickFormatter={(value) => formatAmount(value).split('.')[0]} // Only show main currency unit
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="inflow" 
              name="Inflow"
              stroke="#10B981" 
              fillOpacity={1}
              fill="url(#colorInflow)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="outflow" 
              name="Outflow"
              stroke="#2D7FF9" 
              fillOpacity={1}
              fill="url(#colorOutflow)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="net" 
              name="Net"
              stroke="#6366F1" 
              fillOpacity={1}
              fill="url(#colorNet)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TransactionChart;
