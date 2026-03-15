import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If Supabase is configured, fetch user data.
  if (supabase) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is not found
        console.error("[User API] Supabase Error:", error);
      }

      if (user) {
        return NextResponse.json({ user });
      }
    } catch (error) {
      console.error("[User API] Fetch Error:", error);
    }
  }

  // Fallback: return session data if no user in DB or DB not configured
  return NextResponse.json({
    user: {
      id: "session-user",
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      createdAt: new Date().toISOString(),
    },
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
  }

  if (supabase) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .upsert(
          { 
            id: session.user.id || session.user.email, // Use id if available, fallback to email as unique ID
            email: session.user.email, 
            name: name.trim() 
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (error) {
        console.error("[User API] Supabase Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ user });
    } catch (error) {
      console.error("[User API] Update Error:", error);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
  }

  // Fallback: return updated data without a DB
  return NextResponse.json({
    user: {
      id: "session-user",
      name: name.trim(),
      email: session.user.email,
    },
  });
}
