import { authenticateUser } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function PUT(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  const user = authenticateUser(token);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { applicationId, newDetails } = await req.json();

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    return new Response("Application not found", { status: 404 });
  }

  if (application.userId !== user.userId) {
    return new Response("You can only modify your own applications", { status: 403 });
  }

  if (application.status !== "PENDING") {
    return new Response("Application cannot be modified after approval", { status: 400 });
  }

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      details: newDetails,
    },
  });

  return Response.json({ success: true, updatedApplication });
}
