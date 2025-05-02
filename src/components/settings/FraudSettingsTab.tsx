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

interface FraudSettingsTabProps {
  useCustomParameters: boolean;
}

const FraudSettingsTab: React.FC<FraudSettingsTabProps> = ({ useCustomParameters }) => {
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
    if (!isAuthenticated || !useCustomParameters) {
      toast({
        title: "Action Not Available",
        description: useCustomParameters
          ? "Please sign in to modify fraud rules."
          : "Enable custom parameters to modify rules.",
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
    if (!isAuthenticated || !useCustomParameters) {
      toast({
        title: "Action Not Available",
        description: useCustomParameters
          ? "Please sign in to modify fraud rules."
          : "Enable custom parameters to modify rules.",
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
    if (!isAuthenticated || !useCustomParameters) {
      toast({
        title: "Action Not Available",
        description: useCustomParameters
          ? "Please sign in to add fraud rules."
          : "Enable custom parameters to add rules.",
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
    if (!isAuthenticated || !useCustomParameters) {
      toast({
        title: "Action Not Available",
        description: useCustomParameters
          ? "Please sign in to delete fraud rules."
          : "Enable custom parameters to delete rules.",
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
    if (!isAuthenticated || !useCustomParameters) {
      toast({
        title: "Action Not Available",
        description: useCustomParameters
          ? "Please sign in to get AI recommendations."
          : "Enable custom parameters to get recommendations.",
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
    if (!recommendation || !isAuthenticated || !useCustomParameters) return;
    
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
      <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-finance-blue dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">Custom Risk Assessment Parameters</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRecommendation}
            disabled={!useCustomParameters}
            className="flex items-center gap-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Get AI Recommendations</span>
          </Button>
        </div>
        
        {recommendation && (
          <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">AI Recommendation</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {recommendation.message}
              <Button
                variant="outline"
                size="sm"
                onClick={applyAIRecommendation}
                className="mt-2 border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 
                dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70"
                disabled={!useCustomParameters}
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
              className="p-4 border rounded-md bg-white hover:shadow-sm transition-shadow
                dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium">{rule.name}</h3>
                    {rule.threshold >= 90 && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800
                        dark:bg-red-900/50 dark:text-red-300">High Risk</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {getTypeLabel(rule.type)}: {getConditionLabel(rule.condition, rule.type)} {getValueLabel(rule)}
                  </p>
                </div>
                <Switch 
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                  disabled={!useCustomParameters}
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
                  disabled={!rule.enabled || !useCustomParameters}
                  className="py-1"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50
                    dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteRule(rule.id)}
                  disabled={!useCustomParameters}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {showAddForm ? (
          <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 mb-4">
            <h3 className="font-medium mb-4">Add New Parameter</h3>
            <div className="grid gap-4 mb-4">
              <div>
                <Label htmlFor="rule-name">Parameter Name</Label>
                <Input 
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="e.g., High-Value Transaction"
                  className="mt-1 dark:bg-slate-800 dark:border-slate-600"
                  disabled={!useCustomParameters}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <Select 
                    value={newRule.type}
                    onValueChange={(value: any) => setNewRule({...newRule, type: value})}
                    disabled={!useCustomParameters}
                  >
                    <SelectTrigger className="mt-1 dark:bg-slate-800 dark:border-slate-600">
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
                    disabled={!useCustomParameters}
                  >
                    <SelectTrigger className="mt-1 dark:bg-slate-800 dark:border-slate-600">
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
                    className="mt-1 dark:bg-slate-800 dark:border-slate-600"
                    disabled={!useCustomParameters}
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
                      disabled={!useCustomParameters}
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
                className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddRule}
                disabled={!useCustomParameters}
              >
                Add Parameter
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            disabled={!useCustomParameters}
          >
            + Add Custom Parameter
          </Button>
        )}
        
        {!isAuthenticated && (
          <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-400">
            <p className="font-medium">Sign in required</p>
            <p className="text-xs mt-1">You need to sign in to manage your risk assessment parameters</p>
          </div>
        )}
        
        {!useCustomParameters && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-800 dark:text-blue-400">
            <p className="font-medium">Custom Parameters disabled</p>
            <p className="text-xs mt-1">Switch to Custom Parameters to manage risk assessment parameters</p>
          </div>
        )}
      </Card>
      
      <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Settings2 className="h-5 w-5 text-finance-blue dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold">Optimization Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b dark:border-gray-600">
            <div>
              <p className="font-medium">AI-Powered Risk Detection</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use advanced AI to detect unusual patterns</p>
            </div>
            <Switch 
              id="ai-detection" 
              checked={true}
              disabled={!isAuthenticated || !useCustomParameters}
            />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b dark:border-gray-600">
            <div>
              <p className="font-medium">Automatic Parameter Refinement</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Let AI adjust parameters based on your transaction history</p>
            </div>
            <Switch 
              id="auto-refinement" 
              checked={false}
              disabled={!isAuthenticated || !useCustomParameters}
            />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b dark:border-gray-600">
            <div>
              <p className="font-medium">Learning Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">System learns from your approve/reject decisions</p>
            </div>
            <Switch 
              id="learning-mode" 
              checked={true}
              disabled={!isAuthenticated || !useCustomParameters}
            />
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">Monthly Parameter Review</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive monthly suggestions to optimize your parameters</p>
            </div>
            <Switch 
              id="monthly-review" 
              checked={false}
              disabled={!isAuthenticated || !useCustomParameters}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            disabled={!isAuthenticated || !useCustomParameters}
            onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your risk assessment preferences have been updated.",
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
