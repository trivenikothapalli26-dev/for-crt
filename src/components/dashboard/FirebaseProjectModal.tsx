import React from 'react';
import { X, Check, Copy, Flame, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { firebaseConfig } from '../../firebase/config';

interface FirebaseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseProjectModal: React.FC<FirebaseProjectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(firebaseConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Connected Firebase Project</h2>
              <p className="text-xs text-slate-500">Project ID: <span className="font-semibold text-slate-700">fir-718ae</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Active Firebase Configuration:</span>
              <button
                onClick={handleCopy}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{JSON.stringify(firebaseConfig, null, 2)}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Firebase Email Verification &amp; Password Reset Guide</span>
            </div>
            <p className="leading-relaxed">
              Firebase sends automated emails directly from Google's infrastructure using your project's sender identity.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900">
              <li>Check your <strong>Spam / Junk</strong> folder if an email does not appear in your inbox within 30 seconds.</li>
              <li>Ensure <strong>Email/Password</strong> provider is enabled in the Firebase Console under <em>Authentication &gt; Sign-in method</em>.</li>
              <li>You can customize the email template sender name, subject, and action URL in the Firebase Console under <em>Authentication &gt; Templates</em>.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
