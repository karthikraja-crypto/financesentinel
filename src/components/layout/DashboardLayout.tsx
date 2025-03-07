
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart3, 
  CreditCard,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Navigation items with proper routes
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/' },
    { name: 'Transactions', icon: <CreditCard className="h-5 w-5" />, href: '/transactions' },
    { name: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/analytics' },
    { name: 'Fraud Alerts', icon: <AlertTriangle className="h-5 w-5" />, href: '/alerts' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-lg bg-white/75 border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-slate-700 focus-ring"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-finance-blue rounded-md p-1 mr-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-xl text-slate-900">
                  FinanceGuard
                </span>
              </Link>
            </div>
            
            {/* Right side nav items */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                  <span>Demo Account</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-sm font-medium text-slate-700">DA</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r border-slate-200 pt-16 lg:pt-0 lg:relative lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-finance-blue text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <Button variant="outline" size="sm" className="w-full justify-start text-slate-700">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </aside>
        
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-slate-900/50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
