import { prisma } from "~/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await req.json();

  const applications = await prisma.application.findMany({
    where: { userId },
  });

  return Response.json({ applications });
}
