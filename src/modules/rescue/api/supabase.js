import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iogxloxliniknfjgral.supabase.co"; // your project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ3hmbG94bGluaWtuZmpncmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyMTIsImV4cCI6MjA5MTgzMDIxMn0.p8dxWfls5vrOie4KLRnqqLC2Gj9ccDrHSnOy8d43bd0";

export const supabase = createClient(supabaseUrl, supabaseKey);