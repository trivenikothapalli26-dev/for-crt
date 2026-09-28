import React, { useEffect, useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFriendlyErrorMessage } from '../../firebase/config';
import { PasswordStrengthMeter, calculatePasswordStrength } from '../common/PasswordStrengthMeter';

export const ActionHandlerModal: React.FC = () => {
  const { actionData, clearActionData, confirmPasswordResetAction, applyEmailVerificationAction, verifyResetCode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { mode, oobCode } = actionData;

  useEffect(() => {
    if (!oobCode || !mode) return;

    if (mode === 'verifyEmail') {
      // Automatically apply verification code
      handleAutoVerify(oobCode);
    } else if (mode === 'resetPassword') {
      // Validate reset code and find target email
      verifyCode(oobCode);
    }
  }, [mode, oobCode]);

  const verifyCode = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const email = await verifyResetCode(code);
      setTargetEmail(email);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoVerify = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      await applyEmailVerificationAction(code);
      setSuccess('Your email address has been successfully verified! You now have full access to protected dashboard features.');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { score } = calculatePasswordStrength(newPassword);
    if (score < 40) {
      setError('Please choose a stronger password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await confirmPasswordResetAction(oobCode, newPassword);
      setSuccess('Your password has been successfully updated! You can now log in with your new password.');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!mode || !oobCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {mode === 'verifyEmail' && (
            <div className="text-center">
              {loading ? (
                <div className="py-8 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">Verifying your email...</h3>
                  <p className="text-sm text-slate-500 mt-1">Contacting Firebase Auth service...</p>
                </div>
              ) : success ? (
                <div>
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Email Verified!</h2>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{success}</p>
                  <button
                    onClick={clearActionData}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Link Error</h2>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {error || 'This email verification code has expired or has already been used.'}
                  </p>
                  <button
                    onClick={clearActionData}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Dismiss &amp; Request New Link
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'resetPassword' && (
            <div>
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-5 text-indigo-600">
                <KeyRound className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">Set New Password</h2>
              {targetEmail && (
                <p className="text-xs text-slate-500 mb-4">
                  Resetting credentials for <span className="font-semibold text-slate-700">{targetEmail}</span>
                </p>
              )}

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success ? (
                <div className="text-center py-2">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Password Updated!</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{success}</p>
                  <button
                    onClick={clearActionData}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Sign In With New Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrengthMeter password={newPassword} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={loading || !newPassword}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating password...</span>
                        </>
                      ) : (
                        <span>Save New Password</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={clearActionData}
                      className="text-xs text-slate-500 hover:text-slate-700 py-1"
                    >
                      Cancel and Return
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
