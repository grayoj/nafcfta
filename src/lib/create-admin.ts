import bcrypt from "bcryptjs";
import { prisma } from "~/lib/prisma";

async function storeAdminCredentialsIfNotExist() {
  const admin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL! },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
    await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL!,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
  }
}

storeAdminCredentialsIfNotExist()
