import dbConnect from "@/backend/dbConfig/db";
import User from "@/backend/models/User"; 
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  
//   const existingAdmin = await User.findOne({ email: "admin@example.com" });
//   if (existingAdmin) return NextResponse.json({ msg: "Admin already exists" });

  const hashedPassword = await bcrypt.hash("vHARSH3081", 10);
  
  await User.create({
    name:"Harsh",
    email: "vharsh2003new@gmail.com",
    password: hashedPassword,
  });

  return NextResponse.json({ msg: "Admin created successfully in Atlas!" });
}