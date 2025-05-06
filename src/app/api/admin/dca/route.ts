import { NextResponse } from "next/server";
import { authenticateAdmin } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1];
  const admin = authenticateAdmin(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dcas = await prisma.user.findMany({
    where: { role: "DCA" },
    include: {
      profile: true,
    },
  });

  return NextResponse.json({ dcas });
}


