import { NextResponse } from "next/server";
import { getToys, addToy } from "@/backend/controller/toyController";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {
      title: searchParams.get("title") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      gender: searchParams.get("gender") || "",
      age: searchParams.get("age") || "",
      tags: searchParams.get("tags") || "",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "9",
      latestUploaded: searchParams.get("latestUploaded") || "true",
      sortBy: searchParams.get("sortBy") || "latest",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    };

    const result = await getToys(query);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("GET /api/toys failed:", err);
    return NextResponse.json(
      {
        toys: [],
        pagination: {
          totalItems: 0,
          totalPages: 1,
          currentPage: Number(new URL(req.url).searchParams.get("page") || 1),
          pageSize: Number(new URL(req.url).searchParams.get("limit") || 9),
        },
        message: "Database is unavailable. Showing empty catalog.",
      },
      { status: 200 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, category, brand } = body;

    if (!title || !category)
      return NextResponse.json(
        { message: "Title and category are required." },
        { status: 400 }
      );

    const toy = await addToy(body);
    return NextResponse.json({ message: "Toy added!", toy }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}