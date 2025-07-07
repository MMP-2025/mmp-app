
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

interface InvitationValidationProps {
  onValidInvitation: (token: string, email: string) => void;
  onBack: () => void;
}

const InvitationValidation: React.FC<InvitationValidationProps> = ({ 
  onValidInvitation, 
  onBack 
}) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    email?: string;
    providerName?: string;
  } | null>(null);
  const { validateInvitation } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a token in the URL (for invitation links)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('invitation');
    if (urlToken) {
      setToken(urlToken);
      handleValidateInvitation(urlToken);
    }
  }, []);

  const handleValidateInvitation = async (invitationToken?: string) => {
    const tokenToValidate = invitationToken || token;
    
    if (!tokenToValidate) {
      toast({
        title: "Missing Token",
        description: "Please enter your invitation token.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateInvitation(tokenToValidate);
      setValidationResult(result);
      
      if (result.valid) {
        toast({
          title: "Invitation Valid",
          description: `Welcome! You can now create your account.`,
        });
        onValidInvitation(tokenToValidate, result.email!);
      } else {
        toast({
          title: "Invalid Invitation",
          description: "This invitation token is invalid or has expired.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "An error occurred while validating your invitation.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-mental-gray">
        <CardTitle className="text-2xl text-center text-[#7e868b]">
          Patient Invitation
        </CardTitle>
        <p className="text-center text-mental-peach">
          Enter your invitation token to create an account
        </p>
      </CardHeader>
      <CardContent className="bg-mental-gray space-y-4 pt-6">
        {!validationResult && (
          <>
            <div>
              <Label htmlFor="invitation-token">Invitation Token</Label>
              <Input
                id="invitation-token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your invitation token"
                className="bg-mental-gray"
              />
            </div>
            
            <Button
              onClick={() => handleValidateInvitation()}
              disabled={isValidating || !token}
              className="w-full rounded-xl font-normal text-base bg-mental-peach text-mental-gray"
            >
              {isValidating ? 'Validating...' : 'Validate Invitation'}
            </Button>
          </>
        )}

        {validationResult && (
          <div className="text-center space-y-4">
            {validationResult.valid ? (
              <div className="space-y-3">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-[#7e868b]">
                    Invitation Validated
                  </h3>
                  <p className="text-sm text-[#737373]">
                    Invited by: {validationResult.providerName}
                  </p>
                  <p className="text-sm text-[#737373]">
                    Email: {validationResult.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-red-600">
                    Invalid Invitation
                  </h3>
                  <p className="text-sm text-[#737373]">
                    This invitation token is invalid or has expired.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvitationValidation;
