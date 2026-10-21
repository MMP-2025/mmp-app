
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
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
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
    const enteredEmail = email.trim();
    if (!enteredEmail) {
      toast({
        title: "Missing Email",
        description: "Please enter the email address your invitation was sent to.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateInvitation(tokenToValidate, enteredEmail);
      setValidationResult(result);
      
      if (result.valid) {
        toast({
          title: "Invitation Valid",
          description: `Welcome! You can now create your account.`,
        });
        onValidInvitation(tokenToValidate, enteredEmail);
      } else {
        toast({
          title: "Invalid Invitation",
          description: "This invitation is invalid or expired, or the email does not match.",
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
        <CardTitle className="text-2xl text-center text-foreground">
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
            <div>
              <Label htmlFor="invitation-email">Email address</Label>
              <Input
                id="invitation-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email your invitation was sent to"
                className="bg-mental-gray"
              />
            </div>
            
            <Button
              onClick={() => handleValidateInvitation()}
              disabled={isValidating || !token || !email.trim()}
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
                <CheckCircle className="h-16 w-16 text-mental-green mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Invitation Validated
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Invited by: {validationResult.providerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {email.trim()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">
                    Invalid Invitation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This invitation is invalid or expired, or the email does not match.
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setValidationResult(null)}>
                  Try again
                </Button>
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
