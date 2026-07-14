import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { PageTransition } from '@/components/ui/animated';
import { useProviderPatients } from '@/hooks/useProviderPatients';
import { useSharedPatientJournal } from '@/hooks/useSharedPatientJournal';
import { computePatientLabels } from '@/lib/patient-display';

const ClinicalBoundary: React.FC = () => (
  <Card className="p-4 bg-sage-light/40 border-primary/20">
    <p className="text-xs text-foreground/80 leading-relaxed">
      This information is intended to support between-session reflection and connection.
      It does not replace clinical documentation or emergency support.
    </p>
  </Card>
);

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);

const ProviderPatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patients, loading: patientsLoading } = useProviderPatients();
  const labels = useMemo(() => computePatientLabels(patients), [patients]);
  const { entries, loading: journalLoading } = useSharedPatientJournal(id);

  const isMyPatient = !!patients.find(p => p.id === id);
  const label = id ? labels[id] : '—';

  if (!patientsLoading && !isMyPatient) {
    return (
      <PageTransition>
        <div className="container mx-auto p-6 space-y-4">
          <Link to="/provider-dashboard" className="text-sm text-primary inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              This patient is not part of your caseload.
            </p>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <Link
          to="/provider-dashboard"
          className="text-sm text-primary inline-flex items-center gap-1 hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-mental-blue flex items-center justify-center font-semibold text-foreground/80 text-lg">
            {label || '—'}
          </div>
          <div>
            <h1 className="text-xl font-merriweather font-bold text-foreground">
              Patient {label || '—'}
            </h1>
            <p className="text-sm text-muted-foreground">Between-session overview</p>
          </div>
        </div>

        <ClinicalBoundary />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Reflections Shared
          </h2>

          {journalLoading ? (
            <p className="text-sm text-muted-foreground">Loading shared reflections…</p>
          ) : entries.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-sage-light flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                This patient hasn't shared any journal reflections yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Journal entries are private by default; patients choose which to share.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <Card key={entry.id} className="p-5 shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                      Shared {entry.sharedAt ? formatDate(entry.sharedAt) : ''}
                    </p>
                    {entry.prompted && (
                      <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        Prompted
                      </span>
                    )}
                  </div>
                  {entry.title && entry.title !== entry.content && (
                    <p className="text-sm italic text-muted-foreground mb-2">
                      Prompt: {entry.title}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm text-foreground/85 leading-relaxed">
                    {entry.content}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-3">
                    Written {formatDate(entry.createdAt)}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default ProviderPatientDetailPage;