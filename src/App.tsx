import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ActionHandlerModal } from './components/auth/ActionHandlerModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';

function AuthPortal() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Simple Brand Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">AuthShield</span>
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              Firebase Auth
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setAuthMode('login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'register'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>
      </header>

      {/* Center Layout */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Feature Column (Brand Presentation) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200/80 text-indigo-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Project: fir-718ae</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Secure User Management with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Firebase Auth</span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Complete authentication system featuring email &amp; password registration, email verification flows, password reset recovery, and protected dashboard routes.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Email Verification</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated verification links and status refresh checks.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Password Reset Flow</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Self-service password recovery email and direct code handler.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Protected Routes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Dashboard and encrypted vault gated by authenticated sessions.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Firebase SDK v11</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Connected directly to configured fir-718ae cloud project.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Auth Card Form */}
          <div className="lg:col-span-5 flex justify-center">
            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400">
        <span>AuthShield • Secure Authentication &amp; User Management • Powered by Firebase</span>
      </footer>
    </div>
  );
}

function MainContent() {
  const { currentUser, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-600/30 animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Initializing Firebase Authentication...</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Connecting to project fir-718ae</p>
      </div>
    );
  }

  return (
    <>
      <ActionHandlerModal />
      {currentUser ? <DashboardLayout /> : <AuthPortal />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
