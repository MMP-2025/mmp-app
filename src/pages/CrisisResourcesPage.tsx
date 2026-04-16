
import React from 'react';
import EmergencyResources from '@/components/EmergencyResources';
import { PageTransition } from '@/components/ui/animated';
import { Heart, ShieldCheck } from 'lucide-react';

const CrisisResourcesPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-full bg-destructive/10">
              <ShieldCheck className="h-5 w-5 text-destructive" />
            </div>
            <h1 className="text-2xl font-merriweather font-bold text-foreground">Crisis Resources & Support</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are not alone. If you or someone you know is in crisis, these resources are here to help — anytime, day or night.
          </p>
          <div className="mt-3 p-3 bg-sage-light/60 border border-primary/10 rounded-xl flex items-start gap-2.5">
            <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/70">
              Reaching out for help is a sign of strength, not weakness. Every call, text, or chat matters.
            </p>
          </div>
        </div>
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <EmergencyResources />
        </div>
      </div>
    </PageTransition>
  );
};

export default CrisisResourcesPage;
