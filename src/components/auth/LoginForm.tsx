import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      toast({
        title: "Login successful",
        description: `Welcome, ${role}!`
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-mental-peach p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-mental-gray">
          <CardTitle className="text-2xl text-center text-[#7e868b]">
            Making Meaning Psychology
          </CardTitle>
          <p className="text-center text-mental-peach">Sign in to your account</p>
        </CardHeader>
        <CardContent className="bg-mental-gray">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-mental-gray" />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="bg-mental-gray" />
            </div>

            <div className="bg-transparent">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-xl font-normal text-base bg-mental-peach text-mental-gray">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">Demo credentials:</p>
            <p><strong>Patient:</strong> patient@example.com / password</p>
            <p><strong>Provider:</strong> provider@example.com / password</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default LoginForm;