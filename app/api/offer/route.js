import { NextResponse } from "next/server";
import dbConnect from "@/backend/dbConfig/db";
import Offer from "@/backend/models/Offer";

export async function GET() {
  try {
    await dbConnect();
    const offer = await Offer.findOne();
    if (!offer) {
      // Create a default offer if none exists
      const defaultOffer = await Offer.create({});
      return NextResponse.json({ success: true, offer: defaultOffer }, { status: 200 });
    }
    return NextResponse.json({ success: true, offer }, { status: 200 });
  } catch (error) {
    console.error("Error fetching offer:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const offer = await Offer.findOne();
    if (!offer) {
      const newOffer = await Offer.create(data);
      return NextResponse.json({ success: true, offer: newOffer }, { status: 201 });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer._id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, offer: updatedOffer }, { status: 200 });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
