"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  LogIn, 
  Command, 
  Sparkles, 
  Youtube, 
  FileText, 
  Search, 
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";
import Scene from "@/components/Three/Scene";

const features = [
  {
    icon: Youtube,
    title: "Content Intelligence",
    desc: "Extract TL;DR and key insights from any video or web link in seconds.",
    color: "text-emerald-400"
  },
  {
    icon: FileText,
    title: "Forge Resume",
    desc: "AI-powered resume optimization to outsmart ATS systems.",
    color: "text-blue-400"
  },
  {
    icon: Search,
    title: "Autonomous Discovery",
    desc: "Real-time job board crawling matched to your unique professional profile.",
    color: "text-purple-400"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Invalid credentials.");
      } else {
        toast.success("Access granted. Initializing neural workspace...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Neural uplink failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-sans">
      <Scene />
      
      {/* Left Side: Branding & Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Command className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">BLACKFORGE AI</span>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Forge Your <span className="shimmer-text">Future</span> with Intelligence.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg mb-12 leading-relaxed"
          >
            The ultimate neural workstation for professional evolution. 
            Automate your career growth with autonomous agents.
          </motion.p>

          {/* Features List */}
          <div className="space-y-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                    {f.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-6 text-xs font-bold text-zinc-600 tracking-widest uppercase"
        >
          <div className="flex items-center gap-2 italic">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            SECURE ACCESS 2.0
          </div>
          <div className="flex items-center gap-2 italic">
            <Globe className="w-4 h-4 text-blue-500" />
            GLOBAL NEURAL SYNC
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Flow */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="metallic-card p-10 rounded-3xl border border-white/10 glass shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="text-center mb-10 relative z-10">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Command className="w-6 h-6 text-black" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-3">System Access</h1>
              <p className="text-zinc-500 text-sm">Enter your credentials to engage the forge.</p>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Google Auth */}
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  <span className="bg-[#050505] px-4">Neural Credentials</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                    Command Identity (Email)
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all font-mono text-sm"
                    placeholder="name@blackforge.ai"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                      Access Token (Password)
                    </label>
                    <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Forgot?</a>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all font-mono text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Engage Protocol
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-zinc-500">
                  New operator? <Link href="/signup" className="text-white hover:underline transition-all font-bold ml-1">Establish Link</Link>
                </p>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex justify-center items-center gap-4 text-[10px] font-bold text-zinc-700 tracking-widest uppercase"
          >
            <div className="flex items-center gap-1.5 grayscale opacity-50">
              <Zap className="w-3 h-3" />
              Real-time Processing
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="flex items-center gap-1.5 grayscale opacity-50">
              <Sparkles className="w-3 h-3" />
              AI Orchestration
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
