import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "~/lib/prisma";

export async function GET(request: Request) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!existing) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL!,
          password: hashed,
          role: "ADMIN",
        },
      });
      return NextResponse.json({ message: "Admin created" }, { status: 201 });
    }

    return NextResponse.json({ message: "Admin already exists" }, { status: 200 });
  } catch (err) {
    console.error("Error seeding admin:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
