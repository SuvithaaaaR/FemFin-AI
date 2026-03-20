const { createClient } = require("@supabase/supabase-js");

let client = null;

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
