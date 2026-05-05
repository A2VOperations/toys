import { NextResponse } from "next/server";
import { getToyById, updateToy, deleteToy } from "@/backend/controller/toyController";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const toy = await getToyById(id);
    if (!toy) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ toy }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, categories } = body;

    // support both old `category` (string) and new `category` (array)
    const hasCategory =
      (Array.isArray(categories) && categories.length > 0) ||
      (Array.isArray(body.category) && body.category.length > 0) ||
      (typeof body.category === "string" && body.category.trim());

    if (!title || !hasCategory)
      return NextResponse.json(
        { message: "Title and at least one category are required." },
        { status: 400 }
      );

    // normalise: always store as `category` array in DB
    if (Array.isArray(categories) && categories.length > 0) {
      body.category = categories;
    } else if (typeof body.category === "string") {
      body.category = [body.category];
    }

    const updated = await updateToy(id, body);
    if (!updated) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ message: "Toy updated!", toy: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteToy(id);
    if (!deleted) return NextResponse.json({ message: "Toy not found" }, { status: 404 });
    return NextResponse.json({ message: "Toy deleted!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}