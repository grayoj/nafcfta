import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "~/lib/prisma";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    const isAdmin = decoded.role === "ADMIN";
    const isDCA = decoded.role === "DCA";

    const documents = await prisma.document.findMany({
      where: isAdmin || isDCA ? {} : { userId: decoded.id },
      orderBy: { createdAt: "desc" },
      include: {
        Application: true, // To determine status/category
      },
    });

    const files = documents.map((doc: any) => ({
      name: doc.name || "Untitled",
      description: doc.description || "No description",
      type: doc.documentType,
      category: doc.Application.length > 0 ? doc.Application[0].status : "PENDING",
      date: doc.createdAt.toISOString().split("T")[0],
      url: doc.documentUrl,
    }));

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("File fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}

