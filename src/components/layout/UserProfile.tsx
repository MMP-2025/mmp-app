import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>
      <div className="hidden md:block text-sm">
        <p className="font-medium text-foreground leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">{user.role}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0 rounded-full">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
