import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Lock, 
  Key, 
  Fingerprint, 
  Flame,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { OverviewTab } from './OverviewTab';
import { SecurityTab } from './SecurityTab';
import { ProtectedVaultTab } from './ProtectedVaultTab';
import { AuditLogTab } from './AuditLogTab';
import { FirebaseProjectModal } from './FirebaseProjectModal';

export const DashboardLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'security' | 'audit'>('overview');
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vault', label: 'Protected Vault', icon: Lock },
    { id: 'security', label: 'Security & Auth', icon: Key },
    { id: 'audit', label: 'Audit Trail', icon: Fingerprint },
  ];

  const userInitials = (currentUser.displayName || currentUser.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">AuthShield</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] uppercase tracking-wider border border-indigo-100">
                  Firebase
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Protected Dashboard &amp; Identity Guard</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              title="View Firebase config fir-718ae"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>fir-718ae</span>
            </button>

            {/* User Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {userInitials}
                </div>
                {currentUser.emailVerified ? (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Email Verified" />
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center" title="Email Unverified" />
                )}
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
                  {currentUser.displayName || currentUser.email}
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  {currentUser.emailVerified ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsFirebaseModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 font-medium"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Firebase Configuration Details</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Prominent Email Verification Banner (shows when unverified) */}
      <EmailVerificationBanner />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          />
        )}
        {activeTab === 'vault' && <ProtectedVaultTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'audit' && <AuditLogTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AuthShield</span>
            <span>•</span>
            <span>Firebase Authentication Project: <span className="font-mono text-slate-700">fir-718ae</span></span>
          </div>
          <div>
            <span>Protected Route Gateways &amp; Email Verification Enabled</span>
          </div>
        </div>
      </footer>

      {/* Firebase Details Modal */}
      <FirebaseProjectModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};
