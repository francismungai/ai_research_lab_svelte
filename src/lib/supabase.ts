import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mrzbomclmlopohhoszbv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yemJvbWNsbWxvcG9oaG9zemJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzUzMzQsImV4cCI6MjA5MTE1MTMzNH0.fg7b3PYSTEuzc_IJqDXfREMdZcuaJVkbOMxE5RefVxA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
