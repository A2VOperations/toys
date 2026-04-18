import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/backend/controller/authController";

// GET /api/auth/settings?email=x@x.com
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT /api/user/settings
export async function PUT(req) {
  try {
    const body = await req.json();
    const { email, name, mobile, currentPassword, newPassword } = body;

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });
    if (!name)  return NextResponse.json({ message: "Name is required" }, { status: 400 });

    const updated = await updateUser(email, { name, mobile, currentPassword, newPassword });
    return NextResponse.json({
      message: "Profile updated!",
      user: { name: updated.name, email: updated.email, mobile: updated.mobile }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}