import { NextRequest } from "next/server";
import { createSession, sessionCookieOptions, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return Response.json({ error: "ADMIN_PASSWORD not configured" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return Response.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const token = await createSession();
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieOptions(token));

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Auth failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return Response.json({ success: true });
}
