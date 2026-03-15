"use client";

import React, { useState, useEffect } from "react";
import Scene from "@/components/Three/Scene";
import Navbar from "@/components/Navigation/Navbar";
import { Search, MapPin, Briefcase, Filter, ArrowUpRight, Loader2, Zap, Bookmark, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  color: string;
}

const initialJobs: Job[] = [
  { id: "j1", title: "Senior AI Engineer", company: "OpenAI", location: "San Francisco, CA", type: "Full-time", color: "from-emerald-500/20" },
  { id: "j2", title: "Product Designer", company: "Linear", location: "Remote", type: "Full-time", color: "from-blue-500/20" },
  { id: "j3", title: "Frontend Lead", company: "Vercel", location: "New York, NY", type: "Full-time", color: "from-purple-500/20" },
];

const searchedJobs: Job[] = [
  { id: "j4", title: "Machine Learning Researcher", company: "Anthropic", location: "Remote", type: "Full-time", color: "from-orange-500/20" },
  { id: "j5", title: "Lead Full Stack Developer", company: "Stripe", location: "Seattle, WA", type: "Contract", color: "from-indigo-500/20" },
  { id: "j6", title: "AI Product Manager", company: "Google", location: "Mountain View, CA", type: "Full-time", color: "from-cyan-500/20" },
];

const JobDiscovery = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(initialJobs);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await fetch("/api/jobs/saved");
        if (res.ok) {
          const data = await res.json();
          setSavedJobs(data.jobs.map((j: { job_id: string }) => j.job_id) || []);
        }
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      }
    };
    fetchSavedJobs();
  }, []);

  const toggleSaveJob = async (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedJobs.includes(job.id);
    
    try {
      if (isSaved) {
        const res = await fetch(`/api/jobs/saved?jobId=${job.id}`, { method: "DELETE" });
        if (res.ok) {
          setSavedJobs(savedJobs.filter(id => id !== job.id));
          toast.success("Job removed from saved list");
        }
      } else {
        const res = await fetch("/api/jobs/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job }),
        });
        if (res.ok) {
          setSavedJobs([...savedJobs, job.id]);
          toast.success("Job saved successfully!");
        }
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  const handleSearch = async () => {
    if (!query && !location) {
      toast.error("Please enter a role or location to search");
      return;
    }
    
    setLoading(true);
    setShowSavedOnly(false);
    
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });

      if (res.ok) {
        const data = await res.json();
        setDisplayedJobs(data.jobs || []);
        toast.success(`Found ${data.jobs.length} new opportunities matching your profile.`);
      } else {
        toast.error("Failed to discover jobs.");
      }
    } catch {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const visibleJobs = showSavedOnly 
    ? [...initialJobs, ...searchedJobs].filter(j => savedJobs.includes(j.id))
    : displayedJobs;

  return (
    <main className="relative min-h-screen pb-20">
      <Scene />
      <Navbar />

      <div className="pt-32 px-6 max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse" />
            Powered by Firecrawl
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 shimmer-text">Autonomous Discovery</h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Our AI agents crawl career pages in real-time to find roles that match your BlackForge profile.
          </p>
        </header>

        <div className="glass p-3 rounded-[2rem] border-white/10 mb-16 flex flex-col md:flex-row gap-2 shadow-2xl">
          <div className="relative flex-[2]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text"
              placeholder="What role are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent py-5 pl-14 pr-6 text-white focus:outline-none placeholder:text-zinc-600 font-medium"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-white/10 self-center" />
          <div className="relative flex-1">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent py-5 pl-14 pr-6 text-white focus:outline-none placeholder:text-zinc-600 font-medium"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 min-w-[200px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
            {loading ? "Crawling..." : "Initiate Crawl"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              {showSavedOnly ? "Saved Opportunities" : "Latest Discoveries"}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-zinc-400 border border-white/5">
                {visibleJobs.length}
              </span>
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-xl border ${
                  showSavedOnly 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-transparent text-zinc-400 hover:text-white border-transparent hover:bg-white/5"
                }`}
              >
                {showSavedOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {showSavedOnly ? "Showing Saved" : "Show Saved"}
              </button>
              <button className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5">
                <Filter className="w-4 h-4" />
                Relevance
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {visibleJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                >
                  <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium">No opportunities found. Try adjusting your search.</p>
                </motion.div>
              ) : (
                visibleJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative glass p-8 rounded-3xl border-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${job.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                    
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center font-black text-2xl shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {job.company[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">{job.title}</h3>
                        <div className="flex gap-4 text-sm font-medium text-zinc-500">
                          <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-zinc-600" /> {job.company}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-zinc-600" /> {job.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 rounded-xl bg-black/40 text-xs font-bold text-zinc-300 border border-white/5 mr-2">
                        {job.type}
                      </span>
                      <button 
                        onClick={(e) => toggleSaveJob(job, e)}
                        className={`p-3 rounded-xl transition-all border ${
                          savedJobs.includes(job.id)
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-black/40 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {savedJobs.includes(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                      <button className="p-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <span className="hidden sm:inline text-xs tracking-widest uppercase">Apply</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobDiscovery;
