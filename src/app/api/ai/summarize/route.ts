import { NextResponse } from "next/server";
import { summarizeContent } from "@/lib/ai";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Cloud storage not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("user_id", session.user.email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map DB structure to frontend SummaryResult structure
    const history = data.map((item: { id: number; summary: string; youtube_url: string; created_at: string; title?: string }) => {
      try {
        const parsed = JSON.parse(item.summary);
        return {
          ...parsed,
          id: item.id.toString(),
          url: item.youtube_url,
          date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        };
      } catch (_e) {
        return {
          id: item.id.toString(),
          url: item.youtube_url,
          title: item.title,
          tldr: item.summary,
          date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        };
      }
    });

    return NextResponse.json({ history });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { url, type } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[Summarize] Starting ${type || "content"} summary for:`, url);

    // Call the centralized AI service
    const result = await summarizeContent(url, type || "web");

    // Save to Supabase if authenticated and DB is configured
    if (session?.user?.email && supabase) {
      try {
        const { error } = await supabase.from("summaries").insert([
          {
            user_id: session.user.email,
            youtube_url: url,
            title: result.title,
            summary: JSON.stringify(result), // Store structured data as stringified JSON
          },
        ]);
        if (error) console.error("[Summarize] Supabase Save Error:", error);
      } catch (err) {
        console.error("[Summarize] Supabase Integration Error:", err);
      }
    }

    return NextResponse.json({ ...result, id: Date.now().toString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Summarize API] Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize content", details: message },
      { status: 500 }
    );
  }
}
