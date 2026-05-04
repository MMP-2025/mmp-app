import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

type Tier = { label: string; color: string; widthPct: number };

function evaluate(password: string): { score: number; tier: Tier; hints: string[] } {
  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score =
    (checks.length8 ? 1 : 0) +
    (checks.length12 ? 1 : 0) +
    (checks.upper ? 1 : 0) +
    (checks.lower ? 1 : 0) +
    (checks.number ? 1 : 0) +
    (checks.symbol ? 1 : 0);

  let tier: Tier;
  if (!password) tier = { label: 'Min. 8 characters', color: 'bg-muted', widthPct: 0 };
  else if (score <= 2) tier = { label: 'Weak', color: 'bg-destructive', widthPct: 33 };
  else if (score <= 4) tier = { label: 'Okay', color: 'bg-warm-dark', widthPct: 66 };
  else tier = { label: 'Strong', color: 'bg-primary', widthPct: 100 };

  const hints: string[] = [];
  if (!checks.length8) hints.push('At least 8 characters');
  if (!checks.upper || !checks.lower) hints.push('Mix uppercase and lowercase');
  if (!checks.number) hints.push('Include a number');
  if (!checks.symbol) hints.push('Include a symbol');

  return { score, tier, hints };
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { tier, hints } = useMemo(() => evaluate(password), [password]);
  const meetsMinimum = password.length >= 8;

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${tier.color}`}
          style={{ width: `${tier.widthPct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{tier.label}</span>
        {meetsMinimum && (
          <span className="ml-1 text-primary">· Strong enough ✓</span>
        )}
        {password && hints.length > 0 && <span> — {hints.slice(0, 2).join(', ')}</span>}
      </p>
    </div>
  );
};

export default PasswordStrength;