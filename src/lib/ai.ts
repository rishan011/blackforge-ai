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

export async function summarizeContent(
  content: string,
  type: "youtube" | "web" = "youtube"
): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return `[Demo Mode — Add your free GEMINI_API_KEY to .env.local to enable real AI summaries]\n\nContent preview: ${content.substring(0, 300)}...`;
  }

  const systemPrompt =
    type === "youtube"
      ? `You are an expert content analyst. Analyze the following YouTube video transcript and produce a detailed, well-structured intelligence report. Include:\n1. A concise TL;DR (1-2 sentences)\n2. Key themes and insights\n3. Important takeaways\n4. Any notable quotes or facts\n\nBe specific, insightful, and engaging.`
      : `You are an expert content analyst. Summarize the following web article into a clear, well-structured report with key points and main insights.`;

  return generate(`${systemPrompt}\n\nContent:\n${content.substring(0, 8000)}`);
}

export async function optimizeResume(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return `[Demo Mode — Add your free GEMINI_API_KEY to .env.local to enable AI Resume Optimization]\n\nGeneral tips:\n- Quantify your achievements with numbers\n- Match keywords from the job description\n- Use strong action verbs\n- Keep it concise and ATS-friendly`;
  }

  return generate(
    `You are a professional resume coach and ATS expert. Review the resume below against the job description and provide:\n1. Match score (0-100%)\n2. Missing keywords to add\n3. Specific improvements for each section\n4. An optimized version of the summary/objective section\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`
  );
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
