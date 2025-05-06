import { authenticateAdmin } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

enum Role {
  ADMIN = "ADMIN",
  DCA = "DCA",
  EXPORTER = "EXPORTER",
  IMPORTER = "IMPORTER",
}

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const admin = authenticateAdmin(token);

  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roleParam = searchParams.get("role");

  if (!roleParam || !Object.values(Role).includes(roleParam as Role)) {
    return new Response("Invalid or missing role", { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        role: roleParam as Role,
      },
      include: {
        profile: true,
      },
    });

    return Response.json({ success: true, users });
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    return new Response("Error retrieving users", { status: 500 });
  }
}
