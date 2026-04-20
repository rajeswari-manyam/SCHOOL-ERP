import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Create a mock supabase client if environment variables are not set
const supabaseUrl = env.SUPABASE_URL || "https://mock.supabase.co";
const supabaseKey = env.SUPABASE_ANON_KEY || "mock-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
