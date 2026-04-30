import { NextResponse } from "next/server";
import dbConnect from "@/backend/dbConfig/db";
import Banner from "@/backend/models/Banners";
import { uploadImageToCloudinary } from "@/backend/lib/cloudinary";

export async function POST(req) {
  try {
    await dbConnect();
    const { images, startDate, endDate, timing } = await req.json();
    console.log("POST /api/banners: Received data", { imageCount: images?.length, startDate, endDate, timing });

    const uploadPromises = images.map((img) => uploadImageToCloudinary(img, "hero-banners"));
    const imageUrls = await Promise.all(uploadPromises);
    console.log("POST /api/banners: Images uploaded to Cloudinary", imageUrls);

    // FIXED: Use 'images' instead of 'urls' to match your Schema
    const newBanner = await Banner.create({
      images: imageUrls, 
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timing: timing || 5000,
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();

    // 🗑️ Auto-cleanup: delete all banners whose endDate has passed
    const deleted = await Banner.deleteMany({ endDate: { $lt: now } });
    if (deleted.deletedCount > 0) {
      console.log(`Cleaned up ${deleted.deletedCount} expired banner(s)`);
    }

    const banners = await Banner.find({}).sort({ startDate: 1 });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, images, startDate, endDate, timing } = await req.json();
    
    let updateData = { 
      startDate: new Date(startDate), 
      endDate: new Date(endDate), 
      timing 
    };

    // Only upload new images if the user actually selected new ones
    if (images && images.length > 0 && images[0].startsWith("data:image")) {
      const uploadPromises = images.map((img) => uploadImageToCloudinary(img, "hero-banners"));
      updateData.images = await Promise.all(uploadPromises);
    }

    const updated = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ message: "Banner deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}