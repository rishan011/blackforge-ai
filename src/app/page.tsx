import React from "react";
import Navbar from "@/components/Navigation/Navbar";
import Scene from "@/components/Three/Scene";
import { MoveRight, Zap, FileText, Youtube, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen selection:bg-white/10 selection:text-white">
      <Scene />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-52 lg:pt-64 pb-32 px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
          Production-Ready AI Ecosystem
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] max-w-5xl">
          Forge your future with <br className="hidden md:block" />
          <span className="shimmer-text">Next-Gen Intelligence</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
          The all-in-one platform for high-performance builders. Build professional resumes, 
          summarize YouTube content in seconds, and find your next role using autonomous AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button className="px-8 py-4 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all group shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Start Building Free
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-full glass border-white/10 text-white font-semibold hover:border-white/20 hover:bg-white/5 transition-all">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Quick Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metallic-card p-8 rounded-2xl group">
          <FileText className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-3">Resume Builder</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            AI-optimized templates designed by recruiting experts to bypass ATS systems.
          </p>
        </div>
        
        <div className="metallic-card p-8 rounded-2xl group">
          <Youtube className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-3">Video Intelligence</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instant insights and summaries from any YouTube video using deep learning.
          </p>
        </div>

        <div className="metallic-card p-8 rounded-2xl group">
          <Zap className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-3">AI Notes Saver</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Capture ideas and let AI organize, categorize, and expand your thoughts.
          </p>
        </div>

        <div className="metallic-card p-8 rounded-2xl group">
          <Search className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-3">Smart Job Search</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Crawls career sites autonomously to find hidden opportunities that match your skill set.
          </p>
        </div>
      </section>
    </main>
  );
}
