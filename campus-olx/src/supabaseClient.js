import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project details
const supabaseUrl = "https://kgqowclwyzoaqrxepimy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncW93Y2x3eXpvYXFyeGVwaW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTE2OTYsImV4cCI6MjA3MTg2NzY5Nn0.T51a6LdbKrz0CCk-rBWg_PfIPEfoLypPTNXztO-G5j4";

export const supabase = createClient(supabaseUrl, supabaseKey);
