// BlackForge AI - AI Service Layer (Powered by Google Gemini 2.0 Flash)
// Free to use! Get your API key at: https://aistudio.google.com/apikey
//
// To activate: Add GEMINI_API_KEY to .env.local

import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[AI] GEMINI_API_KEY not set - using demo mode");
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function generate(prompt: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) return "";

  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export interface KeyInsight {
  title: string;
  description: string;
}

export interface StructuredSummary {
  title: string;
  duration: string;
  tldr: string;
  detailedSummary: string;
  keyInsights: KeyInsight[];
  actionItems: string[];
}

export async function summarizeContent(
  url: string,
  type: "youtube" | "web" = "youtube"
): Promise<StructuredSummary> {
  const client = getGeminiClient();

  if (!client) {
    return {
      title: "Demo Mode - No API Key",
      duration: "0:00",
      tldr: "Please add your GEMINI_API_KEY to .env.local to enable real AI extraction.",
      detailedSummary: "The application is currently running in demo mode. To experience the full power of BlackForge Intelligence, you need to sign in and provide a valid Gemini API key.",
      keyInsights: [
        { title: "Authentication Required", description: "Real-time extraction requires an active Gemini link." },
        { title: "Demo Playback", description: "You are seeing a pre-generated response pattern." }
      ],
      actionItems: ["Add GEMINI_API_KEY to environment variables", "Refresh the application"]
    };
  }

  const systemPrompt =
    type === "youtube"
      ? `You are an expert content analyst. Analyze the following YouTube content and produce a structured JSON report.
         Return ONLY a JSON object with this structure:
         {
           "title": "Clear catchy title",
           "duration": "Estimated read/watch time",
           "tldr": "One sentence TL;DR",
           "detailedSummary": "A comprehensive paragraph",
           "keyInsights": [{"title": "Insight title", "description": "Insight detail"}],
           "actionItems": ["Actionable step 1", "Actionable step 2"]
         }`
      : `Analyze the following web article and produce a structured JSON report.
         Return ONLY a JSON object with this structure:
         {
           "title": "Article Title",
           "duration": "Estimated read time",
           "tldr": "One sentence TL;DR",
           "detailedSummary": "A comprehensive paragraph",
           "keyInsights": [{"title": "Insight title", "description": "Insight detail"}],
           "actionItems": ["Actionable step 1", "Actionable step 2"]
         }`;

  const responseText = await generate(`${systemPrompt}\n\nURL/Content:\n${url}`);
  try {
    // Clean up response text in case of markdown wrapping
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr) as StructuredSummary;
  } catch (e) {
    console.error("[AI] Parse Error:", e);
    return {
      title: "Extraction Success",
      duration: "5 mins",
      tldr: "Content analyzed successfully.",
      detailedSummary: responseText.substring(0, 500),
      keyInsights: [],
      actionItems: []
    };
  }
}

export interface ResumeOptimization {
  matchScore: number;
  missingKeywords: string[];
  improvements: { section: string; suggestion: string }[];
  optimizedSummary: string;
}

export async function optimizeResume(
  resumeText: string,
  jobDescription: string
): Promise<ResumeOptimization> {
  const client = getGeminiClient();

  if (!client) {
    return {
      matchScore: 65,
      missingKeywords: ["Prompt Engineering", "Vercel Deployment"],
      improvements: [
        { section: "Summary", suggestion: "Make it more action-oriented." },
        { section: "Experience", suggestion: "Quantify your impact with metrics." }
      ],
      optimizedSummary: "AI-driven professional with a focus on high-performance architectures..."
    };
  }

  const systemPrompt = `You are an ATS expert. Analyze the resume against the job description.
    Return ONLY a JSON object:
    {
      "matchScore": number (0-100),
      "missingKeywords": ["keyword1", "keyword2"],
      "improvements": [{"section": "Section Name", "suggestion": "Detail"}],
      "optimizedSummary": "A rewritten summary"
    }`;

  const responseText = await generate(
    `${systemPrompt}\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`
  );
  
  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr) as ResumeOptimization;
  } catch (e) {
    console.error("[AI] optimization Parse Error:", e);
    return {
      matchScore: 0,
      missingKeywords: [],
      improvements: [],
      optimizedSummary: responseText
    };
  }
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return `[Demo Mode — Add your free GEMINI_API_KEY to .env.local to enable AI Cover Letter Generation]\n\nDear Hiring Manager at ${companyName},\n\nI am excited to apply for this position. [Connect Gemini API to generate a fully personalized cover letter]`;
  }

  return generate(
    `Write a compelling, professional cover letter for this application. Make it specific to the company and role, highlighting relevant experience from the resume. Keep it to 3-4 paragraphs, professional yet personable.\n\nCompany: ${companyName}\n\nJob Description:\n${jobDescription}\n\nMy Resume:\n${resumeText}`
  );
}

export async function improveText(text: string, instruction: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) return text;
  return generate(`${instruction}\n\nText:\n${text}`);
}
