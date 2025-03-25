
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  FraudRule, 
  loadFraudRules, 
  saveFraudRules, 
  getAIRecommendations, 
  applyRecommendation 
} from '@/utils/fraudRuleService';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';
import FraudSettingsTab from '@/components/settings/FraudSettingsTab';

const FlexibleParameters = () => {
  const [useAiParameters, setUseAiParameters] = useState(true);
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  
  const handleToggleAiParameters = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to change parameter settings.",
        variant: "destructive",
      });
      return;
    }
    
    setUseAiParameters(!useAiParameters);
    
    toast({
      title: useAiParameters ? "Custom Parameters Enabled" : "AI Parameters Enabled",
      description: useAiParameters 
        ? "You can now define custom risk parameters." 
        : "AI will now manage risk detection parameters for you.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Flexible Parameters</h1>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Parameter Configuration</h2>
              <p className="text-slate-500 mt-1">Choose how transaction risk parameters are defined</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${!useAiParameters ? 'font-medium' : 'text-slate-500'}`}>
                Custom Parameters
              </span>
              <Switch 
                checked={useAiParameters}
                onCheckedChange={handleToggleAiParameters}
              />
              <span className={`text-sm ${useAiParameters ? 'font-medium' : 'text-slate-500'}`}>
                AI Parameters
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-md border">
            <h3 className="font-medium mb-2">
              {useAiParameters ? "AI-Powered Risk Detection" : "Custom Risk Parameters"}
            </h3>
            <p className="text-sm text-slate-600">
              {useAiParameters 
                ? "Our AI system is analyzing your transaction patterns and automatically setting optimal risk detection parameters based on your usage."
                : "You are defining custom parameters for transaction risk detection. The system will use your settings to flag suspicious activities."}
            </p>
            
            {useAiParameters && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  toast({
                    title: "AI Parameters Refreshed",
                    description: "The AI has updated your risk detection parameters based on recent activity.",
                  });
                }}
              >
                Refresh AI Parameters
              </Button>
            )}
          </div>
        </Card>
        
        <FraudSettingsTab />
      </div>
    </DashboardLayout>
  );
};

export default FlexibleParameters;
