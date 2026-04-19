import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Smile, FileText, Brain, Pencil } from 'lucide-react';

const quickLinks = [
  { label: 'Mood', path: '/mood', icon: Smile, color: 'bg-sage-light text-sage' },
  { label: 'Journal', path: '/journal', icon: FileText, color: 'bg-teal-light text-teal' },
  { label: 'Mindful', path: '/mindfulness', icon: Brain, color: 'bg-warm text-warm-dark' },
  { label: 'Gratitude', path: '/gratitude', icon: Pencil, color: 'bg-accent text-foreground' },
];

const QuickAccess = () => {
  return (
    <Card className="p-5 bg-card border-border/50 card-elevated hover-card-subtle">
      <h2 className="mb-3 text-foreground">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        {quickLinks.map(link => (
          <Button
            key={link.path}
            asChild
            variant="ghost"
            className={`w-full justify-start gap-2 min-h-[44px] py-3 px-3 rounded-xl ${link.color} hover:opacity-80 no-underline transition-all`}
          >
            <Link to={link.path} className="flex items-center gap-2 min-w-0 w-full">
              <link.icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{link.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickAccess;
