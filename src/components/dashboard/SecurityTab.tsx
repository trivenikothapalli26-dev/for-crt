import React, { useState } from 'react';
import { 
  Key, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Mail, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFriendlyErrorMessage } from '../../firebase/config';
import { PasswordStrengthMeter, calculatePasswordStrength } from '../common/PasswordStrengthMeter';

export const SecurityTab: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    updateUserPassword, 
    sendResetPasswordEmail 
  } = useAuth();

  // Profile Form state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Self Reset Email state
  const [resetEmailLoading, setResetEmailLoading] = useState(false);
  const [resetEmailFeedback, setResetEmailFeedback] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileError(null);
      setProfileSuccess(null);
      await updateUserProfile(displayName.trim());
      setProfileSuccess('Profile display name updated successfully.');
    } catch (err: any) {
      setProfileError(getFriendlyErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordError('Please provide a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const { score } = calculatePasswordStrength(newPassword);
    if (score < 40) {
      setPasswordError('Please choose a stronger password.');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(null);
      await updateUserPassword(newPassword, currentPassword || undefined);
      setPasswordSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(getFriendlyErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendSelfResetEmail = async () => {
    if (!currentUser?.email) return;
    try {
      setResetEmailLoading(true);
      setResetEmailFeedback(null);
      await sendResetPasswordEmail(currentUser.email);
      setResetEmailFeedback(`Password reset instructions dispatched to ${currentUser.email}.`);
    } catch (err: any) {
      setResetEmailFeedback(`Failed: ${getFriendlyErrorMessage(err)}`);
    } finally {
      setResetEmailLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Security &amp; Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your credentials, update identity details, and maintain secure access to your account.
        </p>
      </div>

      {/* Grid: Profile settings & Password Change */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">Account Identity</h2>
                <p className="text-xs text-slate-500">Your public profile name &amp; email</p>
              </div>
            </div>

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address (Firebase Identity)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed outline-none font-mono text-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Primary identifier managed by Firebase Authentication.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {profileLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">Change Password</h2>
                <p className="text-xs text-slate-500">Update your Firebase Auth login password</p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Password (Recommended for re-auth)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={newPassword} />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Alternative Reset Link dispatch */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Send Password Reset Email</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Prefer to reset using an email link instead? We can dispatch an official Firebase Auth recovery token directly to {currentUser?.email}.
          </p>
          {resetEmailFeedback && (
            <p className="text-xs font-medium text-indigo-600 mt-2">{resetEmailFeedback}</p>
          )}
        </div>

        <button
          onClick={handleSendSelfResetEmail}
          disabled={resetEmailLoading}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {resetEmailLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Send Recovery Email</span>
        </button>
      </div>
    </div>
  );
};
