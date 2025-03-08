
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Mail, Phone, User, Bell, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useCurrency } from '@/contexts/CurrencyContext';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onLogout }) => {
  const { formatAmount } = useCurrency();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-6 text-center">
          <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-medium text-slate-700">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <Badge variant="outline" className="mt-2">Premium Member</Badge>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Mail className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Phone className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-medium">{user.phone || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Bell className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Notifications</p>
              <p className="font-medium">Enabled for fraud alerts & weekly reports</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <FileText className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Account Balance</p>
              <p className="font-medium">{formatAmount(12500)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
