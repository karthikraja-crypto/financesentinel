
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Theme Settings</h2>
      <p className="text-sm text-slate-500 dark:text-slate-300 mb-6">Choose your preferred theme mode</p>
      
      <div className="flex flex-wrap gap-4">
        <Button 
          variant={theme === 'light' ? 'default' : 'outline'} 
          className={`h-24 flex-1 flex flex-col justify-center items-center gap-2 
            ${theme !== 'light' ? 'dark:border-gray-600 dark:text-white dark:hover:bg-gray-700' : ''}`}
          onClick={() => setTheme('light')}
        >
          <Sun className="h-6 w-6" />
          <span>Light</span>
        </Button>
        
        <Button 
          variant={theme === 'dark' ? 'default' : 'outline'} 
          className={`h-24 flex-1 flex flex-col justify-center items-center gap-2
            ${theme !== 'dark' ? 'dark:border-gray-600 dark:text-white dark:hover:bg-gray-700' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <Moon className="h-6 w-6" />
          <span>Dark</span>
        </Button>
        
        <Button 
          variant={theme === 'system' ? 'default' : 'outline'} 
          className={`h-24 flex-1 flex flex-col justify-center items-center gap-2
            ${theme !== 'system' ? 'dark:border-gray-600 dark:text-white dark:hover:bg-gray-700' : ''}`}
          onClick={() => setTheme('system')}
        >
          <Laptop className="h-6 w-6" />
          <span>System</span>
        </Button>
      </div>
      
      <p className="text-xs text-slate-500 dark:text-slate-300 mt-4">
        {theme === 'system' 
          ? 'Following your system preferences' 
          : `Using ${theme} mode`}
      </p>
    </Card>
  );
};

export default ThemeSelector;
