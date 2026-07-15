// src/config/firebase.ts
// Firebase initialization for web push (Cloud Messaging). Mirrors the
// guarded-init pattern used in ./supabase.ts — the app must keep working even
// when Firebase credentials haven't been configured for an environment yet.
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { env } from "./env";

export const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

let messagingPromise: Promise<Messaging | null> | null = null;

// Cloud Messaging can't be used without an initialized app, in browsers that
// don't support it (Safari < 16, in-app webviews, etc.), or without HTTPS —
// isSupported() covers all of that, so callers just get `null` instead of a thrown error.
export const getFirebaseMessaging = (): Promise<Messaging | null> => {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      if (!firebaseApp) {
        console.warn("[firebase] Skipping Cloud Messaging — VITE_FIREBASE_* env vars are not set.");
        return null;
      }
      const supported = await isSupported().catch(() => false);
      if (!supported) return null;
      return getMessaging(firebaseApp);
    })();
  }
  return messagingPromise;
};
