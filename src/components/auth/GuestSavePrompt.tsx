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
          <div className="mx-auto mb-2 w-12 h-12 bg-mental-blue rounded-full flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <AlertDialogTitle className="text-center">
            Schedule a Consultation to Save
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Become a patient to save your {featureName} and track your progress over time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="bg-mental-peach/30 border border-mental-peach p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Why become a patient?</strong>
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
            className="w-full bg-mental-blue hover:bg-mental-blue/80 text-white"
          >
            Schedule a Consultation
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
