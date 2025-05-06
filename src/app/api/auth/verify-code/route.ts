import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { verification: true },
  });

  if (!user || !user.verification) {
    return new Response("Invalid request", { status: 400 });
  }

  const now = new Date();
  if (user.verification.code !== code || user.verification.expiresAt < now) {
    return new Response("Invalid or expired code", { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  return Response.json({ success: true, userId: user.id });
}
