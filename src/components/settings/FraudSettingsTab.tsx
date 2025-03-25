
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  RefreshCw, 
  Settings2
} from "lucide-react";
import { 
  FraudRule, 
  loadFraudRules, 
  saveFraudRules, 
  getAIRecommendations, 
  applyRecommendation 
} from '@/utils/fraudRuleService';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';

const FraudSettingsTab = () => {
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [recommendation, setRecommendation] = useState<{ 
    message: string; 
    suggestedChanges: Partial<FraudRule>[]; 
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState<Omit<FraudRule, 'id'>>({
    name: '',
    type: 'amount',
    threshold: 75,
    condition: 'greater',
    value: '',
    enabled: true
  });
  
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    setRules(loadFraudRules());
  }, []);
  
  const handleToggleRule = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to modify fraud rules.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    );
    
    setRules(saveFraudRules(updatedRules));
    
    toast({
      title: "Rule Updated",
      description: `Fraud detection rule has been ${updatedRules.find(r => r.id === id)?.enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleUpdateThreshold = (id: string, threshold: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to modify fraud rules.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, threshold } : rule
    );
    
    setRules(saveFraudRules(updatedRules));
  };
  
  const handleAddRule = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add fraud rules.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newRule.name || newRule.value === '') {
      toast({
        title: "Invalid Rule",
        description: "Please ensure all fields are filled out correctly.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = [
      ...rules,
      {
        ...newRule,
        id: Date.now().toString()
      }
    ];
    
    setRules(saveFraudRules(updatedRules));
    setShowAddForm(false);
    setNewRule({
      name: '',
      type: 'amount',
      threshold: 75,
      condition: 'greater',
      value: '',
      enabled: true
    });
    
    toast({
      title: "Rule Added",
      description: `New fraud detection rule "${newRule.name}" has been added.`,
    });
  };
  
  const handleDeleteRule = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete fraud rules.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(saveFraudRules(updatedRules));
    
    toast({
      title: "Rule Deleted",
      description: "Fraud detection rule has been deleted.",
    });
  };
  
  const fetchRecommendation = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get AI recommendations.",
        variant: "destructive",
      });
      return;
    }
    
    const newRecommendation = getAIRecommendations(rules);
    setRecommendation(newRecommendation);
    
    toast({
      title: "Recommendation Generated",
      description: "AI has analyzed your rules and provided recommendations.",
    });
  };
  
  const applyAIRecommendation = () => {
    if (!recommendation || !isAuthenticated) return;
    
    const updatedRules = applyRecommendation(rules, recommendation.suggestedChanges);
    setRules(saveFraudRules(updatedRules));
    setRecommendation(null);
    
    toast({
      title: "Recommendations Applied",
      description: "AI suggestions have been applied to your fraud rules.",
    });
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'amount': return 'Transaction Amount';
      case 'location': return 'Transaction Location';
      case 'merchant': return 'Merchant Category';
      case 'frequency': return 'Transaction Frequency';
      default: return 'Unknown Type';
    }
  };
  
  const getConditionLabel = (condition: string, type: string) => {
    switch(condition) {
      case 'greater': return type === 'amount' ? 'Greater than' : 'More than';
      case 'less': return type === 'amount' ? 'Less than' : 'Fewer than';
      case 'equal': return 'Equal to';
      case 'contains': return 'Contains';
      default: return 'Unknown Condition';
    }
  };
  
  const getValueLabel = (rule: FraudRule) => {
    if (rule.type === 'amount') {
      return `$${rule.value}`;
    } else if (rule.type === 'frequency') {
      return `${rule.value} transactions/day`;
    } else {
      return String(rule.value);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-finance-blue mr-2" />
            <h2 className="text-xl font-semibold">Custom Fraud Detection Rules</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRecommendation}
            className="flex items-center gap-1"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Get AI Recommendations</span>
          </Button>
        </div>
        
        {recommendation && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">AI Recommendation</AlertTitle>
            <AlertDescription className="text-amber-700">
              {recommendation.message}
              <Button
                variant="outline"
                size="sm"
                onClick={applyAIRecommendation}
                className="mt-2 border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800"
              >
                <Check className="h-3 w-3 mr-1" />
                Apply Recommendation
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 mb-6">
          {rules.map(rule => (
            <div 
              key={rule.id} 
              className="p-4 border rounded-md bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium">{rule.name}</h3>
                    {rule.threshold >= 90 && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">High Risk</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {getTypeLabel(rule.type)}: {getConditionLabel(rule.condition, rule.type)} {getValueLabel(rule)}
                  </p>
                </div>
                <Switch 
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Risk Threshold</span>
                  <span className="font-medium">{rule.threshold}%</span>
                </div>
                <Slider 
                  value={[rule.threshold]} 
                  min={30} 
                  max={100} 
                  step={5}
                  onValueChange={([value]) => handleUpdateThreshold(rule.id, value)} 
                  disabled={!rule.enabled}
                  className="py-1"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {showAddForm ? (
          <div className="border rounded-md p-4 bg-slate-50 mb-4">
            <h3 className="font-medium mb-4">Add New Rule</h3>
            <div className="grid gap-4 mb-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input 
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="e.g., High-Value Transaction"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <Select 
                    value={newRule.type}
                    onValueChange={(value: any) => setNewRule({...newRule, type: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Transaction Amount</SelectItem>
                      <SelectItem value="location">Transaction Location</SelectItem>
                      <SelectItem value="merchant">Merchant Category</SelectItem>
                      <SelectItem value="frequency">Transaction Frequency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rule-condition">Condition</Label>
                  <Select 
                    value={newRule.condition}
                    onValueChange={(value: any) => setNewRule({...newRule, condition: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {newRule.type === 'merchant' || newRule.type === 'location' ? (
                        <SelectItem value="contains">Contains</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="greater">Greater than</SelectItem>
                          <SelectItem value="less">Less than</SelectItem>
                          <SelectItem value="equal">Equal to</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-value">
                    {newRule.type === 'amount' ? 'Amount ($)' : 
                     newRule.type === 'frequency' ? 'Number of Transactions per Day' :
                     newRule.type === 'merchant' ? 'Merchant Categories (comma-separated)' :
                     'Locations (comma-separated)'}
                  </Label>
                  <Input 
                    id="rule-value"
                    value={newRule.value.toString()}
                    onChange={(e) => setNewRule({...newRule, value: 
                      newRule.type === 'amount' || newRule.type === 'frequency' 
                        ? Number(e.target.value) || 0
                        : e.target.value
                    })}
                    placeholder={
                      newRule.type === 'amount' ? '1000' : 
                      newRule.type === 'frequency' ? '5' :
                      newRule.type === 'merchant' ? 'Gambling,Adult,Crypto' :
                      'International,High-risk country'
                    }
                    type={newRule.type === 'amount' || newRule.type === 'frequency' ? 'number' : 'text'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rule-threshold">Risk Threshold (%)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider 
                      id="rule-threshold"
                      value={[newRule.threshold]} 
                      min={30} 
                      max={100} 
                      step={5}
                      onValueChange={([value]) => setNewRule({...newRule, threshold: value})}
                      className="flex-1"
                    />
                    <span className="w-10 text-right font-medium">{newRule.threshold}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            + Add Custom Rule
          </Button>
        )}
        
        {!isAuthenticated && (
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            <p className="font-medium">Sign in required</p>
            <p className="text-xs mt-1">You need to sign in to manage your fraud detection rules</p>
          </div>
        )}
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Settings2 className="h-5 w-5 text-finance-blue mr-2" />
          <h2 className="text-xl font-semibold">Optimization Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">AI-Powered Fraud Detection</p>
              <p className="text-sm text-slate-500">Use advanced AI to detect unusual patterns</p>
            </div>
            <Switch 
              id="ai-detection" 
              checked={true}
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Automatic Rule Refinement</p>
              <p className="text-sm text-slate-500">Let AI adjust rules based on your transaction history</p>
            </div>
            <Switch 
              id="auto-refinement" 
              checked={false}
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Learning Mode</p>
              <p className="text-sm text-slate-500">System learns from your approve/reject decisions</p>
            </div>
            <Switch 
              id="learning-mode" 
              checked={true}
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">Monthly Rule Review</p>
              <p className="text-sm text-slate-500">Receive monthly suggestions to optimize your rules</p>
            </div>
            <Switch 
              id="monthly-review" 
              checked={false}
              disabled={!isAuthenticated}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            disabled={!isAuthenticated}
            onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your fraud detection preferences have been updated.",
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Optimization Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FraudSettingsTab;
