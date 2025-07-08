import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Users, Wrench, BarChart3, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GuestUpgradePromptProps {
  featureName: string;
  description: string;
  features: string[];
}

const GuestUpgradePrompt: React.FC<GuestUpgradePromptProps> = ({ featureName, description, features }) => {
  const { logout } = useAuth();

  const handleCreateAccount = () => {
    logout(); // This will take them back to the login form where they can register
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Unlock {featureName}
          </CardTitle>
          <p className="text-gray-600 mt-2">{description}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              What you'll get with a full account:
            </h3>
            
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
              >
                Create Patient Account - It's Free!
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Join thousands of users on their mental wellness journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestUpgradePrompt;