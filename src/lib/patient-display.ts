/**
 * Provider-facing patient display utilities.
 *
 * The provider dashboard NEVER renders a patient's full name, email, or DOB.
 * We derive initials only, and add a minimal disambiguator (e.g. "KB" vs "KBl")
 * when two patients in the same caseload would otherwise collide.
 */

export type PatientLike = {
  id: string;
  name?: string | null;
  email?: string | null;
};

/** First-initial + last-initial from a full name; falls back to the email prefix. */
function baseInitials(patient: PatientLike): string {
  const source = (patient.name || patient.email || '').trim();
  if (!source) return '—';

  const parts = source
    .replace(/@.*/, '') // drop email domain
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (parts.length === 0) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return (first + last).toUpperCase();
}

/** Second letter of the last-name-ish token, lowercased, for tie-breaking. */
function disambiguator(patient: PatientLike, offset = 1): string {
  const source = (patient.name || patient.email || '').replace(/@.*/, '').trim();
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const token = parts.length > 1 ? parts[parts.length - 1] : parts[0] ?? '';
  return (token[offset] ?? '').toLowerCase();
}

/**
 * Compute the minimum-length unique display label for each patient in a caseload.
 * Example: [Karla Baker, Kevin Blake] -> ["KB", "KBl"] then ["KBa", "KBl"] if still colliding.
 */
export function computePatientLabels<T extends PatientLike>(
  patients: T[]
): Record<string, string> {
  const labels: Record<string, string> = {};
  const buckets = new Map<string, T[]>();

  for (const p of patients) {
    const base = baseInitials(p);
    if (!buckets.has(base)) buckets.set(base, []);
    buckets.get(base)!.push(p);
  }

  for (const [base, group] of buckets) {
    if (group.length === 1) {
      labels[group[0].id] = base;
      continue;
    }
    // Add one disambiguating character at a time until unique.
    let offset = 1;
    let current = group.map(p => ({ p, label: base }));
    while (offset < 6) {
      const next = current.map(({ p }) => ({
        p,
        label: base + disambiguator(p, offset),
      }));
      const counts = new Map<string, number>();
      next.forEach(({ label }) => counts.set(label, (counts.get(label) ?? 0) + 1));
      current = next;
      if ([...counts.values()].every(c => c === 1)) break;
      offset += 1;
    }
    current.forEach(({ p, label }) => {
      labels[p.id] = label || base;
    });
  }

  return labels;
}