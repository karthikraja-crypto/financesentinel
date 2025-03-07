
import React, { useState } from 'react';
import { Transaction } from '@/utils/demoData';
import { formatCurrency, getStatusColor, getTransactionTypeColor, getRiskLevel, getRiskColor } from '@/utils/analytics';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpDown, 
  Search, 
  AlertTriangle, 
  CreditCard, 
  Calendar, 
  Filter,
  ChevronDown,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnalyticsCard from './AnalyticsCard';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  
  // Apply search filter
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.merchant.toLowerCase().includes(searchLower) ||
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const goToPage = (pageNum: number) => {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    setPage(pageNum);
  };
  
  return (
    <AnalyticsCard 
      title="Recent Transactions" 
      subtitle="Browse your recent financial activity"
      className="animate-slide-in animation-delay-200"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 px-3" disabled>
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" className="h-10 px-3" disabled>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Transaction</span>
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Risk</span>
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <div className="p-1.5 bg-slate-100 rounded-full">
                          <CreditCard className="h-4 w-4 text-slate-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 mb-0.5">
                          {transaction.merchant}
                          {transaction.flagged && (
                            <AlertTriangle className="inline-block h-3.5 w-3.5 ml-1.5 text-amber-500" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{transaction.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm">
                    <div className="text-slate-900">{transaction.date}</div>
                    <div className="text-xs text-slate-500">{transaction.id}</div>
                  </td>
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm font-medium">
                    <span className={cn(
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdrawal' || transaction.type === 'payment' ? 'text-slate-900' :
                      'text-slate-900'
                    )}>
                      {transaction.type === 'deposit' ? '+ ' : '- '}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm">
                    <Badge className={cn(
                      "font-normal",
                      getTransactionTypeColor(transaction.type)
                    )}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm">
                    <Badge className={cn(
                      "font-normal",
                      getStatusColor(transaction.status)
                    )}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 border-b border-slate-200 text-sm">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-8 h-1.5 rounded-full mr-2",
                        transaction.riskScore > 70 ? "bg-red-500" :
                        transaction.riskScore > 40 ? "bg-yellow-500" :
                        "bg-green-500"
                      )}></div>
                      <span className={cn(
                        transaction.riskScore > 70 ? "text-red-700" :
                        transaction.riskScore > 40 ? "text-yellow-700" :
                        "text-green-700"
                      )}>
                        {transaction.riskScore}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center border-b border-slate-200">
                  <p className="text-slate-500">No transactions found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * itemsPerPage, filteredTransactions.length)}
            </span>{" "}
            of <span className="font-medium">{filteredTransactions.length}</span> transactions
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </AnalyticsCard>
  );
};

export default TransactionTable;
