import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GuestSavePromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const GuestSavePrompt: React.FC<GuestSavePromptProps> = ({ isOpen, onClose, featureName }) => {
  const { logout } = useAuth();

  const handleCreateAccount = () => {
    logout(); // Takes user back to login form for registration
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <AlertDialogTitle className="text-center">
            Create an Account to Save
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Sign up for free to save your {featureName} and track your progress over time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Why create an account?</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
              <li>Save all your entries and progress</li>
              <li>Access your data from any device</li>
              <li>Get personalized insights and recommendations</li>
              <li>Connect with mental health providers</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter className="sm:flex-col gap-2">
          <AlertDialogAction
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Create Free Account
          </AlertDialogAction>
          <AlertDialogCancel className="w-full mt-2">
            Continue Browsing
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GuestSavePrompt;
