"use client";

import { useState } from "react";
import { Plus, Sparkles, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (idea: any) => void;
}

export default function CreateIdeaModal({ isOpen, onClose, onSave }: IdeaModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleAddTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const generateAIProps = async () => {
        if (!content) return;
        setIsAIProcessing(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                body: JSON.stringify({ content, type: "tags" }),
            });
            const data = await res.json();
            if (data.tags) {
                setTags(Array.from(new Set([...tags, ...data.tags])));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAIProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, tags }),
            });
            if (res.ok) {
                const newIdea = await res.json();
                onSave(newIdea);
                setTitle("");
                setContent("");
                setTags([]);
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-secondary/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass"
                    >
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Capture Idea</h2>
                                <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Idea Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full bg-transparent border-none text-2xl font-bold text-white placeholder:text-muted-foreground focus:ring-0 p-0"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Write your thoughts..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full bg-transparent border-none text-lg text-muted-foreground placeholder:text-muted-foreground/50 focus:ring-0 p-0 resize-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateAIProps}
                                            disabled={isAIProcessing || !content}
                                            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl flex items-center gap-2 text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            {isAIProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            AI Tags
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 premium-gradient rounded-2xl text-white font-bold hover:scale-105 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Idea
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
