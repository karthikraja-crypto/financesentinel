
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LayoutDashboard, BarChart3, Bell, Flag, Settings, FileBarChart, Sliders } from "lucide-react";

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  icon?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to, icon }) => (
  <Link
    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 hover:no-underline transition-colors"
    to={to}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={onClose}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-finance-blue text-white">{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="border-t my-4"></div>
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button variant="destructive" onClick={onLogout} className="flex-1">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Transactions', to: '/transactions', icon: <FileBarChart className="h-4 w-4" /> },
    { label: 'Analytics', to: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Flexible Parameters', to: '/flexible-parameters', icon: <Sliders className="h-4 w-4" /> },
    { label: 'Alerts', to: '/alerts', icon: <Bell className="h-4 w-4" /> },
    { label: 'Flagged Transactions', to: '/flagged-transactions', icon: <Flag className="h-4 w-4" /> },
    { label: 'Settings', to: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
            
            <div className="font-bold text-finance-blue text-lg flex items-center">
              <span className="mr-2 bg-finance-blue text-white p-1 rounded-md">FS</span>
              Finance Sentinel
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((link) => (
              <NavLink key={link.label} to={link.to} icon={link.icon}>{link.label}</NavLink>
            ))}
          </nav>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 hover:bg-gray-100"
                >
                  <Avatar className="h-8 w-8 border-2 border-gray-200">
                    <AvatarFallback className="bg-finance-blue text-white">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium text-sm">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowUserProfile(true)}>
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white p-4 shadow-lg" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col space-y-1">
              {navItems.map((link) => (
                <NavLink key={link.label} to={link.to} icon={link.icon}>{link.label}</NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {children}
      </main>
      
      {showUserProfile && user && (
        <UserProfile 
          user={user}
          onLogout={handleLogout}
          onClose={() => setShowUserProfile(false)} 
        />
      )}
    </div>
  );
};

export default DashboardLayout;
