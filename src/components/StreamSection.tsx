"use client";
import api from "@/apis/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Eye, Flame, Sparkles, CheckCircle2, Film } from "lucide-react";

export default function StreamsSection() {
    const [activeFilter, setActiveFilter] = useState("All");

    const categories = ["All", "Trending", "Live 4K", "Gaming", "Technology", "Music", "Podcasts"];

    const { data: streams, isLoading } = useQuery({
        queryKey: ["videos-index"],
        queryFn: async () => {
            try {
                const response = await api.get("/videos");
                return response.data || [];
            } catch (e) {
                console.error("Failed to load videos:", e);
                return [];
            }
        }
    });

    return (
        <section className="mb-14" id="explore">
            {/* Category Filter Chips */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                activeFilter === cat
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                                    : "glass-panel text-zinc-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                        <Flame className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Recommended Streams & VODs</h2>
                        <p className="text-xs text-zinc-400">Hand-picked adaptive multi-bitrate streams</p>
                    </div>
                </div>
                <span className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer">
                    View All ({streams?.length || 0})
                </span>
            </div>

            {/* Skeleton Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="glass-card rounded-2xl overflow-hidden animate-pulse p-2">
                            <div className="aspect-[16/9] w-full bg-white/5 rounded-xl mb-3" />
                            <div className="p-2 space-y-2">
                                <div className="h-4 bg-white/10 rounded-md w-4/5" />
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white/10 rounded-full" />
                                    <div className="h-3 bg-white/10 rounded-md w-1/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !streams || streams.length === 0 ? (
                /* Empty State */
                <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-8 border border-white/10">
                    <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                        <Film className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No streams available right now</h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                        Be the first creator to upload a video or launch a live adaptive stream.
                    </p>
                    <Link
                        href="/upload"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white brand-gradient mt-5 shadow-md shadow-purple-500/30 hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        Upload First Video
                    </Link>
                </div>
            ) : (
                /* Stream Card Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {streams.map((stream: any) => (
                        <StreamCard key={stream.id || stream._id} stream={stream} />
                    ))}
                </div>
            )}
        </section>
    );
}

type Stream = {
    id: string;
    title: string;
    description: string;
    videoId: string;
    uploadStatus: string;
    visibility: string;
    createdAt: string;
    channelId: string;
    channel?: {
        id: string;
        channelName: string;
        description: string;
        profilePictureUrl: string;
        createdAt: string;
        userId: string;
    };
    engagements?: {
        _id: string;
        viewCount: number;
        likeCount: number;
        dislikeCount: number;
    };
};

function StreamCard({ stream }: { stream: Stream }) {
    const [imgError, setImgError] = useState(false);
    const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL || "http://localhost:8002";
    const channelName = stream.channel?.channelName || "Streamlet Creator";
    const initial = channelName.charAt(0).toUpperCase();

    // Format relative time helper
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return "recently";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return "just now";
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between">
            {/* Thumbnail Box */}
            <div className="relative flex-shrink-0 aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                <Link href={`/watch?v=${stream.videoId}`} className="block w-full h-full relative">
                    {!imgError ? (
                        <Image
                            unoptimized
                            width={360}
                            height={202}
                            src={`${CONTENT_URL}/watch/${stream.videoId}/main.png`}
                            alt={stream.title}
                            onError={() => setImgError(true)}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        /* Fallback Gradient Thumbnail with Waveform */
                        <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-zinc-900 to-indigo-950 flex flex-col items-center justify-center p-4">
                            <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {initial}
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-400 mt-2 truncate max-w-[80%]">
                                {stream.title}
                            </span>
                        </div>
                    )}

                    {/* Hover Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center shadow-lg shadow-purple-500/50 scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                    </div>

                    {/* Quality & Duration Badges */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="bg-black/70 backdrop-blur-md text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded-md border border-white/10">
                            4K HDR
                        </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5">
                        <span className="bg-black/80 backdrop-blur-md text-[10px] font-medium text-white px-2 py-0.5 rounded-md border border-white/10">
                            10:24
                        </span>
                    </div>
                </Link>
            </div>

            {/* Video Details */}
            <div className="p-4 flex gap-3">
                {/* Channel Avatar */}
                <Link href={stream.channel?.id ? `/channel/${stream.channel.id}` : "#"} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full brand-gradient p-0.5 shadow-sm hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-[11px] font-bold text-purple-300">
                            {initial}
                        </div>
                    </div>
                </Link>

                {/* Title & Metadata */}
                <div className="flex-1 min-w-0">
                    <Link href={`/watch?v=${stream.videoId}`}>
                        <h4 className="font-bold text-sm text-zinc-100 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                            {stream.title}
                        </h4>
                    </Link>

                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400">
                        <span className="truncate hover:text-zinc-200 transition-colors">{channelName}</span>
                        <CheckCircle2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {stream.engagements?.viewCount ? `${stream.engagements.viewCount.toLocaleString()} views` : "New stream"}
                        </span>
                        <span>•</span>
                        <span>{timeAgo(stream.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

