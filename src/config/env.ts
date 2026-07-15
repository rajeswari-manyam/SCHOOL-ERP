// Typed environment variables for Vite
export const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,

  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY as string,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID as string,
  FIREBASE_VAPID_KEY: import.meta.env.VITE_FIREBASE_VAPID_KEY as string,
};
