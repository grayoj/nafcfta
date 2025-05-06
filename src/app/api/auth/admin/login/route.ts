import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== "ADMIN") {
    return new Response("Invalid credentials or not an admin", { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return Response.json({ token });
}
