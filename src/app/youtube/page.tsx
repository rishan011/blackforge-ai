"use client";

import React, { useState, useEffect } from "react";
import Scene from "@/components/Three/Scene";
import Navbar from "@/components/Navigation/Navbar";
import { Youtube, Search, Loader2, Sparkles, FileText, Clock, History, Trash2, CheckCircle2, ChevronRight, BrainCircuit, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface KeyInsight {
  title: string;
  description: string;
}

interface SummaryResult {
  id: string;
  url: string;
  title: string;
  duration: string;
  tldr: string;
  detailedSummary: string;
  keyInsights: KeyInsight[];
  actionItems: string[];
  date: string;
}

const YouTubeSummarizer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [history, setHistory] = useState<SummaryResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("blackforge_yt_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newResult: SummaryResult) => {
    const updatedHistory = [newResult, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("blackforge_yt_history", JSON.stringify(updatedHistory));
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("blackforge_yt_history", JSON.stringify(updatedHistory));
    if (result && result.id === id) setResult(null);
    toast.success("Summary removed from history");
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSummarize = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Invalid URL format. Please enter a valid HTTP/HTTPS link.");
      return;
    }

    setLoading(true);
    
    // Check if it already exists in history
    const existing = history.find(h => h.url === url);
    if (existing) {
      toast.info("Retrieved from history.");
      setResult(existing);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract intelligence");
      }

      const data = await response.json();

      const newSummary: SummaryResult = {
        id: Date.now().toString(),
        url: url,
        title: data.title || "Unknown Content",
        duration: data.duration || "N/A",
        tldr: data.tldr || "No summary available.",
        detailedSummary: data.detailedSummary || "No detailed summary available.",
        keyInsights: data.keyInsights || [],
        actionItems: data.actionItems || [],
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
      };

      setResult(newSummary);
      saveToHistory(newSummary);
      toast.success("Intelligence Extracted successfully!");
      setUrl("");
    } catch (error) {
      toast.error("Could not fetch intelligence. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen pb-20">
      <Scene />
      <Navbar />

      <div className="pt-32 px-6 max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 relative z-10">
        
        {/* Main Content Area */}
        <div className="flex-1 max-w-5xl">
          <header className="mb-12">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 shimmer-text">Content Intelligence</h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">Input any YouTube URL, Article, or Chat Link and let BlackForge AI autonomously extract, structure, and synthesize the core insights.</p>
          </header>

          <div className="glass p-4 sm:p-6 rounded-[2rem] border-white/10 mb-12 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Paste any URL here (e.g., chatgpt.com/...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSummarize()}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl py-5 pl-16 pr-6 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg font-medium"
                />
              </div>
              <button 
                onClick={handleSummarize}
                disabled={loading}
                className="px-8 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] min-w-[200px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5 text-emerald-600" />}
                {loading ? "Synthesizing..." : "Extract Intelligence"}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                key={result.id}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Header Card */}
                <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 bg-[length:200%_100%] animate-gradient"></div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                          Synthesis Complete
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-500 text-sm font-bold">
                          <Clock className="w-4 h-4" /> {result.duration}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black text-white leading-tight">
                        {result.title}
                      </h2>
                    </div>
                  </div>

                  {/* TL;DR Section */}
                  <div className="p-6 rounded-2xl bg-emerald-500/5 text-emerald-100/90 border border-emerald-500/10 mb-10 text-lg leading-relaxed font-medium">
                    <span className="font-black text-emerald-400 mr-2">TL;DR:</span>
                    {result.tldr}
                  </div>
                  
                  <div className="space-y-12">
                    {/* Detailed Summary */}
                    <div>
                      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-zinc-500" /> Executive Summary
                      </h3>
                      <p className="text-zinc-300 text-lg leading-[1.8] font-medium">
                        {result.detailedSummary}
                      </p>
                    </div>

                    {/* Key Insights Grid */}
                    <div>
                      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Target className="w-5 h-5 text-cyan-500" /> Key Insights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.keyInsights.map((insight, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-white font-bold mb-3 flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              {insight.title}
                            </h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              {insight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recommended Actions
                      </h3>
                      <div className="space-y-3">
                        {result.actionItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mt-0.5">
                              <span className="text-emerald-500 text-xs font-bold">{i + 1}</span>
                            </div>
                            <span className="text-zinc-300 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 px-6 border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02]"
              >
                <div className="w-20 h-20 mx-auto bg-black/50 border border-white/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <Sparkles className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300 mb-2">Awaiting Intelligence</h3>
                <p className="text-zinc-500 font-medium max-w-md mx-auto">Paste a URL above to generate a comprehensive, structured briefing of any YouTube video.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar History */}
        <div className="w-full xl:w-96 space-y-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <History className="w-5 h-5 text-zinc-400" />
            <h3 className="font-black text-zinc-200 uppercase tracking-widest text-sm">Extraction History</h3>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <p className="text-zinc-600 font-medium text-sm">No recent extractions.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setResult(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group relative ${
                    result?.id === item.id 
                      ? "bg-white/[0.08] border-white/20 shadow-lg" 
                      : "bg-black/40 border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                  }`}
                >
                  <button 
                    onClick={(e) => deleteFromHistory(item.id, e)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-base text-zinc-200 line-clamp-2 pr-10 mb-3 leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">{item.date}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/10 px-2 py-1 rounded-md">Stored</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default YouTubeSummarizer;
