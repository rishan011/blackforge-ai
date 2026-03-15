"use client";

import React, { useState, useEffect } from "react";
import Scene from "@/components/Three/Scene";
import Navbar from "@/components/Navigation/Navbar";
import { Plus, Search, Calendar, MoreVertical, Sparkles, LayoutGrid, List, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  tag: string;
}

const NotesSaver = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", tag: "General" });
  
  useEffect(() => {
    const saved = localStorage.getItem("blackforge_notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes([
        { id: "1", title: "Project Launch Plan", date: "Mar 15, 2026", content: "Key objectives for the BlackForge AI release...", tag: "Work" },
        { id: "2", title: "Three.js Optimization", date: "Mar 14, 2026", content: "Notes on reducing draw calls and geometry simpl...", tag: "Research" },
        { id: "3", title: "UI Inspiration", date: "Mar 12, 2026", content: "Dark mode, metallic surfaces, glassmorphism ref...", tag: "Design" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("blackforge_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) {
      toast.error("Title and content are required.");
      return;
    }
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tag: newNote.tag,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    
    setNotes([note, ...notes]);
    toast.success("Note saved successfully!");
    setNewNote({ title: "", content: "", tag: "General" });
    setIsModalOpen(false);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    toast.success("Note deleted");
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="relative min-h-screen pb-20">
      <Scene />
      <Navbar />

      <div className="pt-32 px-6 max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 shimmer-text">Intelligence Vault</h1>
            <p className="text-zinc-400 text-lg">Your second brain, organized by BlackForge AI.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="glass p-1 rounded-xl flex">
              <button 
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search your vault..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-all font-medium backdrop-blur-md"
          />
        </div>

        <div className={`grid ${view === "grid" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"} gap-6`}>
          <AnimatePresence>
            {filteredNotes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="metallic-card p-8 rounded-3xl group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => deleteNote(note.id, e)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5 group-hover:border-white/20 transition-all">
                    {note.tag}
                  </span>
                  <MoreVertical className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{note.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3 whitespace-pre-wrap">{note.content}</p>
                
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 uppercase tracking-widest mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {note.date}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500/0 group-hover:text-emerald-500 transition-all">
                    <Sparkles className="w-3 h-3" />
                    AI Summary
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No notes found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* New Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Capture Intel
              </h2>
              
              <form onSubmit={handleCreateNote} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={e => setNewNote({...newNote, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all"
                  autoFocus
                />
                
                <input
                  type="text"
                  placeholder="Tag (e.g. Research, Logic, Setup)"
                  value={newNote.tag}
                  onChange={e => setNewNote({...newNote, tag: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all text-sm"
                />
                
                <textarea
                  placeholder="Start pouring your thoughts..."
                  value={newNote.content}
                  onChange={e => setNewNote({...newNote, content: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all h-40 resize-none"
                />
                
                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white text-black font-bold mt-2 hover:bg-zinc-200 transition-colors"
                >
                  Save to Vault
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default NotesSaver;
