import { authenticateAdmin } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function DELETE(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  const admin = authenticateAdmin(token);
  if (!admin) return new Response("Unauthorized", { status: 401 });

  const { dcaId } = await req.json();

  const dca = await prisma.user.findUnique({ where: { id: dcaId } });

  if (!dca || dca.role !== "DCA") {
    return new Response("DCA not found", { status: 404 });
  }

  await prisma.profile.deleteMany({
    where: { userId: dcaId },
  });

  await prisma.user.delete({
    where: { id: dcaId },
  });

  return Response.json({ success: true, message: "DCA deleted successfully" });
}
