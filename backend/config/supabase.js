const { createClient } = require("@supabase/supabase-js");

let client = null;

const FALLBACK_SUPABASE_URL = "https://wudgzyrfeegibybygvzl.supabase.co";
const FALLBACK_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZGd6eXJmZWVnaWJ5YnlndnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzM5MzQsImV4cCI6MjA4OTU0OTkzNH0.We2_EJxvDjIRyyGE8zIvKyjHMFHHQLhKw1H52_YANX8";

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.",
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
};

const testSupabaseConnection = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.from("users").select("id").limit(1);

  if (error && error.code !== "PGRST116") {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  return true;
};

module.exports = {
  getSupabase,
  testSupabaseConnection,
};
