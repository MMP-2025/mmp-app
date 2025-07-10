
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const UserProfile = () => {
  const { user, logout, isProvider } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <div className="text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
