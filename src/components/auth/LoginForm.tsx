import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertTriangle, Mail, KeyRound } from 'lucide-react';
import InvitationValidation from './InvitationValidation';
import { PasswordStrength } from './PasswordStrength';
import logo from '@/assets/logo.png';

interface ValidatedInvitation {
  token: string;
  email: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInvitationValidation, setShowInvitationValidation] = useState(false);
  const [validatedInvitation, setValidatedInvitation] = useState<ValidatedInvitation | null>(null);
  const [signupMode, setSignupMode] = useState<'choose' | 'code'>('choose');

  const { login, register, loginAsGuest, loading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Welcome back",
        description: "You're signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Patient registration requires invitation
    if (!validatedInvitation) {
      setShowInvitationValidation(true);
      return;
    }

    setIsLoading(true);
    try {
      await register(
        validatedInvitation.email,
        password,
        name,
        'patient' as UserRole,
        validatedInvitation.token
      );
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidInvitation = (token: string, invitationEmail: string) => {
    setValidatedInvitation({ token, email: invitationEmail });
    setEmail(invitationEmail);
    setShowInvitationValidation(false);
  };

  const handleGuestAccess = () => {
    loginAsGuest();
    toast({
      title: "Exploring as guest",
      description: "Your data won't be saved.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (showInvitationValidation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <InvitationValidation
          onValidInvitation={handleValidInvitation}
          onBack={() => setShowInvitationValidation(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-light via-background to-background p-4">
      <Card className="w-full max-w-md card-hero border-border/50 animate-fade-in-up">
        <CardHeader className="text-center pb-2 pt-10">
          <div className="mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-light to-mental-peach p-6 w-fit shadow-card">
            <img src={logo} alt="Making Meaning Psychology" className="h-32 w-32" />
          </div>
          <h1 className="font-merriweather text-2xl font-bold text-foreground">
            Making Meaning Psychology
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your companion for mental wellbeing
          </p>
        </CardHeader>

        <CardContent className="pt-4 space-y-5">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="bg-background pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              {!validatedInvitation && signupMode === 'choose' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-accent/50 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Making Meaning Psychology is invitation-only. Choose how you'd like to get started:
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSignupMode('code')}
                    className="w-full text-left p-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors flex items-start gap-3"
                  >
                    <KeyRound className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">I have an invitation code</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Your provider sent you a code by email.
                      </p>
                    </div>
                  </button>

                  <a
                    href="mailto:hello@makingmeaningpsychology.com?subject=Consultation%20request"
                    className="w-full text-left p-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors flex items-start gap-3"
                  >
                    <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">I'd like to book a consultation</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Reach out to start working with a provider.
                      </p>
                    </div>
                  </a>
                </div>
              ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {validatedInvitation ? (
                  <div className="p-3 bg-sage-light border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      ✓ Invitation verified for: <strong>{validatedInvitation.email}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-accent/50 border border-border rounded-lg flex items-start justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                      Click "Create Account" to enter your invitation code.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSignupMode('choose')}
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      Back
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-background"
                    disabled={!!validatedInvitation}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className="bg-background pr-10"
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full rounded-xl h-11 border-border hover:bg-accent/30"
            >
              Continue as Guest →
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-warm-dark" />
              Guest data won't be saved
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
