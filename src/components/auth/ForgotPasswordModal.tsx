import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFriendlyErrorMessage } from '../../firebase/config';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = ''
}) => {
  const { sendResetPasswordEmail } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await sendResetPasswordEmail(email.trim());
      setSentSuccess(true);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSentSuccess(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {!sentSuccess ? (
            <div>
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-5 text-indigo-600">
                <Mail className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1.5">Reset your password</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Enter the email associated with your account, and we'll send you a secure link to create a new password.
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <span>Send Password Reset Link</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 px-4 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to sign in</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                We've sent a password reset link to <span className="font-semibold text-slate-800">{email}</span>. Please click the link in that email to reset your credentials.
              </p>

              <div className="p-3.5 mb-6 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Didn't receive the email?</p>
                <p>• Check your spam or junk folder.</p>
                <p>• Make sure the email entered matches your Firebase account.</p>
                <p>• Wait 1-2 minutes before sending another request.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-colors"
                >
                  Return to Sign In
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1 transition-colors"
                >
                  Resend to a different email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
