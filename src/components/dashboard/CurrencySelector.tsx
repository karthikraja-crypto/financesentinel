
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DollarSign, IndianRupee, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 px-3">
          {currency === 'USD' ? (
            <DollarSign className="h-4 w-4" />
          ) : (
            <IndianRupee className="h-4 w-4" />
          )}
          <span>{currency}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency('USD')} className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span>USD (Dollar)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('INR')} className="gap-2">
          <IndianRupee className="h-4 w-4" />
          <span>INR (Rupee)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
