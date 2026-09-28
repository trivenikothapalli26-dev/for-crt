import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  GoogleAuthProvider
} from 'firebase/auth';

// Your web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDLre-e0ecqqmpDazWcXw2zMS4_eHckZ2A",
  authDomain: "fir-718ae.firebaseapp.com",
  projectId: "fir-718ae",
  storageBucket: "fir-718ae.firebasestorage.app",
  messagingSenderId: "982894742176",
  appId: "1:982894742176:web:68c0dd6609db51430d57c5",
  measurementId: "G-5K2KV94YLT"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure default persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence initialization warning:', err);
});

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Friendly error message translator
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid. Please check your typing.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No registered account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters with mixed letters and numbers.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to many failed attempts. You can reset your password or try again later.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is currently disabled in your Firebase console. Please go to Firebase Console > Authentication > Sign-in method and enable Email/Password.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/requires-recent-login':
      return 'This action requires recent authentication. Please sign out and sign back in to continue.';
    case 'auth/expired-action-code':
      return 'The reset or verification link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'The reset or verification code is invalid or has already been used.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connectivity.';
    default:
      if (message.includes('API key not valid')) {
        return 'Firebase API Key is invalid or restricted. Please verify in Firebase Console.';
      }
      return message.replace('Firebase: ', '') || 'An authentication error occurred.';
  }
}
