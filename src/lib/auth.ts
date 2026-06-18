import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "nmc_admin_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const [adminId, secret] = Buffer.from(token, "base64")
      .toString()
      .split(":");
    if (secret !== process.env.SESSION_SECRET) return null;
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(adminId) },
    });
    return admin;
  } catch {
    return null;
  }
}

export function createSessionToken(adminId: number) {
  const secret = process.env.SESSION_SECRET || "nmc-blog-secret-2024";
  return Buffer.from(`${adminId}:${secret}`).toString("base64");
}

export { SESSION_COOKIE };
