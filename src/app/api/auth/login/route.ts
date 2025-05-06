import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  if (user.role !== "EXPORTER" && user.role !== "IMPORTER") {
    return new Response("Unauthorized role", { status: 403 });
  }

  if (!user.isVerified) {
    return new Response("Account not verified", { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
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
