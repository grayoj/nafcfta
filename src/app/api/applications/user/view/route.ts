import { authenticateUser } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  const user = authenticateUser(token);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        document: true,
      },
    });

    return Response.json({ success: true, applications });
  } catch (error) {
    return new Response("Error retrieving applications", { status: 500 });
  }
}
