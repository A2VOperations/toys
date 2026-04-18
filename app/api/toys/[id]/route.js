import { NextResponse } from "next/server";
import { getToyById, updateToy, deleteToy } from "@/backend/controller/toyController";

export async function GET(req, { params }) {
  try {
    const { id } = await params;  // ✅ await params
    const toy = await getToyById(id);
    if (!toy) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ toy }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;  // ✅ await params
    const body = await req.json();
    const { title, category, brand } = body;

    if (!title || !category || !brand)
      return NextResponse.json(
        { message: "Title, category, and brand are required." },
        { status: 400 }
      );

    const updated = await updateToy(id, body);
    if (!updated) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ message: "Toy updated!", toy: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;  // ✅ await params
    const deleted = await deleteToy(id);
    if (!deleted) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ message: "Toy deleted!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}