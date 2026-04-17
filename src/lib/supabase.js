import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iogxfloxliniknfjgral.supabase.co";
const supabaseKey = "sb_publishable_NYy14p54vL1aqWNvqjv23w_bwrXi9qJ";

export const supabase = createClient(supabaseUrl, supabaseKey);