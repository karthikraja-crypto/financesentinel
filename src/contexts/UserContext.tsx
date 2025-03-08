
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  name: string;
  phone: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { email: string; name: string; phone: string; }) => void;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string; phone?: string; }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (userData: { email: string; name: string; phone: string; }) => {
    setUser({
      ...userData,
      isAuthenticated: true,
    });
    
    // Store in local storage for persistence
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      isAuthenticated: true,
    }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateProfile = (userData: { name?: string; email?: string; phone?: string; }) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  // Check for existing user on initialization
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      updateProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
