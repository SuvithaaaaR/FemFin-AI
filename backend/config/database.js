const { testSupabaseConnection } = require("./supabase");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  await testSupabaseConnection();
  isConnected = true;
  console.log("✅ Supabase connected");
  return true;
};

module.exports = connectDB;
