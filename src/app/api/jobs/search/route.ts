import { NextResponse } from "next/server";
import { searchJobs } from "@/lib/firecrawl";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const jobs = await searchJobs(query, location || "Remote");

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[Jobs API] Error:", error);
    return NextResponse.json({ error: "Failed to discover jobs" }, { status: 500 });
  }
}
