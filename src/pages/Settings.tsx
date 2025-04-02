
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/contexts/UserContext';
import SignInForm from '@/components/auth/SignInForm';
import { useToast } from "@/hooks/use-toast";
import ThemeSelector from '@/components/settings/ThemeSelector';

const Settings = () => {
  const { user, isAuthenticated, updateProfile, login } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState('Finance Sentinel Inc.');
  const { toast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = useState({
    fraudAlerts: true,
    largeTransactions: true,
    weeklyReports: false,
    marketing: false
  });
  
  const handleUserSignedIn = (userData: { email: string; name: string; phone: string; }) => {
    login(userData);
    setShowSignIn(false);
    
    setName(userData.name);
    setEmail(userData.email);
    
    toast({
      title: "Signed In",
      description: "You can now update your settings",
    });
  };
  
  const handleSaveProfile = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    
    updateProfile({
      name,
      email
    });
  };
  
  const handleToggleNotification = (key: keyof typeof emailNotifications) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications have been ${emailNotifications[key] ? 'disabled' : 'enabled'}`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Full Name</Label>
                    <Input 
                      id="firstName" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="mt-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    className="mt-1" 
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
              {!isAuthenticated && (
                <p className="text-xs text-amber-600 mt-2">
                  You need to sign in to save profile changes
                </p>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fraud Alerts</p>
                    <p className="text-sm text-slate-500">Get notified when suspicious activity is detected</p>
                  </div>
                  <Switch 
                    id="fraud-alerts" 
                    checked={emailNotifications.fraudAlerts}
                    onCheckedChange={() => handleToggleNotification('fraudAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Large Transactions</p>
                    <p className="text-sm text-slate-500">Get notified for transactions above your threshold</p>
                  </div>
                  <Switch 
                    id="large-transactions" 
                    checked={emailNotifications.largeTransactions}
                    onCheckedChange={() => handleToggleNotification('largeTransactions')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-slate-500">Receive a weekly summary of your account activity</p>
                  </div>
                  <Switch 
                    id="weekly-reports" 
                    checked={emailNotifications.weeklyReports}
                    onCheckedChange={() => handleToggleNotification('weeklyReports')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Updates</p>
                    <p className="text-sm text-slate-500">Receive news and promotional offers</p>
                  </div>
                  <Switch 
                    id="marketing" 
                    checked={emailNotifications.marketing}
                    onCheckedChange={() => handleToggleNotification('marketing')}
                  />
                </div>
                
                {!isAuthenticated && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 mt-4">
                    <p className="font-medium">Sign in required</p>
                    <p className="text-xs mt-1">You need to sign in to manage your notification preferences</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => setShowSignIn(true)}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" className="mt-1" />
                    </div>
                    <Button onClick={() => {
                      if (!isAuthenticated) {
                        setShowSignIn(true);
                        return;
                      }
                      
                      toast({
                        title: "Password Updated",
                        description: "Your password has been updated successfully",
                      });
                    }}>Update Password</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline" onClick={() => {
                    if (!isAuthenticated) {
                      setShowSignIn(true);
                      return;
                    }
                    
                    toast({
                      title: "2FA Setup",
                      description: "Two-factor authentication setup will be available soon",
                    });
                  }}>Enable 2FA</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="theme">
            <ThemeSelector />
          </TabsContent>
        </Tabs>
      </div>
      
      {showSignIn && (
        <SignInForm 
          onSignIn={handleUserSignedIn}
          onCancel={() => setShowSignIn(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default Settings;
