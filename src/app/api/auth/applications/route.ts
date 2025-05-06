// src/app/api/auth/applications/route.ts
import { prisma } from "~/lib/prisma";
import cloudinary from "cloudinary";
import { authenticateUser } from "~/lib/auth";

const { v2: cloudinaryV2 } = cloudinary;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: Blob) {
  // Turn the uploaded file into a base64-encoded Data URI
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataURI = `data:${file.type};base64,${base64}`;

  return cloudinaryV2.uploader.upload(dataURI, { resource_type: "auto" });
}

export async function POST(req: Request) {
  // 1. Authenticate the user
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const decoded = authenticateUser(auth);
  if (!decoded) return new Response("Unauthorized", { status: 401 });

  // 2. Pull fields + file from the multipart/form-data
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const documentType = formData.get("documentType")?.toString();

  if (!file || !name || !description || !documentType) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    // 3. Upload to Cloudinary
    const result: any = await uploadToCloudinary(file);

    // 4. Persist document + application in Prisma
    const document = await prisma.document.create({
      data: {
        userId: decoded.sub,
        documentUrl: result.secure_url,
        documentType,
        name,
        description,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: decoded.sub,
        documentId: document.id,
        details: description,
        status: "PENDING",
        submissionDate: new Date(),
      },
    });

    return Response.json({ success: true, document, application });
  } catch (error) {
    console.error("Upload/Application Error:", error);
    return new Response("Error uploading document or creating application", { status: 500 });
  }
}
