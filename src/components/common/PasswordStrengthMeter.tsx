import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function calculatePasswordStrength(pass: string): {
  score: number;
  label: string;
  color: string;
  bgBar: string;
  checks: { label: string; passed: boolean }[];
} {
  const checks = [
    { label: 'At least 8 characters', passed: pass.length >= 8 },
    { label: 'At least one uppercase letter (A-Z)', passed: /[A-Z]/.test(pass) },
    { label: 'At least one lowercase letter (a-z)', passed: /[a-z]/.test(pass) },
    { label: 'At least one number (0-9)', passed: /[0-9]/.test(pass) },
    { label: 'At least one special character (!@#$%^&*)', passed: /[^A-Za-z0-9]/.test(pass) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  let score = 0;
  let label = 'Very Weak';
  let color = 'text-rose-500';
  let bgBar = 'bg-rose-500';

  if (!pass) {
    return { score: 0, label: 'Empty', color: 'text-slate-400', bgBar: 'bg-slate-200', checks };
  }

  if (passedCount <= 1) {
    score = 20;
    label = 'Very Weak';
    color = 'text-rose-500';
    bgBar = 'bg-rose-500';
  } else if (passedCount === 2) {
    score = 40;
    label = 'Weak';
    color = 'text-amber-500';
    bgBar = 'bg-amber-500';
  } else if (passedCount === 3) {
    score = 60;
    label = 'Fair';
    color = 'text-yellow-500';
    bgBar = 'bg-yellow-500';
  } else if (passedCount === 4) {
    score = 80;
    label = 'Good';
    color = 'text-emerald-500';
    bgBar = 'bg-emerald-500';
  } else {
    score = 100;
    label = 'Strong & Secure';
    color = 'text-emerald-600';
    bgBar = 'bg-emerald-600';
  }

  return { score, label, color, bgBar, checks };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const { score, label, color, bgBar, checks } = calculatePasswordStrength(password);

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
      <div className="flex items-center justify-between mb-1.5 font-medium">
        <span className="text-slate-600">Password Strength:</span>
        <span className={`font-semibold ${color}`}>{label}</span>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 ${bgBar}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {check.passed ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={check.passed ? 'text-slate-700 font-medium' : 'text-slate-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
