import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev-secret-key-change-in-prod";
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  return password === adminPassword;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = crypto.randomBytes(32).toString("hex");
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(token + timestamp)
    .digest("hex");

  cookieStore.set("admin_session", `${token}.${timestamp}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  if (!sessionCookie) return false;

  const [token, timestamp, signature] = sessionCookie.split(".");
  if (!token || !timestamp || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(token + timestamp)
    .digest("hex");

  if (signature !== expectedSignature) return false;

  const sessionAge = Date.now() - parseInt(timestamp);
  if (sessionAge > SESSION_MAX_AGE * 1000) return false;

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
