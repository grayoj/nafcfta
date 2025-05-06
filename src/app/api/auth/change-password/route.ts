import bcrypt from "bcryptjs";
import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { email, currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  if (user.role !== "EXPORTER" && user.role !== "IMPORTER") {
    return new Response("Unauthorized role", { status: 403 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return new Response("Invalid current password", { status: 401 });
  }

  if (currentPassword === newPassword) {
    return new Response("New password cannot be the same as the current password", { status: 400 });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedNewPassword },
  });

  return Response.json({ success: true, message: "Password updated successfully" });
}

