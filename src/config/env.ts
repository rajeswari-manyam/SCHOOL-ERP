// Typed environment variables for Vite
export const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
};
