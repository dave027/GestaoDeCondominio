import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wtpshvngkqcsnsnwuwsc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cHNodm5na3Fjc25zbnd1d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTQ1OTUsImV4cCI6MjEwNDM5MDU5NX0.zYcK7NKbebhuwS3LgQVwMzEhwS5k2teDZJAMZiBbxhc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
