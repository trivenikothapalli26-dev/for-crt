import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  confirmPasswordReset,
  applyActionCode,
  verifyPasswordResetCode
} from 'firebase/auth';
import { auth, googleProvider, getFriendlyErrorMessage } from '../firebase/config';

export interface AuditLogItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'security';
}

export interface AuthActionUrlData {
  mode: 'resetPassword' | 'verifyEmail' | 'recoverEmail' | null;
  oobCode: string | null;
  apiKey: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authReady: boolean;
  auditLogs: AuditLogItem[];
  actionData: AuthActionUrlData;
  register: (email: string, pass: string, displayName: string) => Promise<User>;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  sendResetPasswordEmail: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<User | null>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserPassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  confirmPasswordResetAction: (code: string, newPass: string) => Promise<void>;
  applyEmailVerificationAction: (code: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  clearActionData: () => void;
  clearAuditLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [actionData, setActionData] = useState<AuthActionUrlData>({
    mode: null,
    oobCode: null,
    apiKey: null
  });

  // Load audit logs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authshield_audit_logs');
      if (stored) {
        setAuditLogs(JSON.parse(stored));
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  const addAuditLog = (action: string, details: string, type: 'info' | 'success' | 'warning' | 'security' = 'info') => {
    const newItem: AuditLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', month: 'short', day: 'numeric' }),
      type
    };
    setAuditLogs((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem('authshield_audit_logs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('authshield_audit_logs');
  };

  // Inspect URL parameters for Firebase email link actions
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode') as AuthActionUrlData['mode'];
      const oobCode = params.get('oobCode');
      const apiKey = params.get('apiKey');

      if (mode && oobCode) {
        setActionData({
          mode,
          oobCode,
          apiKey
        });
      }
    } catch (e) {
      console.error('Error parsing auth action url params', e);
    }
  }, []);

  const clearActionData = () => {
    setActionData({ mode: null, oobCode: null, apiKey: null });
    // Clean up URL query parameters without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    url.searchParams.delete('oobCode');
    url.searchParams.delete('apiKey');
    window.history.replaceState({}, document.title, url.pathname);
  };

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setAuthReady(true);
      if (user) {
        addAuditLog('Session Active', `Authenticated as ${user.email} (Verified: ${user.emailVerified ? 'Yes' : 'No'})`, 'info');
      }
    });

    return () => unsubscribe();
  }, []);

  // Register with email, password, and displayName
  const register = async (email: string, pass: string, displayName: string): Promise<User> => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = cred.user;

      // Update display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Automatically send verification email on register
      try {
        await sendEmailVerification(user);
        addAuditLog('Verification Sent', `Verification email dispatched to ${user.email}`, 'info');
      } catch (err) {
        console.warn('Could not automatically send verification email:', err);
      }

      // Refresh current user instance to sync profile
      await user.reload();
      const updatedUser = auth.currentUser;
      setCurrentUser(updatedUser);

      addAuditLog('Account Created', `Registered new user account for ${email}`, 'success');
      return updatedUser || user;
    } catch (err) {
      addAuditLog('Registration Failed', `Attempt for ${email} failed: ${getFriendlyErrorMessage(err)}`, 'warning');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email: string, pass: string): Promise<User> => {
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      addAuditLog('Sign In', `Successfully signed in via password as ${email}`, 'success');
      return cred.user;
    } catch (err) {
      addAuditLog('Sign In Failed', `Failed sign-in attempt for ${email}`, 'warning');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google popup
  const loginWithGoogle = async (): Promise<User> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      addAuditLog('Google Sign In', `Signed in with Google as ${result.user.email}`, 'success');
      return result.user;
    } catch (err) {
      addAuditLog('Google Sign In Cancelled/Failed', getFriendlyErrorMessage(err), 'warning');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    const userEmail = currentUser?.email;
    await signOut(auth);
    addAuditLog('Sign Out', `User ${userEmail || ''} signed out`, 'info');
  };

  // Send Password Reset Email
  const sendResetPasswordEmail = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      addAuditLog('Password Reset Requested', `Reset instructions sent to ${email}`, 'security');
    } catch (err) {
      addAuditLog('Password Reset Failed', `Failed for ${email}: ${getFriendlyErrorMessage(err)}`, 'warning');
      throw err;
    }
  };

  // Resend Email Verification to currentUser
  const resendVerificationEmail = async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No signed-in user found.');
    }
    try {
      await sendEmailVerification(auth.currentUser);
      addAuditLog('Verification Resent', `Verification email resent to ${auth.currentUser.email}`, 'info');
    } catch (err) {
      addAuditLog('Verification Resend Failed', getFriendlyErrorMessage(err), 'warning');
      throw err;
    }
  };

  // Reload currentUser and refresh state (e.g., to check if email was verified in another tab)
  const reloadUser = async (): Promise<User | null> => {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    const freshUser = auth.currentUser;
    setCurrentUser(freshUser ? Object.assign(Object.create(Object.getPrototypeOf(freshUser)), freshUser) : null);
    if (freshUser?.emailVerified) {
      addAuditLog('Email Verified', `Account email ${freshUser.email} is confirmed verified!`, 'success');
    }
    return freshUser;
  };

  // Update profile
  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not logged in');
    await updateProfile(auth.currentUser, {
      displayName: displayName || undefined,
      photoURL: photoURL || undefined
    });
    await auth.currentUser.reload();
    setCurrentUser(auth.currentUser ? Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser) : null);
    addAuditLog('Profile Updated', `Updated profile name to "${displayName}"`, 'info');
  };

  // Update password with optional re-authentication
  const updateUserPassword = async (newPassword: string, currentPassword?: string): Promise<void> => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('Not logged in');
    }
    // If current password provided, reauthenticate first
    if (currentPassword) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
    }
    await updatePassword(auth.currentUser, newPassword);
    addAuditLog('Password Changed', 'User password successfully updated', 'security');
  };

  // Confirm password reset from oobCode
  const confirmPasswordResetAction = async (code: string, newPass: string): Promise<void> => {
    await confirmPasswordReset(auth, code, newPass);
    addAuditLog('Password Reset Completed', 'Password successfully reset via email action link', 'security');
  };

  // Verify reset code
  const verifyResetCode = async (code: string): Promise<string> => {
    return await verifyPasswordResetCode(auth, code);
  };

  // Apply email verification action from oobCode
  const applyEmailVerificationAction = async (code: string): Promise<void> => {
    await applyActionCode(auth, code);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setCurrentUser(auth.currentUser ? Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser) : null);
    }
    addAuditLog('Action Code Applied', 'Email verification confirmed via link action', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authReady,
        auditLogs,
        actionData,
        register,
        login,
        loginWithGoogle,
        logout,
        sendResetPasswordEmail,
        resendVerificationEmail,
        reloadUser,
        updateUserProfile,
        updateUserPassword,
        confirmPasswordResetAction,
        applyEmailVerificationAction,
        verifyResetCode,
        clearActionData,
        clearAuditLogs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
