"use client";

import React from "react";
import { motion } from "framer-motion";
import Scene from "@/components/Three/Scene";
import Navbar from "@/components/Navigation/Navbar";
import { 
  LayoutDashboard, 
  FileText, 
  Youtube, 
  Search, 
  Settings,
  Plus,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Forge Master";

  const cards = [
    { title: "Resume Builder", icon: FileText, desc: "Create ATS-friendly resumes", link: "/resume", color: "from-blue-500/20" },
    { title: "Content Intelligence", icon: Youtube, desc: "Summarize any link instantly", link: "/youtube", color: "from-emerald-500/20" },
    { title: "Notes Saver", icon: Plus, desc: "Capture AI-powered notes", link: "/notes", color: "from-emerald-500/20" },
    { title: "Job Discovery", icon: Search, desc: "Find hidden opportunities", link: "/jobs", color: "from-purple-500/20" },
  ];

  return (
    <main className="relative min-h-screen">
      <Scene />
      <Navbar />

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2 shimmer-text">
            Welcome back, {userName}
          </h1>
          <p className="text-zinc-400">Your AI-powered productivity control center.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                href={card.link}
                className={`group relative block p-8 rounded-3xl metallic-card hover:border-white/20 transition-all overflow-hidden bg-gradient-to-br ${card.color} to-transparent`}
              >
                <div className="relative z-10">
                  <card.icon className="w-8 h-8 text-white mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    {card.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-zinc-400 text-sm">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Recent Activity</h2>
          <div className="glass rounded-3xl p-12 text-center border-dashed border-white/10">
            <p className="text-zinc-500">Your recent AI generations will appear here.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
