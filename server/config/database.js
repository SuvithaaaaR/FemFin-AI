const mongoose = require("mongoose");

let cachedConnection = null;
let connectingPromise = null;

const connectDB = async () => {
  if (cachedConnection && cachedConnection.connection?.readyState === 1) {
    return cachedConnection;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Set it in server/.env before starting the API.",
    );
  }

  try {
    connectingPromise = mongoose.connect(uri, {
      // Options for mongoose 6.x+
    });

    cachedConnection = await connectingPromise;

    console.log(`✅ MongoDB Connected: ${cachedConnection.connection.host}`);
    console.log(`📊 Database: ${cachedConnection.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

    return cachedConnection;
  } catch (error) {
    connectingPromise = null;
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
