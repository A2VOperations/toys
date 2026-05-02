import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Limited Time Offer",
  },
  heading: {
    type: String,
    default: "UP TO 30%\nOFF",
  },
  subheading: {
    type: String,
    default: "On Selected Toys",
  },
  linkText: {
    type: String,
    default: "SHOP NOW →",
  },
  linkUrl: {
    type: String,
    default: "/shop?tags=Sale",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
