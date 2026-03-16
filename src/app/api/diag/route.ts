import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Basic security to prevent accidental leaks
  if (secret !== "blackforge_diag_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      VERCEL_URL: process.env.VERCEL_URL || "MISSING",
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_ID_SET: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SECRET_SET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
    },
    headers: Object.fromEntries(request.headers.entries()),
  });
}
