import { NextResponse } from 'next/server';
import { loginUser } from '@/backend/controller/authController';

export async function POST(req, { params }) {
  try {
    const { action } = await params;
    const body = await req.json();

    if (action === 'login') {
      const user = await loginUser(body);

      const res = NextResponse.json(
        { message: "Welcome back!", user },
        { status: 200 }
      );

      // ✅ set session cookie
      res.cookies.set("admin_session", JSON.stringify({
        name:  user.name,
        email: user.email,
      }), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours — session expires after 2hrs idle
        sameSite: "lax",
      });

      return res;
    }

    return NextResponse.json({ error: `Action '${action}' not found` }, { status: 404 });

  } catch (error) {
    console.error("Auth Error:", error.message);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
  }
}