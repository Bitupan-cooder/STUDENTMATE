import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, User, signOut, getRedirectResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value || value === "missing") {
    console.warn(`Firebase config key ${key} is missing or empty. Please check your AI Studio secrets.`);
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');

let isSigningIn = false;
let cachedAccessToken: string | null = localStorage.getItem('googleAccessToken');
let redirectChecked = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Check for redirect result first
  if (!redirectChecked) {
    redirectChecked = true;
    getRedirectResult(auth).then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          localStorage.setItem('googleAccessToken', cachedAccessToken);
          if (result.user && onAuthSuccess) {
             onAuthSuccess(result.user, cachedAccessToken);
          }
        }
      }
    }).catch(console.error);
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        localStorage.removeItem('googleAccessToken');
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('googleAccessToken');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    localStorage.setItem('googleAccessToken', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      !error.message?.includes('popup-closed-by-user') &&
      !error.message?.includes('cancelled-popup-request') &&
      !error.message?.includes('popup-blocked')
    ) {
      console.error('Sign in error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const googleSignInWithRedirect = async (): Promise<void> => {
   await signInWithRedirect(auth, provider);
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  localStorage.removeItem('googleAccessToken');
};
