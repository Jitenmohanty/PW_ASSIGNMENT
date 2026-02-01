"use client";

import { useEffect, useState } from "react";
import { Plus, Search, LayoutGrid, List, LogOut, Sparkles, Trash2, Edit3, MessageSquare, Loader2, Pin, PinOff, RotateCcw, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import CreateIdeaModal from "@/components/CreateIdeaModal";

interface Idea {
    id: string;
    title: string;
    content: string;
    tags: string[];
    summary?: string;
    isPinned: boolean;
    isTrashed: boolean;
    createdAt: string;
}

type FilterType = "All Ideas" | "Pinned" | "AI Summaries" | "Trash";

export default function Dashboard() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("All Ideas");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const res = await fetch("/api/ideas");
            if (res.ok) {
                const data = await res.json();
                setIdeas(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteIdeaPermanently = async (id: string) => {
        if (!confirm("Are you sure you want to delete this idea permanently?")) return;
        try {
            const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });
            if (res.ok) {
                setIdeas(ideas.filter((i) => i.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTrash = async (idea: Idea) => {
        try {
            const res = await fetch(`/api/ideas/${idea.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isTrashed: !idea.isTrashed }),
            });
            if (res.ok) {
                const updated = await res.json();
                setIdeas(ideas.map((i) => (i.id === idea.id ? updated : i)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const togglePin = async (idea: Idea) => {
        try {
            const res = await fetch(`/api/ideas/${idea.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: !idea.isPinned }),
            });
            if (res.ok) {
                const updated = await res.json();
                setIdeas(ideas.map((i) => (i.id === idea.id ? updated : i)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredIdeas = ideas.filter((i) => {
        if (activeFilter === "Trash") {
            if (!i.isTrashed) return false;
        } else {
            if (i.isTrashed) return false;
        }
        if (activeFilter === "Pinned" && !i.isPinned) return false;
        if (activeFilter === "AI Summaries" && !i.summary) return false;

        const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSearch;
    });

    const openEditModal = (idea: Idea) => {
        setEditingIdea(idea);
        setIsNewModalOpen(true);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">ZenIdea</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 text-muted-foreground hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {(["All Ideas", "Pinned", "AI Summaries", "Trash"] as FilterType[]).map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveFilter(item);
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === item ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0 overflow-hidden">
                            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" alt="" /> : user?.fullName?.[0] || "U"}
                        </div>
                        <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                    </div>
                    <button onClick={() => signOut({ redirectUrl: "/" })} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                {/* Mandatory Developer Credits */}
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Developed By</p>
                    <p className="text-sm font-semibold text-white mb-2">Jiten Kumar Mohanty</p>
                    <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                        <a href="https://github.com/jiten" target="_blank" className="hover:text-primary transition-colors">GitHub</a>
                        <a href="https://linkedin.com/in/jiten" target="_blank" className="hover:text-primary transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent flex relative">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-white/5 hidden md:block">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 w-72 h-full shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 md:hidden glass rounded-xl text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{activeFilter}</h1>
                                <p className="text-sm text-muted-foreground hidden sm:block">Capture and organize your brilliance.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setEditingIdea(null);
                                setIsNewModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 md:px-5 py-2.5 premium-gradient rounded-2xl text-sm font-bold text-white transform hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden xs:inline">New Idea</span>
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group w-full flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search ideas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full"
                            />
                        </div>
                        <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10 shrink-0 self-end sm:self-auto">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-xl transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Loading your knowledge...</p>
                    </div>
                ) : filteredIdeas.length > 0 ? (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        <AnimatePresence>
                            {filteredIdeas.map((idea) => (
                                <motion.div
                                    key={idea.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`group glass rounded-3xl p-6 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden ${viewMode === "list" ? "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" : ""
                                        }`}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                        {activeFilter !== "Trash" ? (
                                            <>
                                                <button
                                                    onClick={() => togglePin(idea)}
                                                    className={`p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all ${idea.isPinned ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                                                >
                                                    {idea.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(idea)}
                                                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 text-muted-foreground hover:text-white transition-all"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleTrash(idea)}
                                                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => toggleTrash(idea)}
                                                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                                                    title="Restore"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteIdeaPermanently(idea.id)}
                                                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div className={viewMode === "list" ? "flex-1" : ""}>
                                        <div className="flex items-center gap-2 mb-3">
                                            {idea.isPinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {new Date(idea.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{idea.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                                            {idea.content}
                                        </p>
                                        {idea.summary && (
                                            <div className="mb-4 p-3 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                                                <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-1" />
                                                <p className="text-xs text-primary/80 italic leading-relaxed">{idea.summary}</p>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {idea.tags.map((tag) => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/50 border border-white/10 group-hover:border-primary/30 group-hover:text-primary/70 transition-all">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 md:p-20 glass rounded-[2rem] md:rounded-[3rem] text-center border-dashed">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-8">
                            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">No ideas found in {activeFilter}</h2>
                        <p className="text-muted-foreground max-w-sm mb-10 text-sm md:text-base leading-relaxed">
                            Your knowledge base is empty. Start by capturing your first brilliant thought.
                        </p>
                        <button
                            onClick={() => {
                                setEditingIdea(null);
                                setIsNewModalOpen(true);
                            }}
                            className="px-6 md:px-8 py-3 md:py-4 premium-gradient rounded-2xl text-base md:text-lg font-bold text-white transform hover:scale-105 transition-all shadow-xl shadow-primary/30"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </main>

            <CreateIdeaModal
                isOpen={isNewModalOpen}
                initialData={editingIdea || undefined}
                onClose={() => {
                    setIsNewModalOpen(false);
                    setEditingIdea(null);
                }}
                onSave={() => {
                    fetchIdeas();
                }}
            />
        </div>
    );
}
