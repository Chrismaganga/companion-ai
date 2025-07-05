import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBM6SixD4DF1Cf5xxfVBx35NsEGYvyxlG0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "companion-ai-e4abe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "companion-ai-e4abe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "companion-ai-e4abe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "594495937257",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:594495937257:web:6f235bafb05d98ecd82e78",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3LNHYNJBN4"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                            process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-key";

let app: any;
let auth: Auth | null;
let googleProvider: GoogleAuthProvider | null;

if (isFirebaseConfigured) {
  // Initialize Firebase only if properly configured
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Initialize Analytics (only in browser environment)
  if (typeof window !== 'undefined') {
    try {
      const analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
} else {
  // Mock Firebase for demo purposes
  console.warn("Firebase not configured. Using mock authentication.");
  auth = null;
  googleProvider = null;
}

// Auth functions with fallbacks
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    return { user: { email: "demo@example.com", displayName: "Demo User" }, error: null };
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    return { user: { email, displayName: "Demo User" }, error: null };
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    return { user: { email, displayName: "Demo User" }, error: null };
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  if (!isFirebaseConfigured) {
    return { error: null };
  }
  
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured) {
    // Mock auth state for demo
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
}; 