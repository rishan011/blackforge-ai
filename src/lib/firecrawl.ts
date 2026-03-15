// BlackForge AI - Firecrawl Job Search Service
// Provides real job search via Firecrawl API with graceful fallback to rich demo data.
//
// To activate: Add FIRECRAWL_API_KEY to .env.local

export interface JobResult {
  title: string;
  company: string;
  location: string;
  type: string;
  url?: string;
  salary?: string;
  description?: string;
  color: string;
}

const DEMO_JOB_COLORS = [
  "from-emerald-500/20",
  "from-blue-500/20",
  "from-purple-500/20",
  "from-amber-500/20",
  "from-rose-500/20",
  "from-cyan-500/20",
];

// Generate rich demo jobs dynamically based on the search query
function generateDemoJobs(query: string, location: string): JobResult[] {
  const roles = [
    { title: `Senior ${query} Engineer`, company: "Vercel", salary: "$160K - $220K" },
    { title: `${query} Lead`, company: "Linear", salary: "$140K - $180K" },
    { title: `Staff ${query} Developer`, company: "Stripe", salary: "$180K - $240K" },
    { title: `${query} Architect`, company: "Anthropic", salary: "$200K - $280K" },
    { title: `Principal ${query} Engineer`, company: "OpenAI", salary: "$220K - $300K" },
    { title: `${query} Specialist`, company: "GitHub", salary: "$130K - $175K" },
  ];

  return roles.map((role, index) => ({
    title: role.title,
    company: role.company,
    location: location || "Remote",
    type: "Full-time",
    url: `https://careers.${role.company.toLowerCase().replace(/\s+/g, "")}.com`,
    salary: role.salary,
    description: `Join ${role.company} as a ${role.title}. We are looking for passionate professionals to help shape the future of technology.`,
    color: DEMO_JOB_COLORS[index % DEMO_JOB_COLORS.length],
  }));
}

export async function searchJobs(query: string, location: string = "Remote"): Promise<JobResult[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.warn("[Firecrawl] FIRECRAWL_API_KEY not set - using demo data");
    return generateDemoJobs(query, location);
  }

  try {
    // Use Firecrawl to scrape job boards autonomously
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${query} jobs ${location}`,
        limit: 8,
      }),
    });

    if (!response.ok) {
      console.error("[Firecrawl] API Error:", response.status);
      return generateDemoJobs(query, location);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return generateDemoJobs(query, location);
    }

    // Map Firecrawl results to our JobResult interface
    return data.data.map((item: { title: string; url: string; description?: string; metadata?: { siteName?: string }; markdown?: string }, index: number) => ({
      title: item.title || `${query} Role`,
      company: item.metadata?.siteName || new URL(item.url || "https://example.com").hostname.replace("www.", ""),
      location: location,
      type: "Full-time",
      url: item.url,
      description: item.description || item.markdown?.substring(0, 150),
      color: DEMO_JOB_COLORS[index % DEMO_JOB_COLORS.length],
    }));
  } catch (error) {
    console.error("[Firecrawl] Error:", error);
    return generateDemoJobs(query, location);
  }
}
