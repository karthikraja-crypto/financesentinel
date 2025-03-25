
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserProfile from '@/components/auth/UserProfile';
import { 
  BarChart4, 
  Bell, 
  CreditCard, 
  Flag, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  X,
  Sliders
} from 'lucide-react';

const SidebarLink = ({ 
  to, 
  children, 
  icon: Icon,
  active = false,
  onClick
}: { 
  to: string; 
  children: React.ReactNode; 
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Link 
    to={to} 
    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
      active 
        ? 'bg-slate-100 text-slate-900 font-medium' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5 mr-3 text-slate-500" />
    {children}
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useUser();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-white">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/" className="flex items-center">
            <div className="bg-indigo-600 text-white p-1.5 rounded mr-2">
              <BarChart4 className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Finance Sentinel</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarLink to="/" icon={Home} active={pathname === '/'}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/transactions" icon={CreditCard} active={pathname === '/transactions'}>
            Transactions
          </SidebarLink>
          <SidebarLink to="/analytics" icon={BarChart4} active={pathname === '/analytics'}>
            Analytics
          </SidebarLink>
          <SidebarLink to="/flexible-parameters" icon={Sliders} active={pathname === '/flexible-parameters'}>
            Flexible Parameters
          </SidebarLink>
          <SidebarLink to="/alerts" icon={Bell} active={pathname === '/alerts'}>
            Fraud Alerts
          </SidebarLink>
          <SidebarLink to="/flagged-transactions" icon={Flag} active={pathname === '/flagged-transactions'}>
            Flagged Transactions
          </SidebarLink>
          <SidebarLink to="/settings" icon={Settings} active={pathname === '/settings'}>
            Settings
          </SidebarLink>
        </nav>
        
        <div className="p-4 border-t">
          {isAuthenticated ? (
            <div>
              <button 
                onClick={() => setShowProfile(true)}
                className="flex items-center w-full p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </button>
              <Separator className="my-2" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setShowProfile(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </aside>
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity ${
        sidebarOpen 
          ? 'opacity-100' 
          : 'opacity-0 pointer-events-none'
      }`} onClick={closeSidebar}></div>
      
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen 
          ? 'translate-x-0' 
          : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/" className="flex items-center" onClick={closeSidebar}>
            <div className="bg-indigo-600 text-white p-1.5 rounded mr-2">
              <BarChart4 className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Finance Sentinel</span>
          </Link>
          <button onClick={closeSidebar}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarLink to="/" icon={Home} active={pathname === '/'} onClick={closeSidebar}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/transactions" icon={CreditCard} active={pathname === '/transactions'} onClick={closeSidebar}>
            Transactions
          </SidebarLink>
          <SidebarLink to="/analytics" icon={BarChart4} active={pathname === '/analytics'} onClick={closeSidebar}>
            Analytics
          </SidebarLink>
          <SidebarLink to="/flexible-parameters" icon={Sliders} active={pathname === '/flexible-parameters'} onClick={closeSidebar}>
            Flexible Parameters
          </SidebarLink>
          <SidebarLink to="/alerts" icon={Bell} active={pathname === '/alerts'} onClick={closeSidebar}>
            Fraud Alerts
          </SidebarLink>
          <SidebarLink to="/flagged-transactions" icon={Flag} active={pathname === '/flagged-transactions'} onClick={closeSidebar}>
            Flagged Transactions
          </SidebarLink>
          <SidebarLink to="/settings" icon={Settings} active={pathname === '/settings'} onClick={closeSidebar}>
            Settings
          </SidebarLink>
        </nav>
        
        <div className="p-4 border-t">
          {isAuthenticated ? (
            <div>
              <button 
                onClick={() => {
                  setShowProfile(true);
                  closeSidebar();
                }}
                className="flex items-center w-full p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </button>
              <Separator className="my-2" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => {
                setShowProfile(true);
                closeSidebar();
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        <header className="flex items-center h-16 px-6 border-b bg-white">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-slate-500" />
          </button>
          <div className="flex-1"></div>
          <div className="md:hidden">
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {isAuthenticated && user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
      
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;
