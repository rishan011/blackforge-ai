"use client";

import React, { useState, useEffect } from "react";
import Scene from "@/components/Three/Scene";
import Navbar from "@/components/Navigation/Navbar";
import { motion } from "framer-motion";
import { FileText, Plus, Sparkles, Download, Layout, Type, Briefcase, GraduationCap, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
}

interface ResumeData {
  name: string;
  role: string;
  summary: string;
  experience: Experience[];
}

const defaultData: ResumeData = {
  name: "Alex Forge",
  role: "Senior AI Engineer",
  summary: "Experienced AI engineer specializing in agentic workflows and large scale model deployment.",
  experience: [
    { id: "1", company: "BlackForge AI", role: "Lead Developer", period: "2024 - Present" }
  ]
};

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [resumeData, setResumeData] = useState<ResumeData>(defaultData);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const { resume } = await res.json();
          if (resume && resume.content) {
            setResumeData(resume.content);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      }
    };
    fetchResume();
  }, []);

  const saveResume = async (data: ResumeData) => {
    setResumeData(data);
    try {
      await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, content: data }),
      });
    } catch (err) {
      console.error("Failed to save resume:", err);
    }
  };

  const updateField = (field: keyof ResumeData, value: string) => {
    saveResume({ ...resumeData, [field]: value });
  };

  const addExperience = () => {
    const newExp = { id: Date.now().toString(), company: "New Company", role: "Title", period: "Year - Year" };
    saveResume({ ...resumeData, experience: [...resumeData.experience, newExp] });
    toast.success("Experience added");
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExp = resumeData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    saveResume({ ...resumeData, experience: updatedExp });
  };

  const removeExperience = (id: string) => {
    saveResume({ ...resumeData, experience: resumeData.experience.filter(exp => exp.id !== id) });
    toast.success("Experience removed");
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeText: JSON.stringify(resumeData), 
          jobDescription: resumeData.role // Using role as a proxy for JD if not provided
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedResume = {
          ...resumeData,
          summary: data.optimizedSummary || resumeData.summary
        };
        saveResume(updatedResume);
        toast.success("Summary optimized by AI");
      } else {
        toast.error("Optimization failed.");
      }
    } catch (err) {
      toast.error("An error occurred during optimization.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePrint = () => {
    toast.success("Preparing PDF...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <main className="relative min-h-screen">
      <div className="print:hidden">
        <Scene />
        <Navbar />
      </div>

      <div className="pt-32 px-6 h-[calc(100vh-8rem)] max-w-[1600px] mx-auto flex gap-6 print:block print:p-0 print:m-0 print:h-auto print:max-w-none">
        
        {/* Editor Side (Hidden in Print) */}
        <div className="w-1/2 flex flex-col gap-6 overflow-hidden print:hidden z-10">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold shimmer-text">Forge Resume</h1>
            <div className="flex gap-2 p-1 glass rounded-xl">
              <button 
                onClick={() => setActiveTab("content")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "content" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                Content
              </button>
              <button 
                onClick={() => setActiveTab("design")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "design" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                Design
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-20">
            <section className="glass p-8 rounded-3xl border-white/5 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3 text-zinc-400 font-bold text-sm uppercase tracking-wider">
                <Type className="w-4 h-4" />
                Personal Info
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-550">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-550">Role</label>
                  <input 
                    type="text" 
                    value={resumeData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-550">Professional Summary</label>
                <textarea 
                  value={resumeData.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  rows={5}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20 transition-all resize-none font-medium leading-relaxed"
                />
              </div>
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isOptimizing ? <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
                {isOptimizing ? "Forging optimization..." : "AI Optimize Summary"}
              </button>
            </section>

            <section className="glass p-8 rounded-3xl border-white/5 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-400 font-bold text-sm uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  Experience
                </div>
                <button 
                  onClick={addExperience}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white border border-white/10 hover:border-white/20 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-black/30 border border-white/5 relative group">
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 pr-10">
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        className="bg-transparent border-b border-white/10 focus:border-white/30 text-white font-bold pb-1 outline-none transition-colors"
                        placeholder="Company"
                      />
                      <input 
                        type="text" 
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                        className="bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm font-medium pb-1 outline-none transition-colors"
                        placeholder="2020 - Present"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 focus:border-white/30 text-zinc-400 text-sm pb-1 outline-none transition-colors"
                      placeholder="Job Title"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Preview Side (Visible in Print) */}
        <div className="w-1/2 flex flex-col gap-6 z-10 print:w-full print:block">
          <header className="flex items-center justify-between print:hidden">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Live Preview</h2>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </header>

          <div className="flex-1 bg-white text-black rounded-3xl p-16 shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-y-auto print:shadow-none print:p-0">
            <div className="mb-12">
              <h1 className="text-5xl font-black tracking-tighter mb-2">{resumeData.name}</h1>
              <p className="text-xl font-medium text-zinc-600 uppercase tracking-wider">{resumeData.role}</p>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4">Summary</h3>
                <p className="text-sm leading-relaxed text-zinc-800 font-medium">{resumeData.summary}</p>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4">Experience</h3>
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="mb-6">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg">{exp.company}</h4>
                      <span className="text-sm font-bold text-zinc-500">{exp.period}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-600">{exp.role}</p>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResumeBuilder;
