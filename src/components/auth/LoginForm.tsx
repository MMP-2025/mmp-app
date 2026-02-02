import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import InvitationValidation from './InvitationValidation';

interface ValidatedInvitation {
  token: string;
  email: string;
}

// Check if we're in dev/preview environment
const isDevEnvironment = () => {
  const hostname = window.location.hostname;
  return (
    import.meta.env.DEV ||
    hostname === 'localhost' ||
    hostname.includes('preview') ||
    hostname.includes('lovable.app')
  );
};

const DEMO_CREDENTIALS = {
  patient: { email: 'patient@demo.com', password: 'password123' },
  provider: { email: 'provider@demo.com', password: 'password123' }
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInvitationValidation, setShowInvitationValidation] = useState(false);
  const [validatedInvitation, setValidatedInvitation] = useState<ValidatedInvitation | null>(null);
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  const isDev = isDevEnvironment();

  const fillDemoCredentials = (type: 'patient' | 'provider') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setRole(type);
  };
  const {
    login,
    register,
    loginAsGuest,
    loading
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (role === 'guest') {
        loginAsGuest();
        toast({
          title: "Welcome!",
          description: "You're now browsing as a guest.",
          className: "bg-white border border-gray-200 text-gray-900"
        });
      } else {
        await login(email, password);
        toast({
          title: "Login successful",
          description: `Welcome back!`,
          className: "bg-white border border-gray-200 text-gray-900"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // If registering as patient, show invitation validation first
    if (role === 'patient' && !validatedInvitation) {
      setShowInvitationValidation(true);
      return;
    }
    setIsLoading(true);
    try {
      await register(validatedInvitation ? validatedInvitation.email : email, password, name, role, validatedInvitation?.token);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account."
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleValidInvitation = (token: string, invitationEmail: string) => {
    setValidatedInvitation({
      token,
      email: invitationEmail
    });
    setEmail(invitationEmail);
    setShowInvitationValidation(false);
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-mental-peach p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mental-blue"></div>
      </div>;
  }
  if (showInvitationValidation) {
    return <div className="min-h-screen flex items-center justify-center bg-mental-peach p-4">
        <InvitationValidation onValidInvitation={handleValidInvitation} onBack={() => setShowInvitationValidation(false)} />
      </div>;
  }
  const handleGuestAccess = () => {
    loginAsGuest();
    toast({
      title: "Welcome!",
      description: "You're now browsing as a guest.",
      className: "bg-white border border-gray-200 text-gray-900"
    });
  };

  return <div className="min-h-screen flex items-center justify-center bg-mental-peach p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-white/80 rounded-t-lg">
          <CardTitle className="text-2xl text-center text-mental-blue font-semibold">
            Making Meaning Psychology
          </CardTitle>
          <p className="text-center text-gray-600">Welcome to your mental wellness journey</p>
        </CardHeader>
        <CardContent className="bg-white/80 rounded-b-lg pt-4">
          {/* Prominent Guest Access Button */}
          <div className="mb-4">
            <Button 
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full py-6 text-lg border-2 border-mental-green bg-mental-green/10 hover:bg-mental-green/20 text-mental-green font-medium rounded-xl"
            >
              Continue as Guest
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">No account needed - explore the app freely</p>
          </div>

          {/* Dev-only Demo Credentials */}
          {isDev && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowDevCredentials(!showDevCredentials)}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">DEV</span>
                Demo Credentials
                {showDevCredentials ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {showDevCredentials && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border space-y-2">
                  <p className="text-xs text-muted-foreground text-center mb-2">Click to auto-fill credentials:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('patient')}
                      className="text-xs"
                    >
                      Patient Demo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('provider')}
                      className="text-xs"
                    >
                      Provider Demo
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-2 space-y-1">
                    <p>Patient: patient@demo.com</p>
                    <p>Provider: provider@demo.com</p>
                    <p>Password: password123</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or sign in with account</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-mental-peach/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-mental-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-mental-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-white" />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="bg-white pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl font-medium text-base text-white bg-mental-blue hover:bg-mental-blue/90">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === 'patient' && validatedInvitation && <div className="p-3 bg-mental-green/30 border border-mental-green rounded-md">
                    <p className="text-sm text-gray-700">
                      ✓ Invitation validated for: {validatedInvitation.email}
                    </p>
                  </div>}

                {role === 'patient' && !validatedInvitation && <div className="p-3 bg-mental-blue/30 border border-mental-blue rounded-md">
                    <p className="text-sm text-gray-700">
                      Patient registration requires an invitation from a provider. 
                      Click "Create Account" to enter your invitation token.
                    </p>
                  </div>}

                <div>
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input id="register-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your full name" className="bg-white" />
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-white" disabled={role === 'patient' && !!validatedInvitation} />
                </div>
                
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input id="register-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password (min 6 characters)" className="bg-white pr-10" minLength={6} />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl font-medium text-base bg-mental-blue text-white hover:bg-mental-blue/90">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default LoginForm;