import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const atlasUri =
      process.env.MONGODB_URI ||
      "mongodb://toysforkidsdelhi_db_user:KNAn9q8zku2jv23o@ac-6saujld-shard-00-00.1hvpjnt.mongodb.net:27017,ac-6saujld-shard-00-01.1hvpjnt.mongodb.net:27017,ac-6saujld-shard-00-02.1hvpjnt.mongodb.net:27017/?ssl=true&replicaSet=atlas-2kdmlp-shard-0&authSource=admin&appName=toysforkids";

    const opts = {
      dbName: "toy_store",
      bufferCommands: false,
    };

    console.log("⏳ Connecting to MongoDB Atlas...");
    cached.promise = mongoose.connect(atlasUri, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    }).catch((error) => {
      console.error("❌ DB Connection Error:", error.message);
      throw error;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
