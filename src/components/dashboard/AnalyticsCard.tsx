
import React, { ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  subtitle, 
  className, 
  children 
}) => {
  return (
    <Card className={cn("shadow-card overflow-hidden card-hover-effect", className)}>
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-5">
        {children}
      </div>
    </Card>
  );
};

export default AnalyticsCard;
