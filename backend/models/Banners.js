import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  images: [{ 
    type: String, 
    required: true 
  }], // Array to store multiple Cloudinary URLs
  urls: [String], // For backward compatibility
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  timing: {
    type: Number, // duration in milliseconds or similar
    default: 5000 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);