import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Users, ChevronRight } from 'lucide-react';
import { useProviderPatients } from '@/hooks/useProviderPatients';
import { computePatientLabels } from '@/lib/patient-display';
import PatientInvitations from '@/components/provider/PatientInvitations';

const ClinicalBoundary: React.FC = () => (
  <Card className="p-4 bg-sage-light/40 border-primary/20">
    <p className="text-xs text-foreground/80 leading-relaxed">
      This information is intended to support between-session reflection and connection.
      It does not replace clinical documentation or emergency support.
    </p>
  </Card>
);

const PatientsTab: React.FC = () => {
  const { patients, loading } = useProviderPatients();
  const labels = useMemo(() => computePatientLabels(patients), [patients]);

  return (
    <div className="space-y-6">
      <ClinicalBoundary />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Your Caseload
        </h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading your caseload…</p>
        ) : patients.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No patients have accepted an invitation yet.
            </p>
          </Card>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {patients.map((p) => (
              <Link
                key={p.id}
                to={`/provider/patients/${p.id}`}
                className="group flex items-center justify-between p-4 rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mental-blue flex items-center justify-center font-semibold text-foreground/80">
                    {labels[p.id] || '—'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Patient {labels[p.id] || '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">Between-session activity</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Invite a New Patient</h3>
        <PatientInvitations />
      </div>
    </div>
  );
};

export default PatientsTab;