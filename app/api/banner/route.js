import { NextResponse } from "next/server";
import dbConnect from "@/backend/dbConfig/db";
import Banner from "@/backend/models/Banners";

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();

    // 🗑️ Auto-cleanup expired banners on every request
    await Banner.deleteMany({ endDate: { $lt: now } });

    let banner = await Banner.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    if (!banner) {
      banner = await Banner.findOne({}).sort({ createdAt: -1 });
    }

    if (!banner) {
      return NextResponse.json({ message: "No active banner found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("GET /api/banner error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}