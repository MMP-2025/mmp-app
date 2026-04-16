import React, { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenericPageSkeleton } from '@/components/ui/page-skeletons';
import { ErrorBoundary } from '@/components/provider/ErrorBoundary';
import PatientInvitations from '@/components/provider/PatientInvitations';
import { PageTransition, StaggeredList } from '@/components/ui/animated';
import {
  Quote, FileText, HelpCircle, Wrench, Bell, Heart,
  Brain, Music, FolderOpen, Send, Users
} from 'lucide-react';
import { useState } from 'react';

// Lazy load tab components
const QuotesTab = lazy(() => import('@/components/provider/tabs/QuotesTab'));
const JournalPromptsTab = lazy(() => import('@/components/provider/tabs/JournalPromptsTab'));
const QuestionsTab = lazy(() => import('@/components/provider/tabs/QuestionsTab'));
const ToolkitTab = lazy(() => import('@/components/provider/tabs/ToolkitTab'));
const RemindersTab = lazy(() => import('@/components/provider/tabs/RemindersTab'));
const GratitudeTab = lazy(() => import('@/components/provider/tabs/GratitudeTab'));
const MindfulnessTab = lazy(() => import('@/components/provider/tabs/MindfulnessTab'));
const NotificationsTab = lazy(() => import('@/components/provider/tabs/NotificationsTab'));
const AudiosTab = lazy(() => import('@/components/provider/tabs/AudiosTab'));
const ResourcesTab = lazy(() => import('@/components/provider/tabs/ResourcesTab'));

import { useProviderData } from '@/hooks/useProviderData';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';

const sections = [
  { key: 'patients', label: 'Patients', icon: Users, color: 'bg-mental-blue' },
  { key: 'notifications', label: 'Send Notifications', icon: Send, color: 'bg-mental-peach' },
  { key: 'questions', label: 'Questions', icon: HelpCircle, color: 'bg-mental-green' },
  { key: 'quotes', label: 'Quotes', icon: Quote, color: 'bg-mental-warm' },
  { key: 'prompts', label: 'Journal Prompts', icon: FileText, color: 'bg-mental-blue' },
  { key: 'toolkit', label: 'Toolkit', icon: Wrench, color: 'bg-mental-gray' },
  { key: 'reminders', label: 'Reminders', icon: Bell, color: 'bg-mental-peach' },
  { key: 'gratitude', label: 'Gratitude', icon: Heart, color: 'bg-mental-green' },
  { key: 'mindfulness', label: 'Mindfulness', icon: Brain, color: 'bg-mental-warm' },
  { key: 'audios', label: 'Audio Files', icon: Music, color: 'bg-mental-blue' },
  { key: 'resources', label: 'Resources', icon: FolderOpen, color: 'bg-mental-gray' },
];

const LoadingFallback = () => <GenericPageSkeleton />;

const ProviderDashboard = () => {
  const data = useProviderData();
  const handlers = useProviderHandlers(data);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return <PatientInvitations />;
      case 'notifications':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NotificationsTab />
          </Suspense>
        );
      case 'questions':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <QuestionsTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'quotes':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <QuotesTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'prompts':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JournalPromptsTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'toolkit':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ToolkitTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'reminders':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RemindersTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'gratitude':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <GratitudeTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'mindfulness':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MindfulnessTab data={data} handlers={handlers} />
          </Suspense>
        );
      case 'audios':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AudiosTab />
          </Suspense>
        );
      case 'resources':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcesTab />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="container mx-auto p-6 space-y-6">
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-2xl font-merriweather font-bold text-foreground mb-1">Provider Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage content, patients, and notifications.</p>
          </div>

          {/* Quick action grid */}
          {!activeSection && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className="opacity-0 animate-fade-in-up p-4 rounded-xl border bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-left min-h-[80px] flex flex-col justify-between"
                    style={{ animationDelay: `${100 + i * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className={`w-9 h-9 rounded-lg ${section.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-4.5 w-4.5 text-foreground/70" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{section.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active section */}
          {activeSection && (
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setActiveSection(null)}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 no-underline min-h-[44px]"
              >
                ← Back to Dashboard
              </button>
              <Card className="shadow-card-elevated">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {(() => {
                      const section = sections.find(s => s.key === activeSection);
                      if (!section) return activeSection;
                      const Icon = section.icon;
                      return (
                        <>
                          <Icon className="h-5 w-5" />
                          {section.label}
                        </>
                      );
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderContent()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageTransition>
    </ErrorBoundary>
  );
};

export default ProviderDashboard;
