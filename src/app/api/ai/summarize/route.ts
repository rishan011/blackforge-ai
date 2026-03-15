import { NextResponse } from "next/server";
import { summarizeContent } from "@/lib/ai";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { url, type } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[Summarize] Starting ${type || "content"} summary for:`, url);

    // Call the centralized AI service
    const summary = await summarizeContent(url, type || "web");

    // Save to Supabase if authenticated and DB is configured
    if (session?.user?.email && supabase) {
      try {
        const { error } = await supabase.from("summaries").insert([
          {
            user_id: session.user.id || session.user.email,
            youtube_url: url,
            title: url.includes("youtube.com") ? "YouTube Video" : "Web Article",
            summary: summary,
          },
        ]);
        if (error) console.error("[Summarize] Supabase Save Error:", error);
        else console.log("[Summarize] Successfully saved to Supabase");
      } catch (err) {
        console.error("[Summarize] Supabase Integration Error:", err);
      }
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("[Summarize API] Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize content", details: error.message },
      { status: 500 }
    );
  }
}
