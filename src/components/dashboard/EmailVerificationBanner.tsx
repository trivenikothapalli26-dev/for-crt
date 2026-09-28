import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, RefreshCw, CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFriendlyErrorMessage } from '../../firebase/config';

export const EmailVerificationBanner: React.FC = () => {
  const { currentUser, resendVerificationEmail, reloadUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setSending(true);
      setFeedback(null);
      await resendVerificationEmail();
      setFeedback({
        type: 'success',
        message: `Verification link sent to ${currentUser.email}. Please check your inbox and spam folder.`
      });
      setCooldown(60); // 60s cooldown
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(err)
      });
    } finally {
      setSending(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setFeedback(null);
      const updated = await reloadUser();
      if (updated?.emailVerified) {
        setFeedback({
          type: 'success',
          message: 'Awesome! Your email has been verified and your account is fully activated.'
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Email is not verified yet. Please click the link received in your inbox, then click here again.'
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(err)
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-b border-amber-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start gap-2.5 text-amber-900">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5 md:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-950">Email Verification Pending: </span>
            <span className="text-amber-800">
              Please verify your email address (<strong className="font-medium text-amber-950">{currentUser.email}</strong>) to unlock all security privileges and ensure account recovery.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span>I have verified</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="max-w-7xl mx-auto mt-2.5">
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100/90 text-rose-900 border border-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <MailCheck className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
