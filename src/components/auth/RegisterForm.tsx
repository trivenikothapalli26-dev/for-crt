import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFriendlyErrorMessage } from '../../firebase/config';
import { PasswordStrengthMeter, calculatePasswordStrength } from '../common/PasswordStrengthMeter';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const { score } = calculatePasswordStrength(password);
    if (score < 40) {
      setError('Please choose a stronger password to protect your account.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register(email.trim(), password, displayName.trim());
      // Auth listener automatically navigates to dashboard on successful register
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100/80">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>New Account Registration</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Get started with secure user management &amp; email verification</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* Notice about email verification */}
      <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 flex items-start gap-2.5 text-xs text-indigo-800 leading-relaxed">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600" />
        <div>
          <span className="font-semibold">Automatic Email Verification:</span> We will send a confirmation link to your email address upon registration to verify your ownership.
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Full Name (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all placeholder:text-slate-400"
            />
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
