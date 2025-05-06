import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "~/lib/mail";
import { prisma } from "~/lib/prisma";

const generatePassword = (): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 12 }, () => charset[randomInt(0, charset.length)]).join("");
};

export async function POST(req: Request) {
  const { email } = await req.json();

  const code = String(randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const plainPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } else {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  await prisma.verificationCode.upsert({
    where: { userId: user.id },
    update: { code, expiresAt },
    create: {
      userId: user.id,
      code,
      expiresAt,
    },
  });

  await sendVerificationEmail(email, `Your verification code is: ${code}<br>Your password is: ${plainPassword}`);

  return Response.json({ success: true, password: plainPassword });
}
