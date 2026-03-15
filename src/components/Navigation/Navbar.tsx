"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl glass rounded-full px-8 py-4 flex items-center justify-between shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] border-white/10"
    >
      <Link href="/" className="text-xl font-bold tracking-tighter shimmer-text">
        BLACKFORGE
      </Link>

      <div className="hidden md:flex flex-1 items-center justify-center gap-8">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Features</Link>
        <Link href="/resume" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Resume</Link>
        <Link href="/youtube" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Intelligence</Link>
        <Link href="/jobs" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Jobs</Link>
      </div>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse border border-white/5" />
        ) : session ? (
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">{session.user?.name}</span>
             </div>
             <button 
               onClick={() => signOut({ callbackUrl: "/" })}
               className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all group"
               title="Sign Out"
             >
               <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
             </button>
          </div>
        ) : (
          <>
            <Link 
              href="/login" 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2 rounded-full metallic-card text-sm font-semibold border-white/10 hover:border-white/20 transition-all"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
