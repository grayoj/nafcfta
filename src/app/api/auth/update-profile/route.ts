import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const { userId, fullName, company, phone, address } = await req.json();

  const updatedProfile = await prisma.profile.upsert({
    where: { userId },
    update: { fullName, company, phone, address },
    create: { userId, fullName, company, phone, address },
  });

  return Response.json({ success: true, profile: updatedProfile });
}

