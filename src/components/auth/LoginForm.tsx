import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import InvitationValidation from './InvitationValidation';
interface ValidatedInvitation {
  token: string;
  email: string;
}
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInvitationValidation, setShowInvitationValidation] = useState(false);
  const [validatedInvitation, setValidatedInvitation] = useState<ValidatedInvitation | null>(null);
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
  return <div className="min-h-screen flex items-center justify-center bg-mental-peach p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-mental-gray">
          <CardTitle className="text-2xl text-center text-[#7e868b]">
            Making Meaning Psychology
          </CardTitle>
          <p className="text-center text-mental-peach">Welcome to your mental wellness journey</p>
        </CardHeader>
        <CardContent className="bg-mental-gray">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-mental-gray">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="bg-mental-gray">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-mental-gray">
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role !== 'guest' && <>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-mental-gray" />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="bg-mental-gray pr-10" />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>}

                {role === 'guest' && <div className="text-center p-4 bg-mental-blue rounded-md">
                    <p className="text-[#737373]">No login required for guest access</p>
                  </div>}

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl font-normal text-base text-slate-700 bg-mental-peach">
                  {isLoading ? 'Signing in...' : role === 'guest' ? 'Continue as Guest' : 'Sign In'}
                </Button>

                {role !== 'guest' && <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs font-medium text-blue-700 mb-2">Demo Credentials:</p>
                    <div className="space-y-1">
                      <button type="button" onClick={() => {
                    setEmail('provider@demo.com');
                    setPassword('demo123');
                    setRole('provider');
                  }} className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded">
                        Provider: provider@demo.com / demo123
                      </button>
                      <button type="button" onClick={() => {
                    setEmail('patient@demo.com');
                    setPassword('demo123');
                    setRole('patient');
                  }} className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded">
                        Patient: patient@demo.com / demo123
                      </button>
                    </div>
                  </div>}
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="bg-mental-gray">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-mental-gray">
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === 'patient' && validatedInvitation && <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✓ Invitation validated for: {validatedInvitation.email}
                    </p>
                  </div>}

                {role === 'patient' && !validatedInvitation && <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      Patient registration requires an invitation from a provider. 
                      Click "Create Account" to enter your invitation token.
                    </p>
                  </div>}

                <div>
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input id="register-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your full name" className="bg-mental-gray" />
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-mental-gray" disabled={role === 'patient' && !!validatedInvitation} />
                </div>
                
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input id="register-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password (min 6 characters)" className="bg-mental-gray pr-10" minLength={6} />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl font-normal text-base bg-mental-peach text-mental-gray hover:bg-mental-blue hover:text-mental-gray">
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