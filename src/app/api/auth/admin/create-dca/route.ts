import { authenticateAdmin } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  // 1) Authenticate admin
  const authHeader = req.headers.get("authorization")?.split(" ")[1];
  const admin = authenticateAdmin(authHeader);
  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2) Read & validate payload
  const { email, fullName, company, phone, address } = await req.json();
  if (!email || !fullName || !company) {
    return new Response("Missing required fields", { status: 400 });
  }

  // 3) Generate and hash a secure password
  const generatedPassword = randomBytes(6).toString("base64"); // ~12 chars
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  // 4) Create DCA user in DB
  const dca = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "DCA",
      isVerified: true,       // auto-verify DCA accounts
      profile: {
        create: { fullName, company, phone, address },
      },
    },
  });

  // 5) Send the welcome email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: Number(process.env.SMTP_PORT!) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const mailHtml = `
    <p>Dear ${fullName},</p>
    <p>
      You have been created as a <strong>DCA</strong> on the AFCFTA Nigeria Portal.
    </p>
    <p>
      Your temporary password is:
      <code>${generatedPassword}</code>
    </p>
    <p>
      Please <a href="https://your-domain.com/login">log in</a> and change your password immediately.
    </p>
    <p>— The AFCFTA Team</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to: email,
    subject: "Your DCA account on AFCFTA Nigeria",
    text: `Hello ${fullName}, your temporary password is: ${generatedPassword}`,
    html: mailHtml,
  });

  // 6) Done
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
