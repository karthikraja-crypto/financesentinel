
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  Sliders, 
  Save,
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

const FlexibleParameters = () => {
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
  const [useCustomParameters, setUseCustomParameters] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    setRules(loadFraudRules());
  }, []);
  
  const handleToggleRule = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to modify risk parameters.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    );
    
    setRules(updatedRules);
    setHasChanges(true);
    
    toast({
      title: "Parameter Updated",
      description: `Risk parameter has been ${updatedRules.find(r => r.id === id)?.enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleUpdateThreshold = (id: string, threshold: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to modify risk parameters.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, threshold } : rule
    );
    
    setRules(updatedRules);
    setHasChanges(true);
  };
  
  const handleAddRule = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add risk parameters.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newRule.name || newRule.value === '') {
      toast({
        title: "Invalid Parameter",
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
    
    setRules(updatedRules);
    setShowAddForm(false);
    setHasChanges(true);
    setNewRule({
      name: '',
      type: 'amount',
      threshold: 75,
      condition: 'greater',
      value: '',
      enabled: true
    });
    
    toast({
      title: "Parameter Added",
      description: `New risk parameter "${newRule.name}" has been added.`,
    });
  };
  
  const handleDeleteRule = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete risk parameters.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    setHasChanges(true);
    
    toast({
      title: "Parameter Deleted",
      description: "Risk parameter has been deleted.",
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
      description: "AI has analyzed your parameters and provided recommendations.",
    });
  };
  
  const applyAIRecommendation = () => {
    if (!recommendation || !isAuthenticated) return;
    
    const updatedRules = applyRecommendation(rules, recommendation.suggestedChanges);
    setRules(updatedRules);
    setRecommendation(null);
    setHasChanges(true);
    
    toast({
      title: "Recommendations Applied",
      description: "AI suggestions have been applied to your risk parameters.",
    });
  };
  
  const handleSaveChanges = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save parameters.",
        variant: "destructive",
      });
      return;
    }
    
    saveFraudRules(rules);
    setHasChanges(false);
    
    toast({
      title: "Changes Saved",
      description: "Your custom risk parameters are now active. Transactions are being analyzed with your defined settings.",
    });
  };
  
  const handleToggleCustomParameters = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to toggle custom parameters.",
        variant: "destructive",
      });
      return;
    }
    
    setUseCustomParameters(!useCustomParameters);
    
    toast({
      title: useCustomParameters ? "AI Parameters Activated" : "Custom Parameters Activated",
      description: useCustomParameters 
        ? "System will now use AI-generated risk recommendations." 
        : "System will now use your custom risk parameters.",
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
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Flexible Parameters</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Sliders className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">Custom Flexible Parameters</h2>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="use-custom-parameters" className="font-medium">
                  {useCustomParameters ? "Custom Parameters ON" : "AI Parameters ON"}
                </Label>
                <Switch 
                  id="use-custom-parameters" 
                  checked={useCustomParameters}
                  onCheckedChange={handleToggleCustomParameters}
                />
              </div>
            </div>
            
            {!useCustomParameters && (
              <Alert className="mb-6 bg-indigo-50 border-indigo-200">
                <Lightbulb className="h-4 w-4 text-indigo-600" />
                <AlertTitle className="text-indigo-800">AI-Driven Parameters Active</AlertTitle>
                <AlertDescription className="text-indigo-700">
                  The system is using AI-generated fraud detection and risk recommendations. 
                  Toggle the switch above to customize your own risk parameters.
                </AlertDescription>
              </Alert>
            )}
            
            {useCustomParameters && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Transaction Risk Customization</h3>
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
                    <h3 className="font-medium mb-4">Add New Parameter</h3>
                    <div className="grid gap-4 mb-4">
                      <div>
                        <Label htmlFor="rule-name">Parameter Name</Label>
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
                          <Label htmlFor="rule-type">Parameter Type</Label>
                          <Select 
                            value={newRule.type}
                            onValueChange={(value: any) => setNewRule({...newRule, type: value})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select parameter type" />
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
                        Add Parameter
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(true)}
                    className="w-full"
                  >
                    + Add Custom Parameter
                  </Button>
                )}
                
                {hasChanges && (
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={handleSaveChanges}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {!isAuthenticated && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                <p className="font-medium">Sign in required</p>
                <p className="text-xs mt-1">You need to sign in to manage your risk parameters</p>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Settings2 className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Optimization Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <div>
                  <p className="font-medium">AI-Powered Risk Detection</p>
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
                  <p className="font-medium">Automatic Parameter Refinement</p>
                  <p className="text-sm text-slate-500">Let AI adjust parameters based on your transaction history</p>
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
                  <p className="font-medium">Monthly Parameter Review</p>
                  <p className="text-sm text-slate-500">Receive monthly suggestions to optimize your parameters</p>
                </div>
                <Switch 
                  id="monthly-review" 
                  checked={false}
                  disabled={!isAuthenticated}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FlexibleParameters;
