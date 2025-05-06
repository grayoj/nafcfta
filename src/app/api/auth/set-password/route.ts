import bcrypt from "bcryptjs";
import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { userId, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hash,
      isVerified: true,
      verification: { delete: true },
    },
  });

  return Response.json({ success: true });
}

