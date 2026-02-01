"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">ZenIdea</span>
                </div>
                <div className="flex items-center gap-6">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2.5 premium-gradient rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                                Get Started
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
                >
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Introducing ZenIdea AI
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight"
                >
                    Your Thoughts, <br />
                    <span className="text-gradient">Enhanced by AI.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
                >
                    ZenIdea is the minimalist personal knowledge base that uses AI to automatically tag, summarize, and organize your ideas as you capture them.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="group px-8 py-4 premium-gradient rounded-2xl flex items-center gap-2 text-lg font-bold text-white hover:scale-105 transition-all shadow-xl shadow-primary/30">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard" className="group px-8 py-4 premium-gradient rounded-2xl flex items-center gap-2 text-lg font-bold text-white hover:scale-105 transition-all shadow-xl shadow-primary/30">
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </SignedIn>
                    <button className="px-8 py-4 glass rounded-2xl text-lg font-bold text-white hover:bg-white/5 transition-all text-center">
                        Watch Demo
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
                    {[
                        { icon: Zap, title: "Instant Capture", desc: "Minimalist interface designed for speed and clarity." },
                        { icon: Sparkles, title: "AI Intelligence", desc: "Automatic tagging and smart summaries for every idea." },
                        { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade security and full data ownership." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                            className="p-8 glass rounded-3xl text-left hover:border-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2 items-center md:items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white">ZenIdea</span>
                        </div>
                        <p className="text-sm text-muted-foreground">© 2026 Developed for PW Assignment.</p>
                    </div>
                    <div className="flex gap-8 items-center text-sm font-medium text-muted-foreground">
                        <a href="https://github.com/jiten" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                        <a href="https://linkedin.com/in/jiten" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
                        <span className="text-white font-semibold">Jiten Kumar Mohanty</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
