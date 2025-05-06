// src/app/api/applications/dca/route.ts
import { authenticateDCA } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function PUT(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const dca = authenticateDCA(token);

  if (!dca) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { applicationId, status, comment } = await req.json();

  // ensure status is approved or declined
  if (!["APPROVED", "DECLINED"].includes(status)) {
    return new Response("Invalid status. Use APPROVED or DECLINED.", { status: 400 });
  }

  // load the application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application) {
    return new Response("Application not found", { status: 404 });
  }
  if (application.status !== "PENDING") {
    return new Response("Cannot modify application after decision", { status: 400 });
  }

  // 1) update only the status on the Application
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  // 2) record the comment in its own table
  await prisma.applicationComment.create({
    data: {
      applicationId,
      userId: dca.sub,      // or dca.id depending on your JWT payload
      comment,
    },
  });

  return Response.json({ success: true, updatedApplication });
}
