import { NextResponse } from "next/server";
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
      .from("resumes")
      .select("*")
      .eq("user_id", session.user.email)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is code for 'no rows found'
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resume: data || null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, content } = await req.json();

    if (!supabase) {
      return NextResponse.json({ error: "Cloud storage not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("resumes")
      .upsert({
        user_id: session.user.email,
        name: name || "Untitled Resume",
        content: content, // This will be stored as JSONB
        last_modified: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
