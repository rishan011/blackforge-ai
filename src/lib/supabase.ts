// BlackForge AI - Supabase Client
// To activate: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
// Get these from: supabase.com -> Your Project -> Settings -> API

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Returns null gracefully if env vars are not yet configured
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ---- Helper functions ----

export async function saveYoutubeSummary(
  userId: string,
  youtubeUrl: string,
  summary: string
) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("summaries").insert([
    { user_id: userId, youtube_url: youtubeUrl, summary },
  ]);
  if (error) console.error("[Supabase] saveYoutubeSummary error:", error);
  return data;
}

export async function getUserSummaries(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("[Supabase] getUserSummaries error:", error);
  return data || [];
}

export async function saveResume(userId: string, resumeData: object) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("resumes").insert([
    { user_id: userId, resume_data: resumeData },
  ]);
  if (error) console.error("[Supabase] saveResume error:", error);
  return data;
}

export async function getUserResumes(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("[Supabase] getUserResumes error:", error);
  return data || [];
}

export async function upsertUser(user: {
  id: string;
  email: string;
  name?: string;
}) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("users").upsert(
    [{ id: user.id, email: user.email, name: user.name }],
    { onConflict: "email" }
  );
  if (error) console.error("[Supabase] upsertUser error:", error);
  return data;
}
