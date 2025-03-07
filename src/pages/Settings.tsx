
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Demo" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Account" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="demo@financeguard.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="FinanceGuard Inc." className="mt-1" />
                </div>
              </div>
              <Button>Save Changes</Button>
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
                  <Switch id="fraud-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Large Transactions</p>
                    <p className="text-sm text-slate-500">Get notified for transactions above your threshold</p>
                  </div>
                  <Switch id="large-transactions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-slate-500">Receive a weekly summary of your account activity</p>
                  </div>
                  <Switch id="weekly-reports" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Updates</p>
                    <p className="text-sm text-slate-500">Receive news and promotional offers</p>
                  </div>
                  <Switch id="marketing" />
                </div>
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
                    <Button>Update Password</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Access</h2>
              <p className="text-slate-500 mb-4">Manage your API keys and access to the FinanceGuard API</p>
              
              <div className="border rounded-md p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">API Key</p>
                    <p className="font-mono text-sm">••••••••••••••••••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">Reveal</Button>
                </div>
                <div className="text-sm text-slate-500">
                  Created on: March 15, 2023
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline">Regenerate Key</Button>
                <Button>Create New Key</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
