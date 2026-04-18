import mongoose from "mongoose";

const dbConnect = async () => {
  // If already connected, don't try again
  if (mongoose.connection.readyState >= 1) return;

  try {

    const atlasUri =
      process.env.MONGODB_URI ||
      "mongodb://toysforkidsdelhi_db_user:KNAn9q8zku2jv23o@ac-6saujld-shard-00-00.1hvpjnt.mongodb.net:27017,ac-6saujld-shard-00-01.1hvpjnt.mongodb.net:27017,ac-6saujld-shard-00-02.1hvpjnt.mongodb.net:27017/?ssl=true&replicaSet=atlas-2kdmlp-shard-0&authSource=admin&appName=toysforkids";

    console.log("⏳ Connecting to MongoDB Atlas...");

    await mongoose.connect(atlasUri, {
      dbName: "toy_store",
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

export default dbConnect;
