
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
import { Menu, X } from "lucide-react";

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to }) => (
  <Link
    className="px-2 py-1 rounded-md hover:bg-gray-100 hover:no-underline"
    to={to}
  >
    {children}
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
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="border-t my-3"></div>
      <Button variant="destructive" onClick={onLogout} className="w-full">
        Logout
      </Button>
      <Button variant="outline" onClick={onClose} className="w-full mt-3">
        Close
      </Button>
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
    { label: 'Dashboard', to: '/' },
    { label: 'Transactions', to: '/transactions' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Flexible Parameters', to: '/flexible-parameters' },
    { label: 'Alerts', to: '/alerts' },
    { label: 'Flagged Transactions', to: '/flagged-transactions' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4">
        <div className="h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          
          <div className="flex items-center space-x-8">
            <div className="font-bold">Finance Sentinel</div>
            <nav className="hidden md:flex space-x-4">
              {navItems.map((link) => (
                <NavLink key={link.label} to={link.to}>{link.label}</NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  onClick={() => setShowUserProfile(true)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium text-sm">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="block md:hidden pb-4">
          <nav className="flex flex-col space-y-4 px-4">
            {navItems.map((link) => (
              <NavLink key={link.label} to={link.to}>{link.label}</NavLink>
            ))}
          </nav>
        </div>
      )}

      <div className="p-4">
        {children}
      </div>
      
      {showUserProfile && user && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-10"
        >
          <UserProfile 
            user={user}
            onLogout={handleLogout}
            onClose={() => setShowUserProfile(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
