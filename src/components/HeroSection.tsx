"use client";
import Link from "next/link";
import { Play, Flame, Radio, Sparkles, Tv, ShieldCheck, Eye } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
    const [viewers, setViewers] = useState(1420);

    useEffect(() => {
        const interval = setInterval(() => {
            setViewers((prev) => prev + Math.floor(Math.random() * 5) - 2);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative rounded-3xl overflow-hidden mb-12 p-6 lg:p-10 glass-panel border border-white/10 shadow-2xl">
            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                {/* Left: Text & CTA */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Next-Gen Adaptive HLS Video Platform
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                        Stream Without Limits.{" "}
                        <span className="brand-gradient-text block mt-1">
                            Watch in Real-Time.
                        </span>
                    </h1>

                    <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Experience ultra-low latency adaptive streaming powered by microservices architecture. Watch, upload, and interact with creators worldwide in crisp 4K quality.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                        <Link
                            href="/#explore"
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white brand-gradient shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            Explore Live & VOD
                        </Link>
                        <Link
                            href="/upload"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
                        >
                            <Tv className="w-4 h-4 text-purple-400" />
                            Creator Studio
                        </Link>
                    </div>

                    {/* Quick Stats Badges */}
                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-white/5 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Adaptive Multi-Bitrate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span>Zero Buffering</span>
                        </div>
                        <div className="flex items-center gap-1.5 hidden sm:flex">
                            <Radio className="w-4 h-4 text-purple-400" />
                            <span>HLS Distributed CDN</span>
                        </div>
                    </div>
                </div>

                {/* Right: Featured Stream Spotlight Card */}
                <div className="w-full lg:w-[460px] flex-shrink-0">
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-950/80 shadow-2xl group">
                        {/* Spotlight Image Overlay */}
                        <div className="relative aspect-video w-full bg-gradient-to-tr from-purple-900/40 via-zinc-900 to-indigo-950/60 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                            
                            {/* Animated Pulse Play Center */}
                            <div className="relative z-10 w-16 h-16 rounded-full brand-gradient flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white fill-white ml-1" />
                            </div>

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md animate-pulse">
                                    <Radio className="w-3 h-3" />
                                    LIVE NOW
                                </span>
                                <span className="bg-black/60 backdrop-blur-md text-zinc-200 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10">
                                    1080p 60fps
                                </span>
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-zinc-200 text-xs px-2.5 py-1 rounded-md border border-white/10">
                                <Eye className="w-3.5 h-3.5 text-purple-400" />
                                <span>{viewers.toLocaleString()} watching</span>
                            </div>

                            {/* Bottom Waveform effect */}
                            <div className="absolute bottom-3 left-4 right-4 flex items-end gap-1 h-6 opacity-60">
                                {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 65, 40].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-purple-400 rounded-t-sm animate-pulse"
                                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-4 bg-[#11121a] flex items-center justify-between border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full brand-gradient p-0.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-xs text-purple-300">
                                        SL
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                                        Streamlet Spotlight Showcase
                                    </h4>
                                    <p className="text-xs text-zinc-400">Official Channel • High-Bitrate Live</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                                Watch →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}