import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate('/')}
      className="flex items-center gap-2"
    >
      <Home className="h-4 w-4" />
      <span>Home</span>
    </Button>
  );
};

export default HomeButton;