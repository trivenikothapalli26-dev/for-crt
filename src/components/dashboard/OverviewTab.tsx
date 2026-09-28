import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  Key, 
  Calendar, 
  UserCheck, 
  Fingerprint, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenFirebaseModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onOpenFirebaseModal }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Calculate account security health score
  const isVerified = currentUser.emailVerified;
  const hasDisplayName = Boolean(currentUser.displayName);
  const provider = currentUser.providerData[0]?.providerId || 'password';

  let securityScore = 40; // Base score for active authenticated session
  if (isVerified) securityScore += 40;
  if (hasDisplayName) securityScore += 20;

  const creationDate = currentUser.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown';

  const lastSignIn = currentUser.metadata?.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Just now';

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Firebase Auth Protected Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-xl">
              You are currently viewing a secured dashboard route. All user identity tokens and session permissions are validated via Firebase Authentication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={onOpenFirebaseModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Firebase Config (fir-718ae)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Security & Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Security Score Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Health</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                securityScore >= 80 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {securityScore >= 80 ? 'Optimal' : 'Action Recommended'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-slate-900">{securityScore}%</span>
              <span className="text-xs text-slate-500">Protection Index</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  securityScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isVerified 
                ? 'Your email address is verified and your identity is securely locked.' 
                : 'Complete email verification to boost your account score to 100%.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateTab('security')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full"
            >
              <span>Manage credentials</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Verification</span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Unverified</span>
                </span>
              )}
            </div>

            <div className="space-y-2 mb-2">
              <div className="text-sm font-semibold text-slate-800 break-all">{currentUser.email}</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isVerified
                  ? 'Your email domain has been confirmed by Firebase Auth tokens.'
                  : 'A verification link has been sent. Click the link in your email to authenticate.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Provider: {provider === 'google.com' ? 'Google OAuth' : 'Email/Password'}</span>
            </div>
          </div>
        </div>

        {/* Identity & Session Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Session Status</span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span>Live Auth</span>
              </span>
            </div>

            <div className="space-y-2 mb-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Created:</span>
                <span className="font-medium text-slate-800">{creationDate}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Last Sign-in:</span>
                <span className="font-medium text-slate-800">{lastSignIn}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Firebase UID:</span>
                <span className="font-mono font-medium text-slate-700 text-[11px] truncate max-w-[140px]" title={currentUser.uid}>
                  {currentUser.uid}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full"
            >
              <span>View Security Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Protected Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('vault')}
            className="group p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all hover:shadow-md hover:border-indigo-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center mb-3 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              User Protected Vault
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Personal encrypted notes workspace isolated to your user UID ({currentUser.uid.slice(0, 6)}...).
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('security')}
            className="group p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all hover:shadow-md hover:border-indigo-200"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 flex items-center justify-center mb-3 transition-colors">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
              Credentials &amp; Password
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Update password, manage account profile name, and test re-authentication protection.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="group p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all hover:shadow-md hover:border-indigo-200"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 flex items-center justify-center mb-3 transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
              Security Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Examine live timestamps of user authentication events, verification dispatches, and logins.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
