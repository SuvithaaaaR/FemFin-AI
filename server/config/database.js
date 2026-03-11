const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log(
        "⚠️  MongoDB URI not found in environment variables. Skipping database connection.",
      );
      console.log(
        "   The app will run without database functionality. Add MONGODB_URI to .env to enable database.",
      );
      return null;
    }

    const conn = await mongoose.connect(uri, {
      // Options for mongoose 6.x+
      // useNewUrlParser and useUnifiedTopology are no longer needed
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log("   The app will continue without database functionality.");
    console.log(`   Please check your MONGODB_URI in .env file`);
    return null;
  }
};

module.exports = connectDB;
