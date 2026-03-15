import { NextResponse } from "next/server";
import { optimizeResume } from "@/lib/ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Resume text and job description are required" }, { status: 400 });
    }

    const optimization = await optimizeResume(resumeText, jobDescription);

    return NextResponse.json(optimization);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Optimize API] Error:", error);
    return NextResponse.json(
      { error: "Failed to optimize resume", details: message },
      { status: 500 }
    );
  }
}
