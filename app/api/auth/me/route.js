import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  try {
    const user = JSON.parse(session.value);
    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }
}